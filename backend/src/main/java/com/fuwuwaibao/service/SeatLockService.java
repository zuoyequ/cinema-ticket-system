package com.fuwuwaibao.service;

import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.recipes.locks.InterProcessMutex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.function.IntSupplier;
import java.util.function.Supplier;

@Service
public class SeatLockService {
    private static final Logger log = LoggerFactory.getLogger(SeatLockService.class);
    private final CuratorFramework curatorFramework;
    private final ConcurrentHashMap<Integer, InterProcessMutex> locks = new ConcurrentHashMap<>();

    public SeatLockService(ObjectProvider<CuratorFramework> provider) {
        this.curatorFramework = provider.getIfAvailable();
    }

    public int updateSeatWithLock(int seatId, IntSupplier action) {
        return execute(seatId, action::getAsInt);
    }

    public <T> T withShowLock(int showId, Supplier<T> action) {
        return execute(-showId, action);
    }

    private <T> T execute(int key, Supplier<T> action) {
        if (curatorFramework == null || !curatorFramework.getZookeeperClient().isConnected()) {
            return action.get(); // 影票交易仍由 MySQL 场次行锁和唯一约束保护。
        }
        InterProcessMutex mutex = locks.computeIfAbsent(key,
                id -> new InterProcessMutex(curatorFramework, "/cinema/lock/seat/" + id));
        boolean acquired;
        try {
            acquired = mutex.acquire(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("购票请求已中断", e);
        } catch (Exception e) {
            log.warn("ZooKeeper 获取锁失败，使用数据库事务保护：{}", e.getMessage());
            return action.get();
        }
        if (!acquired) throw new ResponseStatusException(HttpStatus.CONFLICT, "场次正在处理，请稍后重试");
        try {
            // 业务异常必须传播，不能因为异常再次执行购票操作。
            return action.get();
        } finally {
            try { mutex.release(); }
            catch (Exception e) { log.warn("ZooKeeper 释放锁失败：{}", e.getMessage()); }
        }
    }
}
