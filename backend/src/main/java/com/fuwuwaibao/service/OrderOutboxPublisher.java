package com.fuwuwaibao.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@ConditionalOnProperty(name = "cinema.kafka.enabled", havingValue = "true")
public class OrderOutboxPublisher {
    private static final Logger log = LoggerFactory.getLogger(OrderOutboxPublisher.class);
    private final JdbcTemplate jdbc;
    private final KafkaTemplate<String, String> kafka;
    private final String topic;

    public OrderOutboxPublisher(JdbcTemplate jdbc, KafkaTemplate<String, String> kafka,
                               @Value("${cinema.kafka.topic}") String topic) {
        this.jdbc = jdbc;
        this.kafka = kafka;
        this.topic = topic;
    }

    @Scheduled(fixedDelayString = "${cinema.kafka.publish-delay-ms:2000}")
    @Transactional
    public void publishPending() {
        // 锁住本批事件，多副本跳过已被其他副本锁住的行。
        for (Map<String, Object> row : jdbc.queryForList(
                "SELECT event_id,order_id,payload FROM order_event_outbox WHERE sent_at IS NULL " +
                        "ORDER BY created_at,event_id LIMIT 10 FOR UPDATE SKIP LOCKED")) {
            String id = row.get("event_id").toString();
            try {
                kafka.send(topic, row.get("order_id").toString(), row.get("payload").toString())
                        .get(8, TimeUnit.SECONDS);
                jdbc.update("UPDATE order_event_outbox SET sent_at=CURRENT_TIMESTAMP,attempts=attempts+1 WHERE event_id=?", id);
                log.info("订单事件已发布到 Kafka：{}", id);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            } catch (Exception e) {
                jdbc.update("UPDATE order_event_outbox SET attempts=attempts+1 WHERE event_id=?", id);
                log.warn("Kafka 发布失败，事件 {} 留在事件箱等待重试：{}", id, e.getMessage());
                break;
            }
        }
    }
}
