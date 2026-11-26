package com.fuwuwaibao.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fuwuwaibao.entity.OrderCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@ConditionalOnProperty(name = "cinema.kafka.enabled", havingValue = "true")
public class OrderNotificationConsumer {
    private static final Logger log = LoggerFactory.getLogger(OrderNotificationConsumer.class);
    private final JdbcTemplate jdbc;
    private final ObjectMapper json;

    public OrderNotificationConsumer(JdbcTemplate jdbc, ObjectMapper json) {
        this.jdbc = jdbc;
        this.json = json;
    }

    @KafkaListener(topics = "${cinema.kafka.topic}")
    @Transactional
    public void consume(String payload) throws JsonProcessingException {
        OrderCreatedEvent event = json.readValue(payload, OrderCreatedEvent.class);
        // event_id 主键去重：发布成功但事件箱尚未提交时重发，也只生成一条通知。
        int rows = jdbc.update("INSERT INTO order_notification(event_id,order_id,user_id,message) VALUES (?,?,?,?) " +
                        "ON DUPLICATE KEY UPDATE event_id=order_notification.event_id",
                event.eventId(), event.orderId(), event.userId(), "订单 #" + event.orderId() + " 已创建，可在我的订单中查看。");
        log.info("Kafka 订单事件已处理：{}，数据库影响行数：{}", event.eventId(), rows);
    }
}
