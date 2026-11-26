-- ============================================================================
-- 影院购票与影视周边商城系统 —— 一键初始化脚本
-- 用法：mysql -uroot -p --default-character-set=utf8mb4 < init.sql
-- 内容：建库建表（schema.sql）+ 全部演示数据（各数据文件按顺序拼接）
-- ============================================================================

-- 容器内自动初始化时显式指定字符集，避免中文数据导入乱码
SET NAMES utf8mb4;


-- ==================== schema.sql ====================
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


-- ==================== user.sql ====================
INSERT INTO `user` (`id`, `username`, `gender`, `birth`, `email`, `user`, `telephone`, `password`, `type`, `state`, `payment`, `address`, `work`) VALUES (1, '张三', '男', '2004-9-5', '1445478255@qq.com', '22905421', '15454658452', '124512', 1, 1, '905122', '好日子号', '学生');
INSERT INTO `user` (`id`, `username`, `gender`, `birth`, `email`, `user`, `telephone`, `password`, `type`, `state`, `payment`, `address`, `work`) VALUES (2, '李四', '男', '2004-8-2', '1458975884@qq.com', '229050420', '12454657781', '123456', 1, 1, '123456', '小小号', '学生');
INSERT INTO `user` (`id`, `username`, `gender`, `birth`, `email`, `user`, `telephone`, `password`, `type`, `state`, `payment`, `address`, `work`) VALUES (3, '彭', '男', '2004-8-6', '1351548995@qq.com', '229050422', '15454621542', '123456', 1, 1, '235455', '阳春路', '学生');


-- ==================== member.sql ====================
INSERT INTO `member` (`id`, `username`, `gender`, `address`, `birth`, `work`, `email`, `user`, `telephone`, `password`, `type`, `state`) VALUES (1, '会员1', '女', '小小号', '2011-8', '会员', '154545548@qq.com', '01', '15465484547', '123456', 2, '1');


-- ==================== admin.sql ====================
INSERT INTO `admin` (`id`, `username`, `birth`, `email`, `telephone`, `user`, `password`, `type`, `state`, `address`, `gender`, `work`) VALUES (1, '王总', '2004-9-5', '154884855@qq.com', '15454785658', '154875487', '123456', 3, '1', '小小号', '男', '管理员');


-- ==================== movie_content.sql ====================
INSERT INTO `movie_content` (`id`, `movie_name`, `english_name`, `style`, `huang`, `start`, `duration`, `score_name`, `score`, `score_id`, `score_number`, `number`, `content`, `zhuyan`, `address`, `url`, `choice`) VALUES (1, '孤注一掷', 'No More Bets', '犯罪 剧情 ', '\"首度揭秘境外网络诈骗内幕\"', '2023.08.08 09.00中国大陆上映 130分钟', '130分钟', '传奇影院YYDS评分', '9.1', 1, '674768人评', '58785人想看  66274人看过', '程序员潘生（张艺兴饰）、模特安娜（金晨饰）被海外高薪招聘吸引，出国淘金，却意外落入境外诈骗工厂的陷阱。为了离开，两人准备向赌徒阿天（王大陆饰）和其女友小雨（周也饰）下手，从他们身上套现、完成业绩。潘生与安娜能否逃过诈骗集团头目陆经理（王传君饰）和阿才（孙阳饰）的残暴折磨。面对警察（咏梅饰）的跨国调查和追捕，他们又会何去何从 。', '主演：张艺兴 金晨 咏梅...', '中国大陆', '/icon/13 (2).jpg', 1);
INSERT INTO `movie_content` (`id`, `movie_name`, `english_name`, `style`, `huang`, `start`, `duration`, `score_name`, `score`, `score_id`, `score_number`, `number`, `content`, `zhuyan`, `address`, `url`, `choice`) VALUES (2, '韩战', 'hanz', '谍战', '“首都谍战好片”', '2023.08.08 09.00中国大陆上映 120分钟', '102分钟', '传奇影院YYDS评分', '8.3', 2, '674768人评', '58785人想看  66274人看过', '好看', '主演：梁乐民 郭富城...', '中国大陆', '/icon/11 (2).jpg', 1);


-- ==================== buyTicket.sql ====================
INSERT INTO `buyTicket` (`buy_id`, `id`, `time`, `movie_name`, `time_start`, `time_end`, `type`, `seat`, `seat_id`, `price`, `vip_price`) VALUES (1, '1', '3月7日', '孤注一掷', '13:40', '15:50散', '国语2D', '五号厅（凭电影票免费停车）', 5, '32.9起', 'VIP 29.9元起');
INSERT INTO `buyTicket` (`buy_id`, `id`, `time`, `movie_name`, `time_start`, `time_end`, `type`, `seat`, `seat_id`, `price`, `vip_price`) VALUES (2, '1', '3月7日', '孤注一掷', '18:40', '20:50散', '国语2D', '五号厅（凭电影票免费停车）', 5, '32.9起', 'VIP 29.9元起');
INSERT INTO `buyTicket` (`buy_id`, `id`, `time`, `movie_name`, `time_start`, `time_end`, `type`, `seat`, `seat_id`, `price`, `vip_price`) VALUES (3, '2', '3月7日', '韩战', '18:40', '21:50散', '国语2D', '五号厅（凭电影票免费停车', 5, '32.9起', 'VIP 29.9元起');


-- ==================== hall.sql ====================
INSERT INTO `hall` (`id`, `hall`, `seatcount`, `time_start`, `time`, `hall_id`, `place_id`, `seat_id`) VALUES (1, '五号厅', 74, '13:40', '3月7日', 1, 1, 5);
INSERT INTO `hall` (`id`, `hall`, `seatcount`, `time_start`, `time`, `hall_id`, `place_id`, `seat_id`) VALUES (2, '五号厅', 74, '14:40', '3月7日', 2, 1, 5);


-- ==================== seatings.sql ====================
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (1, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (2, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (3, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (4, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (5, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (6, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (7, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (8, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (9, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (10, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (11, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (12, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (13, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (14, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (15, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (16, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (17, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (18, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (19, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (20, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (21, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (22, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (23, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (24, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (25, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (26, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (27, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (28, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (29, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (30, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (31, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (32, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (33, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (34, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (35, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (36, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (37, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (38, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (39, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (40, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (41, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (42, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (43, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (44, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (45, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (46, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (47, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (48, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (49, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (50, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (51, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (52, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (53, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (54, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (55, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (56, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (57, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (58, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (59, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (60, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (61, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (62, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (63, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (64, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (65, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (66, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (67, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (68, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (69, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (70, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (71, 3, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (72, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (73, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (74, 1, 1, NULL);
INSERT INTO `seatings` (`id`, `state`, `hall_id`, `userid`) VALUES (75, 1, 1, NULL);


-- ==================== seatings_total.sql ====================
INSERT INTO `seatings_total` (`id`, `state`, `place`, `place_id`) VALUES (1, '1', '西安电影院', 1);
INSERT INTO `seatings_total` (`id`, `state`, `place`, `place_id`) VALUES (2, '1', '瑞安电影院', 2);


-- ==================== Cinema_area.sql ====================
INSERT INTO `Cinema_area` (`id`, `area`, `area_id`) VALUES (1, '西安电影园区', 1);
INSERT INTO `Cinema_area` (`id`, `area`, `area_id`) VALUES (2, '上海电影院', 2);


-- ==================== shopping.sql ====================
INSERT INTO `shopping` (`id`, `name`, `url`, `price`, `vip`, `stock`, `type`, `type_name`, `style`) VALUES (1, '漫威钢铁侠反浩克装甲雕塑MK7MK50模型手办', '/icon/gangtiex.jpg', 3119, 2999, 15, 1, '影视手办', NULL);
INSERT INTO `shopping` (`id`, `name`, `url`, `price`, `vip`, `stock`, `type`, `type_name`, `style`) VALUES (2, '从零开始的异世界生活和服雷姆手办', '/icon/leimu.jpg', 86, 69, 15, 1, '影视手办', NULL);
INSERT INTO `shopping` (`id`, `name`, `url`, `price`, `vip`, `stock`, `type`, `type_name`, `style`) VALUES (3, '可爱松鼠小玩偶~', '/icon/songshu.jpg', 43, 29, 16, 2, '毛绒玩具', NULL);
INSERT INTO `shopping` (`id`, `name`, `url`, `price`, `vip`, `stock`, `type`, `type_name`, `style`) VALUES (4, '5m高RICO来了！现场拆盲盒，还能拍大片！', '/icon/manghe1.jpg', 86, 69, 40, 3, '盲盒', NULL);


-- ==================== add_address.sql ====================
INSERT INTO `add_address` (`id`, `name`, `telephone`, `street`, `address`, `user_name`, `user_id`) VALUES (1, '张三', '15263374822', '[\"北京市\",\"北京市\",\"东城区\"]', '好日子号', '张三', 1);
INSERT INTO `add_address` (`id`, `name`, `telephone`, `street`, `address`, `user_name`, `user_id`) VALUES (2, 'ddd', '21313', '[\"北京市\",\"北京市\",\"东城区\"]', 'ddd', 'ddd', 2);


-- ==================== shopping_cart.sql ====================
INSERT INTO `shopping_cart` (`id`, `userid`, `user_name`, `shoppingid`, `count`, `state`, `address_id`, `isDefault`, `typee`, `select`) VALUES (1, 1, '张三', 1, 4, '1', 1, 'false', '极速退款', '钢铁侠一号');
INSERT INTO `shopping_cart` (`id`, `userid`, `user_name`, `shoppingid`, `count`, `state`, `address_id`, `isDefault`, `typee`, `select`) VALUES (2, 1, '张三', 2, 4, '1', 1, 'false', '破损包退', '手办');
INSERT INTO `shopping_cart` (`id`, `userid`, `user_name`, `shoppingid`, `count`, `state`, `address_id`, `isDefault`, `typee`, `select`) VALUES (3, 2, '李四', 1, 5, '1', 2, 'false', '破损包退', NULL);
INSERT INTO `shopping_cart` (`id`, `userid`, `user_name`, `shoppingid`, `count`, `state`, `address_id`, `isDefault`, `typee`, `select`) VALUES (4, 1, NULL, 4, NULL, NULL, 1, 'false', '运费险', '复古式宝盒');
INSERT INTO `shopping_cart` (`id`, `userid`, `user_name`, `shoppingid`, `count`, `state`, `address_id`, `isDefault`, `typee`, `select`) VALUES (5, 1, NULL, 3, NULL, NULL, 1, 'false', '7天无理由退款', '复古式宝盒');
INSERT INTO `shopping_cart` (`id`, `userid`, `user_name`, `shoppingid`, `count`, `state`, `address_id`, `isDefault`, `typee`, `select`) VALUES (6, 1, NULL, 1, NULL, NULL, 1, 'false', '7天无理由退款', '复古式宝盒');


-- ==================== shopping_order.sql ====================
INSERT INTO `shopping_order` (`id`, `userid`, `shoppingid`, `count`, `address_id`, `address`, `ordertime`, `orderstate`, `isDefault`, `isBuy`) VALUES (1, 1, 1, 4, 1, '阳春路', '13:40', '已发货', 'false', '已收货');
INSERT INTO `shopping_order` (`id`, `userid`, `shoppingid`, `count`, `address_id`, `address`, `ordertime`, `orderstate`, `isDefault`, `isBuy`) VALUES (2, 1, 3, 5, 1, NULL, NULL, NULL, 'false', '待确认');
INSERT INTO `shopping_order` (`id`, `userid`, `shoppingid`, `count`, `address_id`, `address`, `ordertime`, `orderstate`, `isDefault`, `isBuy`) VALUES (3, 1, 2, 4, 1, NULL, NULL, NULL, 'false', '已收货');
INSERT INTO `shopping_order` (`id`, `userid`, `shoppingid`, `count`, `address_id`, `address`, `ordertime`, `orderstate`, `isDefault`, `isBuy`) VALUES (4, 1, 4, NULL, 1, NULL, NULL, NULL, 'false', '待确认');
INSERT INTO `shopping_order` (`id`, `userid`, `shoppingid`, `count`, `address_id`, `address`, `ordertime`, `orderstate`, `isDefault`, `isBuy`) VALUES (5, 1, 2, NULL, 1, NULL, NULL, NULL, 'false', 'false');


-- ==================== evaluate.sql ====================
INSERT INTO `evaluate` (`id`, `movie_name`, `yonghu_name`, `userid`, `pinjia`, `star`) VALUES (1, '孤注一掷', 'name', 1, '电影很好看', 3);
INSERT INTO `evaluate` (`id`, `movie_name`, `yonghu_name`, `userid`, `pinjia`, `star`) VALUES (2, '韩战', 'name1', 1, '电影不好看', 3);
INSERT INTO `evaluate` (`id`, `movie_name`, `yonghu_name`, `userid`, `pinjia`, `star`) VALUES (3, '孤注一掷', 'name1', 1, '电影不好看', 3);
INSERT INTO `evaluate` (`id`, `movie_name`, `yonghu_name`, `userid`, `pinjia`, `star`) VALUES (4, '孤注一掷', 'name3', 1, '电影还行吧', 3);
INSERT INTO `evaluate` (`id`, `movie_name`, `yonghu_name`, `userid`, `pinjia`, `star`) VALUES (5, '孤注一掷', 'name4', 1, '非常好看', 4);
INSERT INTO `evaluate` (`id`, `movie_name`, `yonghu_name`, `userid`, `pinjia`, `star`) VALUES (6, '孤注一掷', 'name4', 1, '可以', 5);
INSERT INTO `evaluate` (`id`, `movie_name`, `yonghu_name`, `userid`, `pinjia`, `star`) VALUES (7, '孤注一掷', 'name4', NULL, 'chuanqi', 3);


-- ==================== movie_score.sql ====================
INSERT INTO `movie_score` (`id`, `movie_name`, `score`, `score_id`, `type`) VALUES (1, '孤注一掷', '9.1', 1, '犯罪');
INSERT INTO `movie_score` (`id`, `movie_name`, `score`, `score_id`, `type`) VALUES (2, '韩战', '9.2', 2, '谍战');


-- ==================== models.sql ====================
INSERT INTO `models` (`id`, `path`, `notes`, `number`, `area_id`) VALUES (1, 'http://114.55.25.215/2', '西影厂', 'xiyingchang', NULL);
INSERT INTO `models` (`id`, `path`, `notes`, `number`, `area_id`) VALUES (2, 'http://114.55.25.215/2', '西影博物馆', 'xiyingMuseum', NULL);
INSERT INTO `models` (`id`, `path`, `notes`, `number`, `area_id`) VALUES (3, 'http://114.55.25.215/3', '水帘洞', 'shuiliandong', NULL);
INSERT INTO `models` (`id`, `path`, `notes`, `number`, `area_id`) VALUES (4, 'http://114.55.25.215/4', '盘丝洞', 'pansidong', NULL);


-- ==================== movie_models.sql ====================
INSERT INTO `movie_models` (`movieid`, `movieurl`, `notes`, `area_id`) VALUES (1, 'http://114.55.25.215/movie1', '电影1', 1);
INSERT INTO `movie_models` (`movieid`, `movieurl`, `notes`, `area_id`) VALUES (2, 'http://114.55.25.215/movie2', '电影2', 1);

