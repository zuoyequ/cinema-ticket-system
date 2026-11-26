package com.fuwuwaibao;

import com.fuwuwaibao.service.SeatLockService;
import com.fuwuwaibao.service.TicketOrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

import static org.assertj.core.api.Assertions.*;

@JdbcTest(properties = {"spring.sql.init.mode=never", "spring.datasource.generate-unique-name=true"})
@Import({TicketOrderService.class, SeatLockService.class})
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class TicketOrderTest {
    @Autowired JdbcTemplate jdbc;
    @Autowired TicketOrderService tickets;

    @BeforeEach
    void prepare() {
        jdbc.execute("SET MODE MySQL");
        for (String table : List.of("ticket_order_seat", "ticket_order", "buyTicket", "movie_content", "seatings", "user", "member", "admin")) {
            jdbc.execute("DROP TABLE IF EXISTS `" + table + "`");
        }
        new ResourceDatabasePopulator(new ClassPathResource("db/middleware.sql")).execute(jdbc.getDataSource());
        for (String table : List.of("user", "member", "admin")) {
            jdbc.execute("CREATE TABLE `" + table + "`(id INT PRIMARY KEY)");
            jdbc.execute("INSERT INTO `" + table + "` VALUES(1),(2)");
        }
        jdbc.execute("CREATE TABLE movie_content(id INT PRIMARY KEY,url VARCHAR(255))");
        jdbc.execute("INSERT INTO movie_content VALUES(1,'/icon/01.jpg')");
        jdbc.execute("CREATE TABLE buyTicket(buy_id INT PRIMARY KEY,id INT,movie_name VARCHAR(100),seat VARCHAR(100)," +
                "time VARCHAR(30),time_start VARCHAR(20),price VARCHAR(30),vip_price VARCHAR(30))");
        jdbc.execute("INSERT INTO buyTicket VALUES(1,1,'测试电影','五号厅','3月7日','13:40','32.9起','VIP 29.9元起')," +
                "(2,1,'测试电影','五号厅','3月7日','18:40','32.9起','VIP 29.9元起')");
        jdbc.execute("CREATE TABLE seatings(id INT PRIMARY KEY,state INT)");
        jdbc.execute("INSERT INTO seatings VALUES(1,1),(2,1),(3,3)");
    }

    @Test
    void createsMultiSeatOrderAndFiltersByAccountAndRole() {
        Map<String, Object> order = tickets.book(2, 1, 1, List.of(1, 2), "test-order-001");
        assertThat(order.get("name")).isEqualTo("测试电影");
        assertThat((BigDecimal) order.get("price")).isEqualByComparingTo("65.80");
        assertThat(order.get("seat")).isEqualTo("1排1座、1排2座");
        assertThat(tickets.orders(2, 1)).hasSize(1);
        assertThat(tickets.orders(1, 1)).isEmpty();
        assertThat(tickets.orders(2, 2)).isEmpty();
        assertThat(count("ticket_order_seat")).isEqualTo(2);
        assertThat(tickets.seats(1).get(0).get("state")).isEqualTo(3);
        assertThat(tickets.seats(2).get(0).get("state")).isEqualTo(1);
    }

    @Test
    void replayReturnsSameOrderButChangedPayloadIsRejected() {
        Object id = tickets.book(2, 1, 1, List.of(1), "retry-order-001").get("id");
        assertThat(tickets.book(2, 1, 1, List.of(1), "retry-order-001").get("id")).isEqualTo(id);
        assertThat(count("ticket_order")).isEqualTo(1);
        assertThatThrownBy(() -> tickets.book(2, 1, 1, List.of(2), "retry-order-001"))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void cannotBuySoldOrNonexistentOrRepeatedSeats() {
        for (List<Integer> selection : List.of(List.of(1, 3), List.of(999), List.of(1, 1))) {
            assertThatThrownBy(() -> tickets.book(2, 1, 1, selection, "invalid-order-001"))
                    .isInstanceOf(ResponseStatusException.class);
        }
        assertThat(count("ticket_order")).isZero();
        assertThat(count("ticket_order_seat")).isZero();
    }

    @Test
    void failureAfterFirstSeatRollsBackWholeOrder() {
        jdbc.execute("ALTER TABLE ticket_order_seat ADD CONSTRAINT fail_second_seat CHECK (seat_id<>2)");
        assertThatThrownBy(() -> tickets.book(2, 1, 1, List.of(1, 2), "rollback-order-001"))
                .isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);
        assertThat(count("ticket_order")).isZero();
        assertThat(count("ticket_order_seat")).isZero();
    }

    @Test
    void sameSeatCanBeBookedForDifferentShowsAndMemberPriceIsServerCalculated() {
        tickets.book(2, 1, 1, List.of(1), "show-one-001");
        Map<String, Object> member = tickets.book(1, 2, 2, List.of(1), "show-two-001");
        assertThat((BigDecimal) member.get("price")).isEqualByComparingTo("29.90");
        assertThat(count("ticket_order")).isEqualTo(2);
    }

    @Test
    void concurrentBuyersProduceExactlyOneOrder() throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);
        try {
            Future<Boolean> first = pool.submit(() -> compete(1, ready, start));
            Future<Boolean> second = pool.submit(() -> compete(2, ready, start));
            assertThat(ready.await(5, TimeUnit.SECONDS)).isTrue();
            start.countDown();
            assertThat(List.of(first.get(10, TimeUnit.SECONDS), second.get(10, TimeUnit.SECONDS)))
                    .containsExactlyInAnyOrder(true, false);
            assertThat(count("ticket_order")).isEqualTo(1);
            assertThat(count("ticket_order_seat")).isEqualTo(1);
        } finally { pool.shutdownNow(); }
    }

    private boolean compete(int userId, CountDownLatch ready, CountDownLatch start) throws Exception {
        ready.countDown();
        start.await();
        try { tickets.book(userId, 1, 1, List.of(1), "concurrent-" + userId); return true; }
        catch (ResponseStatusException e) { assertThat(e.getStatusCode().value()).isEqualTo(409); return false; }
    }

    @Test
    void simultaneousRetriesReturnTheSameOrder() throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);
        try {
            Future<Boolean> first = pool.submit(() -> compete(2, ready, start));
            Future<Boolean> second = pool.submit(() -> compete(2, ready, start));
            assertThat(ready.await(5, TimeUnit.SECONDS)).isTrue();
            start.countDown();
            assertThat(first.get(10, TimeUnit.SECONDS)).isTrue();
            assertThat(second.get(10, TimeUnit.SECONDS)).isTrue();
            assertThat(count("ticket_order")).isEqualTo(1);
        } finally { pool.shutdownNow(); }
    }

    private int count(String table) { return jdbc.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class); }
}
