-- ============================================================================
-- 影院购票与影视周边商城系统 —— 数据库建表脚本（DDL）
-- 说明：
--   1. 原项目只提供了数据文件（纯 INSERT 语句），没有任何 CREATE TABLE，
--      本脚本依据各 *.sql 中的列顺序、列名，以及后端实体类的字段类型反推得出。
--   2. 所有字符集统一为 utf8mb4，排序规则 utf8mb4_general_ci，保证中文与 emoji 正常存储。
--   3. 原表中的日期、价格等字段在业务中均按文本处理（例如生日存在 "2011-8" 这样的
--      不完整日期，票价存在 "32.9起" 这样的字符串），因此统一声明为 VARCHAR，
--      避免插入原始演示数据时因格式校验失败。
--   4. 主键均为 INT AUTO_INCREMENT，与原 INSERT 语句中显式给出的 id 值兼容
--      （导入数据后自增值会自动接续到最大值之后）。
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `cinema`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE `cinema`;

-- ---------------------------------------------------------------------------
-- 1. 普通用户表：type=1，对应登录页的「用户」角色
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id`        INT          NOT NULL AUTO_INCREMENT COMMENT '主键，用户ID',
    `username`  VARCHAR(50)  DEFAULT NULL           COMMENT '昵称/姓名',
    `gender`    VARCHAR(10)  DEFAULT NULL           COMMENT '性别',
    `birth`     VARCHAR(20)  DEFAULT NULL           COMMENT '出生日期（原始数据为 2004-9-5 形式）',
    `email`     VARCHAR(100) DEFAULT NULL           COMMENT '邮箱',
    `user`      VARCHAR(50)  DEFAULT NULL           COMMENT '账号（用户名登录名）',
    `telephone` VARCHAR(20)  DEFAULT NULL           COMMENT '手机号，登录用电话',
    `password`  VARCHAR(50)  DEFAULT NULL           COMMENT '登录密码（明文，未加密）',
    `type`      INT          DEFAULT 1              COMMENT '角色类型：1=普通用户，2=会员，3=管理员',
    `state`     INT          DEFAULT 1              COMMENT '账号状态：1=正常',
    `payment`   VARCHAR(50)  DEFAULT NULL           COMMENT '支付账号/支付信息',
    `address`   VARCHAR(200) DEFAULT NULL           COMMENT '默认地址（文本）',
    `work`      VARCHAR(50)  DEFAULT NULL           COMMENT '职业',
    PRIMARY KEY (`id`),
    KEY `idx_user_telephone` (`telephone`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '普通用户表';

-- ---------------------------------------------------------------------------
-- 2. 会员表：type=2
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
    `id`        INT          NOT NULL AUTO_INCREMENT COMMENT '主键，会员ID',
    `username`  VARCHAR(50)  DEFAULT NULL           COMMENT '会员昵称',
    `gender`    VARCHAR(10)  DEFAULT NULL           COMMENT '性别',
    `address`   VARCHAR(200) DEFAULT NULL           COMMENT '地址',
    `birth`     VARCHAR(20)  DEFAULT NULL           COMMENT '出生日期（原始数据为 2011-8 形式）',
    `work`      VARCHAR(50)  DEFAULT NULL           COMMENT '职业',
    `email`     VARCHAR(100) DEFAULT NULL           COMMENT '邮箱',
    `user`      VARCHAR(50)  DEFAULT NULL           COMMENT '账号',
    `telephone` VARCHAR(20)  DEFAULT NULL           COMMENT '手机号，登录用电话',
    `password`  VARCHAR(50)  DEFAULT NULL           COMMENT '登录密码（明文，未加密）',
    `type`      INT          DEFAULT 2              COMMENT '角色类型：2=会员',
    `state`     VARCHAR(10)  DEFAULT '1'            COMMENT '账号状态：1=正常',
    PRIMARY KEY (`id`),
    KEY `idx_member_telephone` (`telephone`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '会员表';

-- ---------------------------------------------------------------------------
-- 3. 管理员表：type=3
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
    `id`        INT          NOT NULL AUTO_INCREMENT COMMENT '主键，管理员ID',
    `username`  VARCHAR(50)  DEFAULT NULL           COMMENT '管理员姓名',
    `birth`     VARCHAR(20)  DEFAULT NULL           COMMENT '出生日期',
    `email`     VARCHAR(100) DEFAULT NULL           COMMENT '邮箱',
    `telephone` VARCHAR(20)  DEFAULT NULL           COMMENT '手机号，登录用电话',
    `user`      VARCHAR(50)  DEFAULT NULL           COMMENT '账号',
    `password`  VARCHAR(50)  DEFAULT NULL           COMMENT '登录密码（明文，未加密）',
    `type`      INT          DEFAULT 3              COMMENT '角色类型：3=管理员',
    `state`     VARCHAR(10)  DEFAULT '1'            COMMENT '账号状态：1=正常',
    `address`   VARCHAR(200) DEFAULT NULL           COMMENT '地址',
    `gender`    VARCHAR(10)  DEFAULT NULL           COMMENT '性别',
    `work`      VARCHAR(50)  DEFAULT NULL           COMMENT '职业',
    PRIMARY KEY (`id`),
    KEY `idx_admin_telephone` (`telephone`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '管理员表';

-- ---------------------------------------------------------------------------
-- 4. 影片详情表：首页轮播、影片介绍页的数据源
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `movie_content`;
CREATE TABLE `movie_content` (
    `id`           INT          NOT NULL AUTO_INCREMENT COMMENT '主键，影片ID',
    `movie_name`   VARCHAR(100) DEFAULT NULL           COMMENT '影片中文名',
    `english_name` VARCHAR(100) DEFAULT NULL           COMMENT '影片英文名',
    `style`        VARCHAR(100) DEFAULT NULL           COMMENT '影片类型（如 犯罪 剧情）',
    `huang`        VARCHAR(200) DEFAULT NULL           COMMENT '宣传语',
    `start`        VARCHAR(200) DEFAULT NULL           COMMENT '上映信息文本',
    `duration`     VARCHAR(50)  DEFAULT NULL           COMMENT '时长（如 130分钟）',
    `score_name`   VARCHAR(100) DEFAULT NULL           COMMENT '评分来源名称',
    `score`        VARCHAR(20)  DEFAULT NULL           COMMENT '评分（保留一位小数，按文本存储）',
    `score_id`     INT          DEFAULT NULL           COMMENT '评分记录关联ID',
    `score_number` VARCHAR(50)  DEFAULT NULL           COMMENT '评价人数文本',
    `number`       VARCHAR(100) DEFAULT NULL           COMMENT '想看/看过人数文本',
    `content`      TEXT                                COMMENT '剧情简介',
    `zhuyan`       VARCHAR(200) DEFAULT NULL           COMMENT '主演',
    `address`      VARCHAR(100) DEFAULT NULL           COMMENT '制片地区',
    `url`          VARCHAR(255) DEFAULT NULL           COMMENT '海报图片路径（本地 /icon/xxx.jpg）',
    `choice`       INT          DEFAULT 1              COMMENT '上映状态：1=即将上映，2=正在热映',
    PRIMARY KEY (`id`),
    KEY `idx_movie_name` (`movie_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '影片详情表';

-- ---------------------------------------------------------------------------
-- 5. 购票场次表
-- 注意：原表主键列名为 buy_id（不是 id），此处保持一致，避免后端 SQL 失效。
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `buyTicket`;
CREATE TABLE `buyTicket` (
    `buy_id`     INT          NOT NULL AUTO_INCREMENT COMMENT '主键，场次ID',
    `id`         INT          DEFAULT NULL           COMMENT '所属影片ID，对应 movie_content.id',
    `time`       VARCHAR(20)  DEFAULT NULL           COMMENT '放映日期（如 3月7日）',
    `movie_name` VARCHAR(100) DEFAULT NULL           COMMENT '影片名（冗余字段，便于直接展示）',
    `time_start` VARCHAR(20)  DEFAULT NULL           COMMENT '开场时间（如 13:40）',
    `time_end`   VARCHAR(20)  DEFAULT NULL           COMMENT '散场时间（如 15:50散）',
    `type`       VARCHAR(30)  DEFAULT NULL           COMMENT '放映制式（如 国语2D）',
    `seat`       VARCHAR(100) DEFAULT NULL           COMMENT '影厅名称与说明',
    `seat_id`    INT          DEFAULT NULL           COMMENT '影厅ID，对应 hall.hall_id',
    `price`      VARCHAR(30)  DEFAULT NULL           COMMENT '普通票价文本（如 32.9起）',
    `vip_price`  VARCHAR(30)  DEFAULT NULL           COMMENT '会员票价文本（如 VIP 29.9元起）',
    PRIMARY KEY (`buy_id`),
    KEY `idx_buyticket_movie` (`id`),
    KEY `idx_buyticket_time` (`time`, `time_start`, `movie_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '购票场次表';

-- ---------------------------------------------------------------------------
-- 6. 影厅表
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `hall`;
CREATE TABLE `hall` (
    `id`         INT         NOT NULL AUTO_INCREMENT COMMENT '主键，影厅记录ID',
    `hall`       VARCHAR(50) DEFAULT NULL           COMMENT '影厅名称（如 五号厅）',
    `seatcount`  INT         DEFAULT NULL           COMMENT '座位总数',
    `time_start` VARCHAR(20) DEFAULT NULL           COMMENT '开场时间',
    `time`       VARCHAR(20) DEFAULT NULL           COMMENT '放映日期',
    `hall_id`    INT         DEFAULT NULL           COMMENT '影厅编号',
    `place_id`   INT         DEFAULT NULL           COMMENT '影院/场地区域ID',
    `seat_id`    INT         DEFAULT NULL           COMMENT '座位批次ID',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '影厅表';

-- ---------------------------------------------------------------------------
-- 7. 座位表：state=1 可选，2 已选，3 已售/已锁定
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `seatings`;
CREATE TABLE `seatings` (
    `id`      INT NOT NULL AUTO_INCREMENT COMMENT '主键，座位ID（前端按索引选中座位）',
    `state`   INT DEFAULT 1              COMMENT '座位状态：1=空闲，2=选中，3=已售出',
    `hall_id` INT DEFAULT NULL           COMMENT '所属影厅ID',
    `userid`  INT DEFAULT NULL           COMMENT '购买该座位的用户ID',
    PRIMARY KEY (`id`),
    KEY `idx_seatings_hall` (`hall_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '座位表';

-- ---------------------------------------------------------------------------
-- 8. 影院/座位汇总表
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `seatings_total`;
CREATE TABLE `seatings_total` (
    `id`       INT         NOT NULL AUTO_INCREMENT COMMENT '主键',
    `state`    VARCHAR(10) DEFAULT NULL           COMMENT '状态标识',
    `place`    VARCHAR(100) DEFAULT NULL          COMMENT '影院名称',
    `place_id` INT         DEFAULT NULL           COMMENT '影院编号',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '影院座位汇总表';

-- ---------------------------------------------------------------------------
-- 9. 影院区域表
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `Cinema_area`;
CREATE TABLE `Cinema_area` (
    `id`      INT          NOT NULL AUTO_INCREMENT COMMENT '主键',
    `area`    VARCHAR(100) DEFAULT NULL           COMMENT '影院区域名称',
    `area_id` INT          DEFAULT NULL           COMMENT '区域编号',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '影院区域表';

-- ---------------------------------------------------------------------------
-- 10. 影视周边商品表
-- 说明：新增 content 列用于存放后台「商品简介」输入框的内容，
--       原表缺少该列导致 add_shopping 插入语句列数与值数不匹配。
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `shopping`;
CREATE TABLE `shopping` (
    `id`        INT          NOT NULL AUTO_INCREMENT COMMENT '主键，商品ID',
    `name`      VARCHAR(200) DEFAULT NULL           COMMENT '商品名称',
    `url`       VARCHAR(255) DEFAULT NULL           COMMENT '商品图片路径',
    `price`     INT          DEFAULT NULL           COMMENT '市场价格（整数，单位元）',
    `vip`       INT          DEFAULT NULL           COMMENT '会员价',
    `stock`     INT          DEFAULT NULL           COMMENT '库存数量',
    `type`      INT          DEFAULT NULL           COMMENT '商品分类编号',
    `type_name` VARCHAR(50)  DEFAULT NULL           COMMENT '商品分类名称（如 影视手办）',
    `style`     VARCHAR(100) DEFAULT NULL           COMMENT '商品款式',
    `content`   VARCHAR(500) DEFAULT NULL           COMMENT '商品简介',
    PRIMARY KEY (`id`),
    KEY `idx_shopping_type` (`type_name`),
    KEY `idx_shopping_name` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '影视周边商品表';

-- ---------------------------------------------------------------------------
-- 11. 收货地址表
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `add_address`;
CREATE TABLE `add_address` (
    `id`        INT          NOT NULL AUTO_INCREMENT COMMENT '主键，地址ID',
    `name`      VARCHAR(50)  DEFAULT NULL           COMMENT '收货人姓名',
    `telephone` VARCHAR(20)  DEFAULT NULL           COMMENT '收货人电话',
    `street`    VARCHAR(200) DEFAULT NULL           COMMENT '省市区 JSON 数组文本',
    `address`   VARCHAR(200) DEFAULT NULL           COMMENT '详细门牌地址',
    `user_name` VARCHAR(50)  DEFAULT NULL           COMMENT '所属用户名',
    `user_id`   INT          DEFAULT NULL           COMMENT '所属用户ID',
    PRIMARY KEY (`id`),
    KEY `idx_address_user` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '收货地址表';

-- ---------------------------------------------------------------------------
-- 12. 购物车表
-- 注意：select 是 MySQL 保留字，必须用反引号包裹；后端 SQL 已使用 `select`。
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `shopping_cart`;
CREATE TABLE `shopping_cart` (
    `id`         INT          NOT NULL AUTO_INCREMENT COMMENT '主键，购物车行ID',
    `userid`     INT          DEFAULT NULL           COMMENT '用户ID',
    `user_name`  VARCHAR(50)  DEFAULT NULL           COMMENT '用户名（冗余）',
    `shoppingid` INT          DEFAULT NULL           COMMENT '商品ID',
    `count`      INT          DEFAULT NULL           COMMENT '购买数量',
    `state`      VARCHAR(10)  DEFAULT NULL           COMMENT '状态标识',
    `address_id` INT          DEFAULT NULL           COMMENT '关联地址ID',
    `isDefault`  VARCHAR(10)  DEFAULT NULL           COMMENT '是否默认地址（存字符串 false）',
    `typee`      VARCHAR(50)  DEFAULT NULL           COMMENT '服务标签（如 极速退款）',
    `select`     VARCHAR(100) DEFAULT NULL           COMMENT '规格/款式描述',
    PRIMARY KEY (`id`),
    KEY `idx_cart_user` (`userid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '购物车表';

-- ---------------------------------------------------------------------------
-- 13. 商城订单表
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `shopping_order`;
CREATE TABLE `shopping_order` (
    `id`         INT          NOT NULL AUTO_INCREMENT COMMENT '主键，订单ID',
    `userid`     INT          DEFAULT NULL           COMMENT '下单用户ID',
    `shoppingid` INT          DEFAULT NULL           COMMENT '商品ID',
    `count`      INT          DEFAULT NULL           COMMENT '购买数量',
    `address_id` INT          DEFAULT NULL           COMMENT '收货地址ID',
    `address`    VARCHAR(200) DEFAULT NULL           COMMENT '收货地址文本（冗余）',
    `ordertime`  VARCHAR(20)  DEFAULT NULL           COMMENT '下单时间文本',
    `orderstate` VARCHAR(20)  DEFAULT NULL           COMMENT '订单状态（如 已发货）',
    `isDefault`  VARCHAR(10)  DEFAULT NULL           COMMENT '是否默认地址',
    `isBuy`      VARCHAR(20)  DEFAULT NULL           COMMENT '收货/确认状态（如 已收货、待确认）',
    PRIMARY KEY (`id`),
    KEY `idx_order_user` (`userid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '商城订单表';

-- ---------------------------------------------------------------------------
-- 14. 影评表
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `evaluate`;
CREATE TABLE `evaluate` (
    `id`          INT          NOT NULL AUTO_INCREMENT COMMENT '主键，评论ID',
    `movie_name`  VARCHAR(100) DEFAULT NULL           COMMENT '影片名',
    `yonghu_name` VARCHAR(50)  DEFAULT NULL           COMMENT '评论人昵称',
    `userid`      INT          DEFAULT NULL           COMMENT '评论人ID（原始数据存在 NULL）',
    `pinjia`      VARCHAR(500) DEFAULT NULL           COMMENT '评论内容',
    `star`        INT          DEFAULT NULL           COMMENT '星级评分 1-5',
    PRIMARY KEY (`id`),
    KEY `idx_evaluate_movie` (`movie_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '影评表';

-- ---------------------------------------------------------------------------
-- 15. 影片评分表
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `movie_score`;
CREATE TABLE `movie_score` (
    `id`         INT         NOT NULL AUTO_INCREMENT COMMENT '主键',
    `movie_name` VARCHAR(100) DEFAULT NULL           COMMENT '影片名',
    `score`      VARCHAR(20) DEFAULT NULL           COMMENT '评分',
    `score_id`   INT         DEFAULT NULL           COMMENT '评分编号',
    `type`       VARCHAR(50) DEFAULT NULL           COMMENT '影片类型',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '影片评分表';

-- ---------------------------------------------------------------------------
-- 16. 三维模型/景点表（Unity 展示用）
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `models`;
CREATE TABLE `models` (
    `id`      INT          NOT NULL AUTO_INCREMENT COMMENT '主键，模型ID',
    `path`    VARCHAR(255) DEFAULT NULL           COMMENT '模型资源地址',
    `notes`   VARCHAR(100) DEFAULT NULL           COMMENT '备注/模型名称',
    `number`  VARCHAR(100) DEFAULT NULL           COMMENT '模型编号标识',
    `area_id` INT          DEFAULT NULL           COMMENT '所属区域ID',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '三维模型表';

-- ---------------------------------------------------------------------------
-- 17. 影片模型表
-- 说明：原表没有自增 id 列，以 movieid 作为主键。
--       后端 MovieMapper 原先查询不存在的 movies 表，已改为查询本表。
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS `movie_models`;
CREATE TABLE `movie_models` (
    `movieid`  INT          NOT NULL COMMENT '影片ID，同时作为主键',
    `movieurl` VARCHAR(255) DEFAULT NULL COMMENT '影片模型资源地址',
    `notes`    VARCHAR(100) DEFAULT NULL COMMENT '备注',
    `area_id`  INT          DEFAULT NULL COMMENT '所属区域ID',
    PRIMARY KEY (`movieid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '影片模型表';

-- ============================================================================
-- 建表结束。数据导入请按以下顺序执行（存在外键式的业务关联，先主后从）：
--   user.sql, admin.sql, member.sql
--   movie_content.sql, buyTicket.sql, hall.sql, Cinema_area.sql, seatings_total.sql
--   seatings.sql
--   shopping.sql, shopping_cart.sql, shopping_order.sql, add_address.sql
--   evaluate.sql, movie_score.sql, models.sql, movie_models.sql
-- ============================================================================
