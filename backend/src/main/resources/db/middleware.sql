CREATE TABLE IF NOT EXISTS order_event_outbox (
    event_id CHAR(36) NOT NULL PRIMARY KEY,
    order_id INT NOT NULL,
    payload TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL,
    attempts INT NOT NULL DEFAULT 0,
    KEY idx_outbox_pending (sent_at, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ticket_order (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type INT NOT NULL,
    show_id INT NOT NULL,
    request_id VARCHAR(64) NOT NULL,
    movie_name VARCHAR(100) NOT NULL,
    poster_url VARCHAR(1000),
    hall_name VARCHAR(120),
    show_date VARCHAR(30),
    show_start VARCHAR(20),
    seat_summary VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT '已预订',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_ticket_request (user_type,user_id,request_id),
    KEY idx_ticket_user (user_type,user_id,id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ticket_order_seat (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    show_id INT NOT NULL,
    seat_id INT NOT NULL,
    UNIQUE KEY uk_ticket_show_seat (show_id,seat_id),
    CONSTRAINT fk_ticket_seat_order FOREIGN KEY (order_id) REFERENCES ticket_order(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_notification (
    event_id CHAR(36) NOT NULL PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_notification_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
