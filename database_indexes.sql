-- M7后端系统数据库索引优化
-- 性能优化索引

-- 用户表索引优化
ALTER TABLE users ADD INDEX idx_level_m_coins (level, m_coins);
ALTER TABLE users ADD INDEX idx_is_active_created_at (is_active, created_at);

-- 检测任务表索引优化
ALTER TABLE detection_tasks ADD INDEX idx_user_status (user_id, status);
ALTER TABLE detection_tasks ADD INDEX idx_status_created_at (status, created_at);
ALTER TABLE detection_tasks ADD INDEX idx_channel_status (channel_id, status);

-- 检测结果表索引优化
ALTER TABLE detection_results ADD INDEX idx_task_status (task_id, status);
ALTER TABLE detection_results ADD INDEX idx_card_status (card_number, status);
ALTER TABLE detection_results ADD INDEX idx_detected_at_status (detected_at, status);

-- 提取码表索引优化
ALTER TABLE extract_codes ADD INDEX idx_user_created_at (user_id, created_at);
ALTER TABLE extract_codes ADD INDEX idx_valid_until_is_used (valid_until, is_used);

-- 充值订单表索引优化
ALTER TABLE recharge_orders ADD INDEX idx_user_status_created_at (user_id, status, created_at);
ALTER TABLE recharge_orders ADD INDEX idx_status_created_at (status, created_at);

-- 公告表索引优化
ALTER TABLE announcements ADD INDEX idx_type_is_active (type, is_active);
ALTER TABLE announcements ADD INDEX idx_priority_is_active (priority, is_active);

-- 用户会话表索引优化
ALTER TABLE user_sessions ADD INDEX idx_user_active (user_id, is_active);
ALTER TABLE user_sessions ADD INDEX idx_expires_active (expires_at, is_active);

-- 操作日志表索引优化
ALTER TABLE operation_logs ADD INDEX idx_user_action_created_at (user_id, action, created_at);
ALTER TABLE operation_logs ADD INDEX idx_action_status_created_at (action, status, created_at);

-- 复合索引优化
-- 检测任务按用户和时间查询
ALTER TABLE detection_tasks ADD INDEX idx_user_created_status (user_id, created_at, status);

-- 检测结果按任务和状态查询
ALTER TABLE detection_results ADD INDEX idx_task_created_status (task_id, detected_at, status);

-- 充值订单按用户和状态查询
ALTER TABLE recharge_orders ADD INDEX idx_user_status_amount (user_id, status, amount);

-- 公告按类型和优先级查询
ALTER TABLE announcements ADD INDEX idx_type_priority_active (type, priority, is_active);

-- 全文索引（如果需要搜索功能）
-- ALTER TABLE announcements ADD FULLTEXT(title, message);
-- ALTER TABLE operation_logs ADD FULLTEXT(action, error_message);

-- 分区表（如果数据量很大）
-- 按时间分区检测结果表
-- ALTER TABLE detection_results PARTITION BY RANGE (YEAR(detected_at)) (
--     PARTITION p2023 VALUES LESS THAN (2024),
--     PARTITION p2024 VALUES LESS THAN (2025),
--     PARTITION p2025 VALUES LESS THAN (2026),
--     PARTITION p_future VALUES LESS THAN MAXVALUE
-- );

-- 按时间分区操作日志表
-- ALTER TABLE operation_logs PARTITION BY RANGE (YEAR(created_at)) (
--     PARTITION p2023 VALUES LESS THAN (2024),
--     PARTITION p2024 VALUES LESS THAN (2025),
--     PARTITION p2025 VALUES LESS THAN (2026),
--     PARTITION p_future VALUES LESS THAN MAXVALUE
-- );

