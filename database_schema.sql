-- M7后端系统数据库设计
-- 创建数据库
CREATE DATABASE IF NOT EXISTS m7_backend CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE m7_backend;

-- 用户表 - 存储系统用户的基本信息和账户数据
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '用户唯一标识符，使用UUID格式',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户登录名，全局唯一，用于登录认证',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '用户邮箱地址，全局唯一，用于登录和通知',
    password_hash VARCHAR(255) NOT NULL COMMENT '用户密码的哈希值，使用bcrypt加密存储',
    name VARCHAR(100) COMMENT '用户真实姓名或昵称，用于显示和身份识别',
    level INT DEFAULT 1 COMMENT '用户等级，1-普通用户，2-VIP用户，3-高级用户，影响功能权限',
    m_coins DECIMAL(10,2) DEFAULT 0.00 COMMENT '用户M币余额，系统虚拟货币，用于支付服务费用',
    avatar VARCHAR(255) COMMENT '用户头像图片URL，存储头像文件的网络地址',
    is_active BOOLEAN DEFAULT TRUE COMMENT '账户是否激活，false表示账户被禁用',
    last_login_at TIMESTAMP NULL COMMENT '用户最后登录时间，用于统计活跃度',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '账户创建时间，记录注册时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '账户信息最后更新时间，自动更新',
    
    INDEX idx_username (username) COMMENT '用户名索引，加速登录查询',
    INDEX idx_email (email) COMMENT '邮箱索引，加速邮箱查询',
    INDEX idx_created_at (created_at) COMMENT '创建时间索引，用于时间范围查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户基础信息表，存储所有注册用户的基本资料和账户状态';

-- 检测通道表 - 管理CVV检测服务的不同通道配置
CREATE TABLE detection_channels (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '通道唯一标识符，自增主键',
    name VARCHAR(100) NOT NULL COMMENT '检测通道名称，如"标准通道"、"高速通道"等',
    rate VARCHAR(20) NOT NULL COMMENT '通道费率，如"0.1"表示每张卡0.1M币',
    speed VARCHAR(20) NOT NULL COMMENT '检测速度描述，如"快速"、"极速"、"慢速"',
    description TEXT COMMENT '通道详细描述，包括特点、适用场景等',
    status ENUM('online', 'offline', 'busy') DEFAULT 'offline' COMMENT '通道运行状态：online-在线可用，offline-离线不可用，busy-繁忙',
    consumption DECIMAL(10,2) DEFAULT 0.00 COMMENT '单次检测消费的M币数量，用于计费',
    max_concurrent INT DEFAULT 10 COMMENT '通道最大并发检测任务数，防止过载',
    current_concurrent INT DEFAULT 0 COMMENT '当前正在进行的检测任务数量',
    is_active BOOLEAN DEFAULT TRUE COMMENT '通道是否启用，false表示通道被禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '通道创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '通道信息最后更新时间',
    
    INDEX idx_status (status) COMMENT '通道状态索引，用于筛选可用通道',
    INDEX idx_is_active (is_active) COMMENT '启用状态索引，用于筛选启用通道'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CVV检测通道配置表，管理不同检测服务的通道信息和状态';

-- 检测任务表 - 记录用户发起的CVV检测任务信息
CREATE TABLE detection_tasks (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '检测任务唯一标识符，使用UUID格式',
    user_id VARCHAR(36) NOT NULL COMMENT '发起检测任务的用户ID，关联users表',
    status ENUM('pending', 'running', 'completed', 'failed', 'stopped') DEFAULT 'pending' COMMENT '任务执行状态：pending-等待中，running-运行中，completed-已完成，failed-失败，stopped-已停止',
    mode ENUM('charge_test', 'no_cvv', 'with_cvv') NOT NULL COMMENT '检测模式：charge_test-充值测试，no_cvv-无CVV检测，with_cvv-带CVV检测',
    channel_id INT NOT NULL COMMENT '使用的检测通道ID，关联detection_channels表',
    auto_stop_count INT DEFAULT 0 COMMENT '自动停止检测的有效卡数量，达到此数量时自动停止',
    total_cards INT DEFAULT 0 COMMENT '本次检测任务的总卡片数量',
    processed_cards INT DEFAULT 0 COMMENT '已经处理完成的卡片数量',
    valid_cards INT DEFAULT 0 COMMENT '检测结果为有效的卡片数量',
    invalid_cards INT DEFAULT 0 COMMENT '检测结果为无效的卡片数量',
    unknown_cards INT DEFAULT 0 COMMENT '检测结果未知的卡片数量',
    consumed_coins DECIMAL(10,2) DEFAULT 0.00 COMMENT '本次检测消耗的M币总数',
    start_time TIMESTAMP NULL COMMENT '检测任务开始执行的时间',
    end_time TIMESTAMP NULL COMMENT '检测任务结束的时间',
    error_message TEXT COMMENT '任务失败时的错误信息描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '任务创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '任务信息最后更新时间',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE COMMENT '用户外键约束，用户删除时级联删除任务',
    FOREIGN KEY (channel_id) REFERENCES detection_channels(id) COMMENT '检测通道外键约束',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引，用于查询用户的任务列表',
    INDEX idx_status (status) COMMENT '任务状态索引，用于筛选不同状态的任务',
    INDEX idx_created_at (created_at) COMMENT '创建时间索引，用于时间范围查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CVV检测任务表，记录用户发起的检测任务的基本信息和执行状态';

-- 检测结果表 - 存储每张卡片的详细检测结果
CREATE TABLE detection_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '检测结果记录唯一标识符，自增主键',
    task_id VARCHAR(36) NOT NULL COMMENT '所属检测任务ID，关联detection_tasks表',
    card_number VARCHAR(20) NOT NULL COMMENT '被检测的银行卡号，脱敏存储',
    cvv VARCHAR(4) NOT NULL COMMENT '被检测的CVV码，脱敏存储',
    expiry VARCHAR(7) NOT NULL COMMENT '卡片有效期，格式为MM/YY',
    status ENUM('valid', 'invalid', 'unknown') NOT NULL COMMENT '检测结果状态：valid-有效，invalid-无效，unknown-未知',
    bank VARCHAR(100) COMMENT '卡片所属银行名称，如"中国银行"',
    card_type VARCHAR(50) COMMENT '卡片类型，如"信用卡"、"借记卡"',
    country VARCHAR(50) COMMENT '卡片发行国家，如"中国"',
    currency VARCHAR(10) COMMENT '卡片货币类型，如"CNY"、"USD"',
    level VARCHAR(20) COMMENT '卡片等级，如"金卡"、"白金卡"',
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '该卡片检测完成的时间',
    
    FOREIGN KEY (task_id) REFERENCES detection_tasks(id) ON DELETE CASCADE COMMENT '任务外键约束，任务删除时级联删除结果',
    INDEX idx_task_id (task_id) COMMENT '任务ID索引，用于查询任务的所有结果',
    INDEX idx_status (status) COMMENT '检测状态索引，用于筛选有效/无效卡片',
    INDEX idx_detected_at (detected_at) COMMENT '检测时间索引，用于时间范围查询',
    INDEX idx_card_number (card_number) COMMENT '卡号索引，用于卡号查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CVV检测结果表，存储每张卡片的详细检测结果和卡片信息';

-- 提取码表 - 管理检测结果的提取码生成和使用
CREATE TABLE extract_codes (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '提取码记录唯一标识符，使用UUID格式',
    user_id VARCHAR(36) NOT NULL COMMENT '生成提取码的用户ID，关联users表',
    task_id VARCHAR(36) NOT NULL COMMENT '关联的检测任务ID，关联detection_tasks表',
    code VARCHAR(20) UNIQUE NOT NULL COMMENT '提取码，用户用于提取检测结果的唯一码',
    verification_code VARCHAR(10) NOT NULL COMMENT '验证码，用于验证提取码的有效性',
    valid_until TIMESTAMP NOT NULL COMMENT '提取码有效期截止时间，过期后无法使用',
    is_used BOOLEAN DEFAULT FALSE COMMENT '提取码是否已被使用，true表示已使用',
    used_at TIMESTAMP NULL COMMENT '提取码被使用的时间',
    used_by VARCHAR(36) NULL COMMENT '使用提取码的用户ID，可能不是生成者',
    payment_required BOOLEAN DEFAULT FALSE COMMENT '提取结果是否需要支付费用',
    payment_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '需要支付的金额，单位USDT',
    payment_wallet VARCHAR(100) COMMENT '支付钱包地址，用于接收支付',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending' COMMENT '支付状态：pending-待支付，paid-已支付，failed-支付失败',
    payment_at TIMESTAMP NULL COMMENT '支付完成的时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '提取码创建时间',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE COMMENT '用户外键约束，用户删除时级联删除',
    FOREIGN KEY (task_id) REFERENCES detection_tasks(id) ON DELETE CASCADE COMMENT '任务外键约束，任务删除时级联删除',
    INDEX idx_code (code) COMMENT '提取码索引，用于快速查找',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引，用于查询用户的提取码',
    INDEX idx_is_used (is_used) COMMENT '使用状态索引，用于筛选已使用/未使用的提取码',
    INDEX idx_valid_until (valid_until) COMMENT '有效期索引，用于筛选有效提取码'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='提取码管理表，用于生成和管理检测结果的提取码';

-- 充值套餐表 - 管理M币充值套餐配置
CREATE TABLE recharge_packages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '充值套餐唯一标识符，使用UUID格式',
    name VARCHAR(100) NOT NULL COMMENT '充值套餐名称，如"新手套餐"、"标准套餐"',
    m_coin_amount DECIMAL(10,2) NOT NULL COMMENT '套餐包含的M币数量，用户充值后获得的M币',
    usdt_price DECIMAL(10,2) NOT NULL COMMENT '套餐的USDT价格，用户需要支付的USDT数量',
    discount DECIMAL(5,2) DEFAULT 0.00 COMMENT '套餐折扣率，如0.10表示10%折扣',
    original_price DECIMAL(10,2) NOT NULL COMMENT '套餐原价，折扣前的价格',
    description TEXT COMMENT '套餐详细描述，包括特点、适用人群等',
    is_popular BOOLEAN DEFAULT FALSE COMMENT '是否为热门套餐，用于前端显示标识',
    is_recommended BOOLEAN DEFAULT FALSE COMMENT '是否为推荐套餐，用于前端推荐显示',
    is_active BOOLEAN DEFAULT TRUE COMMENT '套餐是否启用，false表示套餐被禁用',
    sort_order INT DEFAULT 0 COMMENT '套餐排序顺序，数字越小排序越靠前',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '套餐创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '套餐信息最后更新时间',
    
    INDEX idx_is_active (is_active) COMMENT '启用状态索引，用于筛选可用套餐',
    INDEX idx_sort_order (sort_order) COMMENT '排序索引，用于按顺序显示套餐'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='M币充值套餐配置表，管理不同的充值套餐和价格';

-- 充值订单表 - 记录用户的M币充值订单信息
CREATE TABLE recharge_orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '充值订单唯一标识符，使用UUID格式',
    user_id VARCHAR(36) NOT NULL COMMENT '发起充值的用户ID，关联users表',
    package_id VARCHAR(36) NOT NULL COMMENT '选择的充值套餐ID，关联recharge_packages表',
    amount DECIMAL(10,2) NOT NULL COMMENT '用户实际支付的金额，单位USDT',
    m_coins DECIMAL(10,2) NOT NULL COMMENT '用户获得的M币数量，根据套餐计算',
    payment_method VARCHAR(50) NOT NULL COMMENT '支付方式，如"USDT"、"BTC"、"ETH"',
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending' COMMENT '订单状态：pending-待支付，completed-已完成，failed-支付失败，cancelled-已取消',
    transaction_hash VARCHAR(100) COMMENT '区块链交易哈希值，用于验证支付',
    payment_wallet VARCHAR(100) COMMENT '支付钱包地址，用户向此地址转账',
    payment_at TIMESTAMP NULL COMMENT '用户完成支付的时间',
    completed_at TIMESTAMP NULL COMMENT '订单处理完成的时间',
    failure_reason TEXT COMMENT '订单失败的原因描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '订单创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '订单信息最后更新时间',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE COMMENT '用户外键约束，用户删除时级联删除订单',
    FOREIGN KEY (package_id) REFERENCES recharge_packages(id) COMMENT '套餐外键约束',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引，用于查询用户的充值记录',
    INDEX idx_status (status) COMMENT '订单状态索引，用于筛选不同状态的订单',
    INDEX idx_created_at (created_at) COMMENT '创建时间索引，用于时间范围查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='M币充值订单表，记录用户的充值订单和支付状态';

-- 公告表 - 管理系统公告和通知信息
CREATE TABLE announcements (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '公告唯一标识符，使用UUID格式',
    type ENUM('maintenance', 'promotion', 'update', 'warning') NOT NULL COMMENT '公告类型：maintenance-维护通知，promotion-促销活动，update-系统更新，warning-警告信息',
    title VARCHAR(200) NOT NULL COMMENT '公告标题，用于前端显示',
    message TEXT NOT NULL COMMENT '公告详细内容，支持HTML格式',
    priority INT DEFAULT 0 COMMENT '公告优先级，数字越大优先级越高',
    position ENUM('top', 'hero', 'floating', 'bottom') DEFAULT 'top' COMMENT '公告显示位置：top-顶部，hero-主要区域，floating-浮动，bottom-底部',
    carousel_duration INT DEFAULT 5000 COMMENT '轮播显示时长，单位毫秒，0表示不轮播',
    is_active BOOLEAN DEFAULT TRUE COMMENT '公告是否启用，false表示公告被禁用',
    start_time TIMESTAMP NULL COMMENT '公告开始显示时间，NULL表示立即显示',
    end_time TIMESTAMP NULL COMMENT '公告结束显示时间，NULL表示永久显示',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '公告创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '公告信息最后更新时间',
    
    INDEX idx_type (type) COMMENT '公告类型索引，用于筛选不同类型公告',
    INDEX idx_is_active (is_active) COMMENT '启用状态索引，用于筛选启用公告',
    INDEX idx_priority (priority) COMMENT '优先级索引，用于按优先级排序',
    INDEX idx_start_time (start_time) COMMENT '开始时间索引，用于时间范围查询',
    INDEX idx_end_time (end_time) COMMENT '结束时间索引，用于时间范围查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统公告表，管理各种系统通知和公告信息';

-- 用户会话表 - 管理用户登录会话和JWT令牌
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '会话唯一标识符，使用UUID格式',
    user_id VARCHAR(36) NOT NULL COMMENT '会话所属用户ID，关联users表',
    token_hash VARCHAR(255) NOT NULL COMMENT 'JWT令牌的哈希值，用于验证令牌有效性',
    expires_at TIMESTAMP NOT NULL COMMENT '会话过期时间，超过此时间令牌失效',
    is_active BOOLEAN DEFAULT TRUE COMMENT '会话是否有效，false表示会话被禁用',
    ip_address VARCHAR(45) COMMENT '用户登录时的IP地址，支持IPv4和IPv6',
    user_agent TEXT COMMENT '用户登录时的浏览器信息，用于安全审计',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '会话创建时间',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE COMMENT '用户外键约束，用户删除时级联删除会话',
    INDEX idx_user_id (user_id) COMMENT '用户ID索引，用于查询用户的会话',
    INDEX idx_token_hash (token_hash) COMMENT '令牌哈希索引，用于快速验证令牌',
    INDEX idx_expires_at (expires_at) COMMENT '过期时间索引，用于清理过期会话',
    INDEX idx_is_active (is_active) COMMENT '有效状态索引，用于筛选有效会话'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户会话管理表，记录用户登录状态和JWT令牌信息';

-- 系统配置表 - 管理系统运行参数和配置项
CREATE TABLE system_configs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '配置项唯一标识符，使用UUID格式',
    key_name VARCHAR(100) UNIQUE NOT NULL COMMENT '配置项键名，全局唯一，用于标识配置项',
    value TEXT NOT NULL COMMENT '配置项的值，可以是字符串、数字或JSON格式',
    description TEXT COMMENT '配置项的描述信息，说明配置项的作用和用途',
    is_encrypted BOOLEAN DEFAULT FALSE COMMENT '配置值是否加密存储，true表示需要解密后使用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '配置项创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '配置项最后更新时间',
    
    INDEX idx_key_name (key_name) COMMENT '配置键名索引，用于快速查找配置项'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置管理表，存储系统运行时的各种配置参数';

-- 操作日志表 - 记录系统操作和用户行为的审计日志
CREATE TABLE operation_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志记录唯一标识符，自增主键',
    user_id VARCHAR(36) COMMENT '执行操作的用户ID，NULL表示系统操作',
    action VARCHAR(100) NOT NULL COMMENT '操作动作名称，如"login"、"detection_start"、"recharge_create"',
    resource VARCHAR(100) COMMENT '操作涉及的系统资源，如"user"、"detection"、"order"',
    resource_id VARCHAR(36) COMMENT '操作资源的具体ID，如用户ID、任务ID、订单ID',
    ip_address VARCHAR(45) COMMENT '操作来源IP地址，支持IPv4和IPv6',
    user_agent TEXT COMMENT '操作来源的用户代理信息，记录浏览器和设备信息',
    request_data JSON COMMENT '操作请求的详细数据，以JSON格式存储',
    response_data JSON COMMENT '操作响应的详细数据，以JSON格式存储',
    status ENUM('success', 'failed') NOT NULL COMMENT '操作执行状态：success-成功，failed-失败',
    error_message TEXT COMMENT '操作失败时的错误信息描述',
    duration_ms INT COMMENT '操作执行耗时，单位毫秒，用于性能分析',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '日志记录创建时间',
    
    INDEX idx_user_id (user_id) COMMENT '用户ID索引，用于查询用户的操作记录',
    INDEX idx_action (action) COMMENT '操作动作索引，用于统计不同操作类型',
    INDEX idx_created_at (created_at) COMMENT '创建时间索引，用于时间范围查询',
    INDEX idx_status (status) COMMENT '操作状态索引，用于筛选成功/失败操作'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统操作审计日志表，记录所有用户操作和系统行为';

-- 插入初始数据
-- 插入默认检测通道
INSERT INTO detection_channels (name, rate, speed, description, status, consumption, max_concurrent) VALUES
('标准通道', '0.1', '快速', '标准检测通道，速度快，准确率高', 'online', 0.10, 20),
('高速通道', '0.2', '极速', '高速检测通道，速度极快，准确率极高', 'online', 0.20, 10),
('经济通道', '0.05', '慢速', '经济检测通道，价格便宜，速度较慢', 'online', 0.05, 50);

-- 插入默认充值套餐
INSERT INTO recharge_packages (name, m_coin_amount, usdt_price, discount, original_price, description, is_popular, is_recommended) VALUES
('新手套餐', 100.00, 10.00, 0.00, 10.00, '适合新用户的入门套餐', TRUE, TRUE),
('标准套餐', 500.00, 45.00, 0.10, 50.00, '性价比最高的标准套餐', TRUE, FALSE),
('高级套餐', 1000.00, 80.00, 0.20, 100.00, '适合重度用户的高级套餐', FALSE, TRUE),
('专业套餐', 5000.00, 350.00, 0.30, 500.00, '专业用户专用套餐', FALSE, FALSE);

-- 插入系统配置
INSERT INTO system_configs (key_name, value, description) VALUES
('max_concurrent_detections', '3', '用户最大并发检测数'),
('detection_timeout_minutes', '30', '检测超时时间(分钟)'),
('extract_code_valid_hours', '24', '提取码有效期(小时)'),
('min_recharge_amount', '10.00', '最小充值金额'),
('max_recharge_amount', '10000.00', '最大充值金额'),
('system_maintenance', 'false', '系统维护状态'),
('new_user_bonus', '50.00', '新用户奖励M币');

-- 插入默认公告
INSERT INTO announcements (type, title, message, priority, position, is_active) VALUES
('update', '系统升级通知', '系统将于今晚进行升级维护，预计耗时2小时', 1, 'top', TRUE),
('promotion', '新用户优惠', '新用户注册即送50M币，首次充值享受9折优惠', 2, 'hero', TRUE);
