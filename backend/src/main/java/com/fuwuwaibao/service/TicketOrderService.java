package com.fuwuwaibao.service;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class TicketOrderService {
    private static final Pattern PRICE = Pattern.compile("\\d+(?:\\.\\d{1,2})?");
    private static final String ORDER_VIEW = "SELECT id,show_id AS showId,movie_name AS name,poster_url AS url," +
            "hall_name AS area,CONCAT(show_date,' ',show_start) AS date,seat_summary AS seat," +
            "total_price AS price,status AS isBuy,created_at AS createdAt FROM ticket_order ";
    private final JdbcTemplate jdbc;
    private final SeatLockService locks;

    public TicketOrderService(JdbcTemplate jdbc, SeatLockService locks) {
        this.jdbc = jdbc;
        this.locks = locks;
    }

    public Map<String, Object> show(int id) {
        List<Map<String, Object>> rows = jdbc.queryForList("SELECT * FROM buyTicket WHERE buy_id=?", id);
        if (rows.isEmpty()) throw error(HttpStatus.NOT_FOUND, "场次不存在");
        Map<String, Object> show = rows.get(0);
        List<String> posters = jdbc.queryForList("SELECT url FROM movie_content WHERE id=?", String.class, show.get("id"));
        show.put("url", posters.isEmpty() ? "/icon/logo.png" : posters.get(0));
        return show;
    }

    public List<Map<String, Object>> seats(int showId) {
        show(showId);
        // 原 seatings 没有每个场次的库存；新增订单座位按 show_id 独立占用。
        // 旧版本已标为不可选的座位继续保留，避免凭空恢复为可售。
        List<Map<String, Object>> rows = jdbc.queryForList("SELECT s.id,CASE WHEN t.id IS NOT NULL OR s.state<>1 " +
                "THEN 3 ELSE 1 END AS state FROM seatings s LEFT JOIN ticket_order_seat t " +
                "ON t.seat_id=s.id AND t.show_id=? ORDER BY s.id", showId);
        for (int i = 0; i < rows.size(); i++) {
            rows.get(i).put("row", i / 9 + 1);
            rows.get(i).put("column", i % 9 + 1);
        }
        return rows;
    }

    public List<Map<String, Object>> orders(int userId, int userType) {
        if (userId <= 0 || userType < 1 || userType > 3) throw error(HttpStatus.BAD_REQUEST, "用户信息不正确");
        return jdbc.queryForList(ORDER_VIEW + "WHERE user_id=? AND user_type=? ORDER BY id DESC", userId, userType);
    }

    /** 一个事务保存整单及全部座位；场次行锁和唯一约束保障多副本/锁降级时也不会重复售出。 */
    @Transactional
    public Map<String, Object> book(int userId, int userType, int showId, List<Integer> requestedSeats, String requestId) {
        if (userId <= 0 || userType < 1 || userType > 3 || showId <= 0 || requestedSeats == null ||
                requestedSeats.isEmpty() || requestedSeats.size() > 5 || requestedSeats.stream().anyMatch(id -> id == null || id <= 0) ||
                new HashSet<>(requestedSeats).size() != requestedSeats.size() || requestId == null || !requestId.matches("[A-Za-z0-9-]{8,64}")) {
            throw error(HttpStatus.BAD_REQUEST, "请选择 1 至 5 个不同座位，并提供完整登录信息");
        }
        String accountTable = Map.of(1, "user", 2, "member", 3, "admin").get(userType);
        if (jdbc.queryForObject("SELECT COUNT(*) FROM `" + accountTable + "` WHERE id=?", Integer.class, userId) != 1) {
            throw error(HttpStatus.BAD_REQUEST, "登录用户不存在");
        }
        List<Integer> seatIds = requestedSeats.stream().sorted().toList();
        return locks.withShowLock(showId, () -> createLocked(userId, userType, showId, seatIds, requestId));
    }

    private Map<String, Object> createLocked(int userId, int userType, int showId, List<Integer> seatIds, String requestId) {
        if (jdbc.queryForList("SELECT buy_id FROM buyTicket WHERE buy_id=? FOR UPDATE", showId).isEmpty()) {
            throw error(HttpStatus.NOT_FOUND, "场次不存在");
        }
        List<Map<String, Object>> previous = jdbc.queryForList(
                "SELECT id,show_id FROM ticket_order WHERE user_id=? AND user_type=? AND request_id=? FOR UPDATE", userId, userType, requestId);
        if (!previous.isEmpty()) {
            long previousId = ((Number) previous.get(0).get("id")).longValue();
            List<Integer> previousSeats = jdbc.queryForList("SELECT seat_id FROM ticket_order_seat WHERE order_id=? ORDER BY seat_id FOR UPDATE", Integer.class, previousId);
            if (((Number) previous.get(0).get("show_id")).intValue() != showId || !previousSeats.equals(seatIds)) {
                throw error(HttpStatus.CONFLICT, "购票内容已变化，请刷新后重试");
            }
            return jdbc.queryForMap(ORDER_VIEW + "WHERE id=?", previousId);
        }
        Map<String, Object> show = show(showId);
        List<Map<String, Object>> available = seats(showId);
        Map<Integer, Map<String, Object>> byId = available.stream().collect(Collectors.toMap(
                seat -> ((Number) seat.get("id")).intValue(), seat -> seat));
        // 锁定读获取最新已售座位，避免 MySQL REPEATABLE READ 的旧快照忽略刚提交的订单。
        Set<Integer> occupied = new HashSet<>(jdbc.queryForList(
                "SELECT seat_id FROM ticket_order_seat WHERE show_id=? FOR UPDATE", Integer.class, showId));
        for (int id : seatIds) {
            if (!byId.containsKey(id) || occupied.contains(id) || ((Number) byId.get(id).get("state")).intValue() != 1) {
                throw error(HttpStatus.CONFLICT, "所选座位已被购买或不可选，请重新选座");
            }
        }
        String summary = seatIds.stream().map(id -> byId.get(id).get("row") + "排" + byId.get(id).get("column") + "座")
                .collect(Collectors.joining("、"));
        String priceText = String.valueOf(show.get(userType == 2 ? "vip_price" : "price"));
        var match = PRICE.matcher(priceText);
        if (!match.find()) throw error(HttpStatus.CONFLICT, "该场次暂无有效票价");
        BigDecimal unitPrice = new BigDecimal(match.group());
        BigDecimal total = unitPrice.multiply(BigDecimal.valueOf(seatIds.size()));
        GeneratedKeyHolder keys = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement("INSERT INTO ticket_order " +
                    "(user_id,user_type,show_id,request_id,movie_name,poster_url,hall_name,show_date,show_start,seat_summary,unit_price,total_price) " +
                    "VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", new String[]{"id"});
            Object[] values = {userId,userType,showId,requestId,show.get("movie_name"),show.get("url"),show.get("seat"),
                    show.get("time"),show.get("time_start"),summary,unitPrice,total};
            for (int i = 0; i < values.length; i++) statement.setObject(i + 1, values[i]);
            return statement;
        }, keys);
        if (keys.getKey() == null) throw new IllegalStateException("订单保存失败");
        long orderId = keys.getKey().longValue();
        for (int id : seatIds) {
            jdbc.update("INSERT INTO ticket_order_seat(order_id,show_id,seat_id) VALUES (?,?,?)", orderId, showId, id);
        }
        return jdbc.queryForMap(ORDER_VIEW + "WHERE id=?", orderId);
    }

    private ResponseStatusException error(HttpStatus status, String message) {
        return new ResponseStatusException(status, message);
    }
}
