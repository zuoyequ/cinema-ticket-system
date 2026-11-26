# 影院购票与影视周边商城

前端为原生微信小程序，后端为 Java 17 / Spring Boot 3.2.2 / MyBatis。

## 已接入的技术与业务用途

| 技术 | 真实调用位置 | 用途 |
| --- | --- | --- |
| MySQL | 原有业务表、新增事件箱和通知表 | 保存订单、影片、用户与通知 |
| Redis | `BuyTicketService` / `CacheService` | 影片列表缓存 |
| Memcached | `ShoppingService` / `ProductCacheService` | 商品列表缓存，10 分钟 TTL；新增商品后失效 |
| ZooKeeper / Curator | `SeatLockService` | 选座分布式锁 |
| Kafka | `OrderEventService` → `OrderOutboxPublisher` → `OrderNotificationConsumer` | 商城订单异步通知 |
| Kubernetes | `kustomization.yaml` / `k8s/workloads.yaml` | 部署六个服务，后端双副本、健康检查、持久化数据库和 Kafka |

### 影票订单

选场次、选座后点击“确认购票”，确认演示预订，后端会在同一事务中保存 `ticket_order` 和 `ticket_order_seat`。没有接入真实支付，因此状态为“已预订”，不显示为已付款。成功后可直接跳转“我的订单 → 影票订单”。

影票按用户 ID 和角色查询；每个场次的同一座位只能生成一份预订。一次最多五座，失败时整单回滚；同一请求重试返回原订单。ZooKeeper 场次锁配合 MySQL 场次行锁、唯一约束，在双副本和 ZooKeeper 不可用时也防止重复占座。

新增表由后端启动时的 `backend/src/main/resources/db/middleware.sql` 自动创建，不删除已有数据。旧版本只有座位状态、没有保存用户和场次的购票记录，无法可靠还原历史影票订单；原来已经标为不可选的座位会保留。

- `GET /ticket_show?id=1`：场次详情。
- `GET /ticket_seats?showId=1`：当前场次座位及可选状态。
- `POST /ticket_orders`：JSON 字段 `userId`、`userType`、`showId`、`seatIds`、`requestId`。
- `GET /ticket_orders?id=2&type=1`：当前账号影票订单。

`seatings` 原始演示数据只提供一份座位布局，所有场次复用该布局；新增预订通过“场次 + 座位”区分库存。Kafka 的异步通知链路仍用于商城商品订单。

### Kafka 业务流程

1. 原有 `/insert_shoppingorder` 接口在一个 MySQL 事务内保存订单及 `order_event_outbox` 事件，返回值仍是影响行数。
2. 后台每 2 秒查询待发送事件，向 `cinema.order-created` 主题发布 JSON，收到 broker 确认后标记已发送。
3. 消费者将通知保存到 `order_notification`，微信小程序“我的订单”页面展示通知并每 5 秒刷新。
4. Kafka 故障不阻止订单提交；待发送事件留在数据库，恢复后自动补发。
5. 使用至少一次投递语义。消费者以 `event_id` 主键去重，防止重复消息生成重复通知；不是跨 MySQL/Kafka 的全局 exactly-once 事务。
6. 多个后端副本使用 `FOR UPDATE SKIP LOCKED` 分配待发送事件，并共享同一消费组。

通知是站内订单创建提醒，不调用短信、微信订阅通知或支付平台。历史演示订单没有事件，不会自动补发通知。

### Memcached 业务流程

商品列表先读 Memcached，未命中再查 MySQL 并写缓存。JSON 反序列化后恢复为 `List<Shopping>`。缓存连接异常、超时或内容损坏时返回数据库结果。新增商品调用缓存删除；若删除时缓存故障，旧缓存最多保留到 10 分钟 TTL。

## 用 Docker Compose 运行（本机现有方式）

先启动 Docker Desktop。在项目根目录 PowerShell 执行：

```powershell
# 网络需要本机代理时设置，端口以自己的代理软件为准。
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"
docker compose up -d --build
docker compose ps
docker compose logs -f backend
```

Compose 启动 MySQL、Redis、ZooKeeper、Kafka、Memcached 和后端。Kafka 使用独立 KRaft 模式，不依赖选座所用的 ZooKeeper。Kafka 仅供容器内部访问，客户端 bootstrap 地址为 `kafka:9092`。

首次使用全新 MySQL 数据卷时导入 `sql/init.sql`。后端每次启动仅执行 `CREATE TABLE IF NOT EXISTS` 新增事件箱和通知表，不重置已有数据。不要对已有数据重新执行 `sql/init.sql`，它包含删表语句。

- 后端：`http://127.0.0.1:8080`
- 健康检查：`http://127.0.0.1:8080/actuator/health`
- 商品接口：`http://127.0.0.1:8080/get_shopping`
- 通知接口：`http://127.0.0.1:8080/order_notifications?id=2`
- MySQL：`127.0.0.1:3307`，库 `cinema`，演示账号 `root / 123456`
- Memcached：`127.0.0.1:11211`，仅绑定本机；它是易失缓存，不需要数据卷。

### 微信小程序

微信开发者工具导入 `frontend`，使用有效的小程序 AppID 或工具提供的测试号，启用本地设置“不校验合法域名”，点击编译。使用电脑模拟器；真机不能通过手机自身的 `127.0.0.1` 访问电脑。

| 角色 | 手机号 | 密码 |
| --- | --- | --- |
| 普通游客 | 12454657781 | 123456 |
| 会员 | 15465484547 | 123456 |
| 管理员 | 15454785658 | 123456 |

商品下单后，在“我的订单”查看订单通知。影片仍使用 Redis，商城商品使用 Memcached。

## 验证 Kafka 与 Memcached

新增测试覆盖影票多座位事务、同座并发、请求重试与用户隔离，以及商城订单/事件原子提交、事务回滚、发送失败重试、重复消息去重、缓存反序列化和缓存故障回退：

```powershell
docker build --target tests -t cinema-backend-tests ./backend
```

运行真实服务的端到端验证：

```powershell
./scripts/verify-middleware.ps1
# 额外短暂停止并恢复 Kafka、Memcached，验证事件补发与数据库回退。
./scripts/verify-middleware.ps1 -FaultRecovery
# 验证 Kubernetes 中独立运行的商品缓存与 Kafka 订单通知链路。
./scripts/verify-middleware.ps1 -Kubernetes
```

脚本只创建一笔没有支付操作的本地测试订单，按该订单 ID 清理新增测试记录，不删除已有业务数据。故障恢复模式会短暂停止服务，应在没有其他人在操作演示系统时执行。正常退出后 Kafka、Memcached 会恢复运行。

观察实际处理日志：

```powershell
docker compose logs backend | Select-String 'Memcached|Kafka|订单事件'
docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092 --describe --topic cinema.order-created
```

## 用 Kubernetes 部署

这套配置面向本机 Docker Desktop 的单节点课程演示，不是生产高可用方案。数据库、Kafka 均为单副本；后端为双副本。

1. Docker Desktop 设置中启用 Kubernetes，选择 **kubeadm / 单节点**，等待集群 Ready。此脚本复用 Docker 本地镜像，不适用于远程集群或尚未导入镜像的 kind 集群。
2. 使用同一根目录运行：

```powershell
./scripts/deploy-kubernetes.ps1
# 镜像已经构建过时可加 -SkipBuild
```

脚本显式使用 `docker-desktop` 上下文，只部署到 `cinema` 命名空间。Kustomize 自动生成应用 ConfigMap、数据库初始化 ConfigMap 和演示 Secret。每次部署后端使用新的本地镜像标签，以便滚动更新。

Kubernetes 使用自己的 PVC，与 Compose 的数据库、Kafka 数据卷相互独立。首次部署使用演示数据，不自动迁移当前 Compose 中新增的业务记录。PVC 在正常更新工作负载时保留。Docker 的数据虚拟磁盘已设置在 F 盘，容器和集群数据由 Docker Desktop 管理。

部署后验证：

```powershell
kubectl --context docker-desktop -n cinema get pods,services,pvc
kubectl --context docker-desktop -n cinema logs deployment/backend --all-pods=true
# 浏览器打开 http://localhost:30080/get_moviecontent3
```

小程序仍使用 8080 端口。如需切换到 Kubernetes 后端：

```powershell
# 停止 Compose 服务以释放端口和内存，保留已有数据卷。
docker compose stop
kubectl --context docker-desktop -n cinema port-forward service/backend 8080:8080
```

保持端口转发窗口打开，再编译小程序。退出端口转发按 Ctrl+C。回到 Compose 可执行 `docker compose up -d`。

扩缩容演示：

```powershell
kubectl --context docker-desktop -n cinema scale deployment/backend --replicas=3
kubectl --context docker-desktop -n cinema get pods
kubectl --context docker-desktop -n cinema scale deployment/backend --replicas=2
```

Kubernetes 的就绪/存活探针使用 Actuator。MySQL、Kafka 使用 PVC；Redis 和 Memcached 仅存缓存，重建后按需回填。后台事件发布使用数据库行锁，消费者共享 Kafka 消费组，支持后端副本共同运行。

## 本地 IDE 配置

JDK 17 + Maven，初始化 MySQL 后运行 `FuwuwaibaoApplication`。默认 `KAFKA_ENABLED=false`、`MEMCACHED_ENABLED=false`，方便只用数据库调试；事件仍保存在事件箱中，但不会被消费。启用真实中间件时设置对应环境变量。

| 环境变量 | 示例 |
| --- | --- |
| DB_URL | jdbc:mysql://localhost:3307/cinema?serverTimezone=GMT%2B8 |
| DB_USERNAME / DB_PASSWORD | root / 123456 |
| REDIS_HOST / REDIS_PORT | localhost / 6379 |
| ZK_CONNECT | localhost:2181 |
| MEMCACHED_ENABLED / MEMCACHED_SERVERS | true / localhost:11211 |
| KAFKA_ENABLED / KAFKA_BOOTSTRAP_SERVERS | true / 可从宿主机访问的 broker 地址 |

Compose 中 Kafka 只公布容器内地址。本地 IDE 若要连接它，需要另配对外 listener；直接用 Compose 运行完整后端最方便。

当前项目沿用原有的演示账号和接口鉴权方式，Kubernetes Secret 中也是演示凭据。不要直接公开部署到互联网。

## 参考资料

- [Apache Kafka Docker](https://kafka.apache.org/39/getting-started/docker/)
- [XMemcached 客户端](https://github.com/killme2008/xmemcached)
- [Docker Desktop Kubernetes](https://docs.docker.com/desktop/use-desktop/kubernetes/)
