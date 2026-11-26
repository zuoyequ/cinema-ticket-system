package com.fuwuwaibao.config;

import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.state.ConnectionState;
import org.apache.curator.retry.RetryOneTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * ZooKeeper 配置类。
 *
 * <p>项目里用 ZooKeeper 做「选座分布式锁」：多个用户同时购买同一个座位时，
 * 通过 Curator 的 InterProcessMutex 保证同一时刻只有一个请求能修改该座位状态，
 * 避免超卖（同一张票卖给两个人）。</p>
 *
 * <p>注意：这里采用异步启动，不调用 blockUntilConnected。
 * 这样即使 ZooKeeper 没启动，后端也能正常启动并降级为直接查库，
 * 不会因为中间件缺失导致整个购票系统起不来。</p>
 */
@Configuration
public class ZooKeeperConfig {

    private static final Logger log = LoggerFactory.getLogger(ZooKeeperConfig.class);

    @Value("${zookeeper.connect-string:localhost:2181}")
    private String connectString;

    @Value("${zookeeper.session-timeout-ms:60000}")
    private int sessionTimeoutMs;

    @Value("${zookeeper.connection-timeout-ms:15000}")
    private int connectionTimeoutMs;

    /**
     * 创建 Curator 客户端。
     * zookeeper.enabled=false 时不会创建该 Bean，SeatLockService 会自动走降级逻辑。
     */
    @Bean(destroyMethod = "close")
    @ConditionalOnProperty(name = "zookeeper.enabled", havingValue = "true", matchIfMissing = true)
    public CuratorFramework curatorFramework() {
        CuratorFramework client = CuratorFrameworkFactory.builder()
                .connectString(connectString)
                .sessionTimeoutMs(sessionTimeoutMs)
                .connectionTimeoutMs(connectionTimeoutMs)
                // 只重试一次，避免 ZooKeeper 长时间不可用时线程一直阻塞
                .retryPolicy(new RetryOneTime(1000))
                .build();

        // 监听连接状态，方便在日志里确认 ZK 是否真的连上了
        client.getConnectionStateListenable().addListener((c, newState) -> {
            if (newState == ConnectionState.CONNECTED) {
                log.info("ZooKeeper 已连接：{}", connectString);
            } else if (newState == ConnectionState.LOST) {
                log.warn("ZooKeeper 连接丢失，选座锁将暂时降级为数据库直接更新");
            }
        });

        client.start();
        log.info("ZooKeeper 客户端已启动，连接地址：{}", connectString);
        return client;
    }
}
