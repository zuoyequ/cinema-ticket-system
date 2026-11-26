package com.fuwuwaibao.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fuwuwaibao.entity.Shopping;
import net.rubyeye.xmemcached.MemcachedClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;

import java.util.List;

/** Memcached 仅保存可重新查询的商品数据，异常时交给调用方查询 MySQL。 */
@Service
public class ProductCacheService {
    static final String KEY = "cinema:shopping:list:v1";
    private static final Logger log = LoggerFactory.getLogger(ProductCacheService.class);
    private final MemcachedClient client;
    private final ObjectMapper json;

    public ProductCacheService(ObjectProvider<MemcachedClient> clients, ObjectMapper json) {
        this.client = clients.getIfAvailable();
        this.json = json;
    }

    public List<Shopping> get() {
        if (client == null) return null;
        try {
            String value = client.get(KEY);
            if (value == null) return null;
            List<Shopping> products = json.readValue(value, new TypeReference<List<Shopping>>() {});
            log.info("商品列表命中 Memcached 缓存：{}", KEY);
            return products;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return null;
        } catch (Exception e) {
            log.warn("Memcached 读取失败，直接查询数据库：{}", e.getMessage());
            return null;
        }
    }

    public void set(List<Shopping> products) {
        if (client == null) return;
        try {
            client.set(KEY, 600, json.writeValueAsString(products));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            log.warn("Memcached 写入失败，忽略缓存：{}", e.getMessage());
        }
    }

    public void evict() {
        if (client == null) return;
        try {
            client.delete(KEY);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } catch (Exception e) {
            log.warn("Memcached 删除失败，缓存将在 TTL 后过期：{}", e.getMessage());
        }
    }
}
