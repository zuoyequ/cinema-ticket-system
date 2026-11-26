package com.fuwuwaibao.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis 配置类。
 *
 * <p>作用：把 Spring Boot 自动配置的 RedisConnectionFactory 包装成一个
 * key 用字符串、value 用 JSON 的 RedisTemplate，方便直接缓存实体对象和集合。</p>
 *
 * <p>之所以不用默认的 JdkSerializationRedisSerializer：
 * 默认序列化会把数据写成二进制，redis-cli 里看不出来，也不方便课程演示；
 * 换成 JSON 之后可以直接在 redis-cli 里看到可读的缓存内容。</p>
 */
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // key 使用普通字符串，value 使用 JSON（会自动带上类型信息，反序列化时能还原实体类）
        StringRedisSerializer keySerializer = new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer valueSerializer = new GenericJackson2JsonRedisSerializer();

        template.setKeySerializer(keySerializer);
        template.setHashKeySerializer(keySerializer);
        template.setValueSerializer(valueSerializer);
        template.setHashValueSerializer(valueSerializer);
        template.afterPropertiesSet();
        return template;
    }
}
