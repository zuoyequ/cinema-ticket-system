package com.fuwuwaibao.webcontroller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class OrderNotificationController {
    private final JdbcTemplate jdbc;

    public OrderNotificationController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/order_notifications")
    public List<Map<String, Object>> notifications(@RequestParam int id) {
        return jdbc.queryForList("SELECT order_id AS orderId,message,created_at AS createdAt " +
                "FROM order_notification WHERE user_id=? ORDER BY created_at DESC,event_id DESC LIMIT 10", id);
    }
}
