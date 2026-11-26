package com.fuwuwaibao.config;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.XMemcachedClientBuilder;
import net.rubyeye.xmemcached.utils.AddrUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
@ConditionalOnProperty(name = "memcached.enabled", havingValue = "true")
public class MemcachedConfig {
    @Bean(destroyMethod = "shutdown")
    public MemcachedClient memcachedClient(@Value("${memcached.servers}") String servers) throws IOException {
        XMemcachedClientBuilder builder = new XMemcachedClientBuilder(AddrUtil.getAddresses(servers));
        builder.setConnectTimeout(1000);
        MemcachedClient client = builder.build();
        client.setOpTimeout(500);
        return client;
    }
}
