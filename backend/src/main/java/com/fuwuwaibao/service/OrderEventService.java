package com.fuwuwaibao.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fuwuwaibao.entity.OrderCreatedEvent;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.UUID;

@Service
public class OrderEventService {
    private final JdbcTemplate jdbc;
    private final ObjectMapper json;

    public OrderEventService(JdbcTemplate jdbc, ObjectMapper json) {
        this.jdbc = jdbc;
        this.json = json;
    }

    /** 订单与事件原子提交；接口不等待 Kafka，保留原有的影响行数返回格式。 */
    @Transactional
    public int createOrder(int userId, int productId, int addressId, String isDefault, String isBuy) {
        GeneratedKeyHolder keys = new GeneratedKeyHolder();
        int rows = jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO shopping_order(userid,shoppingid,address_id,isDefault,isBuy) VALUES (?,?,?,?,?)",
                    Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, userId);
            statement.setInt(2, productId);
            statement.setInt(3, addressId);
            statement.setString(4, isDefault);
            statement.setString(5, isBuy);
            return statement;
        }, keys);
        if (rows != 1 || keys.getKey() == null) throw new IllegalStateException("订单创建失败");
        OrderCreatedEvent event = new OrderCreatedEvent(UUID.randomUUID().toString(),
                keys.getKey().intValue(), userId, productId);
        try {
            jdbc.update("INSERT INTO order_event_outbox(event_id,order_id,payload) VALUES (?,?,?)",
                    event.eventId(), event.orderId(), json.writeValueAsString(event));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("订单事件序列化失败", e);
        }
        return rows;
    }
}
