package com.fuwuwaibao.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Redis 缓存服务。
 *
 * <p>封装了缓存的读、写、删除操作，并对所有 Redis 操作做了异常兜底：
 * Redis 没启动或连接超时时，只打印警告并返回 null / 忽略写入，
 * 调用方继续查数据库，保证「缓存故障不影响主业务」。</p>
 */
@Service
public class CacheService {

    private static final Logger log = LoggerFactory.getLogger(CacheService.class);

    private final RedisTemplate<String, Object> redisTemplate;

    public CacheService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 读取缓存，未命中或 Redis 异常时返回 null。
     */
    public Object get(String key) {
        try {
            return redisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            log.warn("Redis 读取失败，降级为直接查询数据库；key={}，原因={}", key, e.getMessage());
            return null;
        }
    }

    /**
     * 写入缓存并设置过期时间。
     *
     * @param key   缓存键
     * @param value 缓存内容（实体或集合，会被序列化成 JSON）
     * @param ttl   过期时间
     */
    public void set(String key, Object value, Duration ttl) {
        try {
            redisTemplate.opsForValue().set(key, value, ttl);
            log.info("Redis 缓存已写入：key={}，过期时间={} 分钟", key, ttl.toMinutes());
        } catch (Exception e) {
            log.warn("Redis 写入失败，本次忽略缓存；key={}，原因={}", key, e.getMessage());
        }
    }

    /**
     * 删除缓存（数据变更后调用，避免读到旧数据）。
     */
    public void evict(String key) {
        try {
            redisTemplate.delete(key);
            log.info("Redis 缓存已清除：key={}", key);
        } catch (Exception e) {
            log.warn("Redis 删除失败；key={}，原因={}", key, e.getMessage());
        }
    }
}
