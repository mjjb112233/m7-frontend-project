# M7后端系统AI提示词

## 项目概述
请帮我开发一个基于Go语言和MariaDB的M7卡片检测和分类系统后端。该系统需要支持CVV检测、BIN分类、卡信息提取、信息生成、充值等核心功能。

## 技术栈要求
- **后端语言**: Go 1.21+
- **数据库**: MariaDB 10.6+
- **Web框架**: Gin
- **ORM**: GORM
- **认证**: JWT
- **实时通信**: 通过HTTP轮询实现
- **缓存**: Redis (可选)
- **日志**: Logrus
- **配置**: Viper + YAML

## 核心功能模块

### 1. 用户认证模块
- 用户注册/登录
- JWT令牌管理
- 用户信息管理
- 余额管理(M币系统)

### 2. CVV检测模块
- 实时CVV检测
- 检测进度跟踪
- 检测结果管理
- 检测通道管理
- 提取码生成

### 3. BIN分类模块
- 卡片BIN信息查询
- 按国家/银行/类型/等级分类
- 分类结果导出

### 4. 卡信息提取模块
- 从检测结果提取卡信息
- 提取码验证
- 支付验证
- 历史记录管理

### 5. 信息生成模块
- 根据卡号生成持卡人信息
- 地址信息生成
- 联系方式生成

### 6. 充值模块
- 充值套餐管理
- 订单处理
- 支付回调
- 兑换码系统

### 7. 公告模块
- 系统公告管理
- 轮播公告
- 维护通知

## 环境配置要求

### 开发环境
- **Go版本**: 1.21+
- **MariaDB版本**: 10.6+
- **Redis版本**: 6.0+ (可选)
- **配置文件**: 使用YAML文件管理配置

### 生产环境
- **直接部署**: 二进制文件直接部署
- **负载均衡**: Nginx反向代理
- **数据库**: MariaDB主从复制
- **缓存**: Redis集群
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack

## 测试要求

### 单元测试
- **覆盖率**: > 80%
- **测试框架**: Go标准testing包
- **Mock**: 使用gomock生成mock对象
- **测试数据**: 使用testify/assert进行断言

### 集成测试
- **数据库测试**: 使用testcontainers (MariaDB)
- **API测试**: 使用httptest
- **端到端测试**: 覆盖主要业务流程

### 性能测试
- **压力测试**: 使用k6或wrk
- **并发测试**: 测试高并发场景
- **内存测试**: 检测内存泄漏

## 监控和日志要求

### 系统监控
- **指标收集**: CPU、内存、磁盘、网络
- **业务指标**: 检测成功率、响应时间、错误率
- **告警机制**: 关键指标异常时自动告警
- **仪表板**: 实时监控面板

### 日志管理
- **结构化日志**: 使用JSON格式
- **日志级别**: DEBUG、INFO、WARN、ERROR
- **日志轮转**: 按大小和时间轮转
- **日志收集**: 集中化日志管理

## 数据库设计要求

### 用户表 (users)
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY COMMENT '用户唯一标识符，使用UUID格式',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户登录名，全局唯一，用于登录认证',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '用户邮箱地址，全局唯一，用于登录和通知',
    password VARCHAR(255) NOT NULL COMMENT '用户密码，明文存储',
    level INT DEFAULT 1 COMMENT '用户等级，1-普通用户，2-VIP用户，3-高级用户，影响功能权限',
    m_coins DECIMAL(10,2) DEFAULT 0 COMMENT '用户M币余额，系统虚拟货币，用于支付服务费用',
    thread_count INT DEFAULT 1 COMMENT '用户可同时进行的检测线程数量，影响并发检测能力',
    detection_status ENUM('not_detected', 'detecting', 'completed') DEFAULT 'not_detected' COMMENT '用户检测状态：not_detected-未检测，detecting-检测中，completed-已完成',
    current_task_id VARCHAR(36) NULL COMMENT '当前检测任务ID，关联detection_tasks表，用于快速查询用户当前任务',
    account_status ENUM('active', 'banned') DEFAULT 'active' COMMENT '账号状态：active-正常，banned-封禁',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '账户创建时间，记录注册时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '账户信息最后更新时间，自动更新'
);
```

### 检测任务表 (detection_tasks)
```sql
CREATE TABLE detection_tasks (
    id VARCHAR(36) PRIMARY KEY COMMENT '检测任务唯一标识符，使用UUID格式',
    user_id VARCHAR(36) NOT NULL COMMENT '发起检测任务的用户ID，关联users表',
    status ENUM('not_detected', 'detecting', 'completed') DEFAULT 'not_detected' COMMENT '任务执行状态：not_detected-未检测，detecting-检测中，completed-已完成，与用户detection_status字段保持一致',
    mode ENUM('1', '2', '3') NOT NULL COMMENT '检测模式：1-扣测，2-无CVV检测，3-带CVV检测',
    channel_id INT NOT NULL COMMENT '使用的检测通道ID，关联detection_channels表',
    auto_stop_count INT DEFAULT 0 COMMENT '自动停止检测的有效卡数量，达到此数量时自动停止',
    total_cards INT DEFAULT 0 COMMENT '本次检测任务的总卡片数量',
    processed_cards INT DEFAULT 0 COMMENT '已经处理完成的卡片数量',
    valid_cards INT DEFAULT 0 COMMENT '检测结果为有效的卡片数量',
    invalid_cards INT DEFAULT 0 COMMENT '检测结果为无效的卡片数量',
    consumed_coins DECIMAL(10,2) DEFAULT 0 COMMENT '本次检测消耗的M币总数',
    single_price DECIMAL(10,2) NOT NULL COMMENT '单个检测的价格，单位M币',
    start_time TIMESTAMP NULL COMMENT '检测任务开始执行的时间',
    end_time TIMESTAMP NULL COMMENT '检测任务结束的时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '任务创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) COMMENT '用户外键约束，用户删除时级联删除任务'
);
```

### 检测卡信息表 (detection_cards)
```sql
CREATE TABLE detection_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '卡片记录唯一标识符，自增主键',
    task_id VARCHAR(36) NOT NULL COMMENT '所属检测任务ID，关联detection_tasks表',
    card_number VARCHAR(20) NOT NULL COMMENT '被检测的银行卡号',
    cvv VARCHAR(4) NOT NULL COMMENT '被检测的CVV码',
    expiry_month VARCHAR(2) NOT NULL COMMENT '卡片有效期月份，格式为MM',
    expiry_year VARCHAR(2) NOT NULL COMMENT '卡片有效期年份，格式为YY',
    other_info TEXT COMMENT '卡片的其他信息，如持卡人姓名、地址、电话等，以JSON格式存储',
    status ENUM('not_detected', 'valid', 'invalid', 'unknown') DEFAULT 'not_detected' COMMENT '卡片检测状态：not_detected-未检测，valid-有效，invalid-无效，unknown-未知',
    start_detected_at TIMESTAMP NULL COMMENT '该卡片开始检测的时间，未开始检测时为NULL',
    detected_at TIMESTAMP NULL COMMENT '该卡片检测完成的时间，未检测时为NULL',
    FOREIGN KEY (task_id) REFERENCES detection_tasks(id) COMMENT '任务外键约束，任务删除时级联删除卡片记录'
);
```

### 检测通道表 (detection_channels)
```sql
CREATE TABLE detection_channels (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '通道唯一标识符，自增主键',
    name VARCHAR(100) NOT NULL COMMENT '检测通道名称，如"标准通道"、"高速通道"等',
    rate VARCHAR(20) NOT NULL COMMENT '通道费率，如"0.1"表示每张卡0.1M币',
    speed VARCHAR(20) NOT NULL COMMENT '检测速度描述，如"快速"、"极速"、"慢速"',
    description TEXT COMMENT '通道详细描述，包括特点、适用场景等',
    status ENUM('online', 'offline', 'busy') DEFAULT 'offline' COMMENT '通道运行状态：online-在线可用，offline-离线不可用，busy-繁忙',
    consumption DECIMAL(10,2) DEFAULT 0 COMMENT '单次检测消费的M币数量，用于计费',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '通道创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '通道信息最后更新时间'
);
```

### 提取码表 (extract_codes)
```sql
CREATE TABLE extract_codes (
    id VARCHAR(36) PRIMARY KEY COMMENT '提取码记录唯一标识符，使用UUID格式',
    user_id VARCHAR(36) NOT NULL COMMENT '生成提取码的用户ID，关联users表',
    task_id VARCHAR(36) NOT NULL COMMENT '关联的检测任务ID，关联detection_tasks表',
    data_source VARCHAR(50) NOT NULL COMMENT '数据来源，如"cvv-detection"、"user-generated"等',
    code VARCHAR(20) UNIQUE NOT NULL COMMENT '提取码，用户用于提取检测结果的唯一码，全局唯一',
    verification_code VARCHAR(10) NOT NULL COMMENT '验证码，用于验证提取码的有效性',
    valid_until TIMESTAMP NOT NULL COMMENT '提取码有效期截止时间，过期后无法使用',
    is_used BOOLEAN DEFAULT FALSE COMMENT '提取码是否已被使用，true表示已使用',
    used_at TIMESTAMP NULL COMMENT '提取码被使用的时间',
    payment_required BOOLEAN DEFAULT FALSE COMMENT '提取结果是否需要支付费用',
    payment_amount DECIMAL(10,2) DEFAULT 0 COMMENT '需要支付的金额，单位USDT',
    payment_wallet VARCHAR(100) COMMENT '支付钱包地址，用于接收支付',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '提取码创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) COMMENT '用户外键约束，用户删除时级联删除',
    FOREIGN KEY (task_id) REFERENCES detection_tasks(id) COMMENT '任务外键约束，任务删除时级联删除'
);
```

### 充值套餐表 (recharge_packages)
```sql
CREATE TABLE recharge_packages (
    id VARCHAR(36) PRIMARY KEY COMMENT '充值套餐唯一标识符，使用UUID格式',
    name VARCHAR(100) NOT NULL COMMENT '充值套餐名称，如"新手套餐"、"标准套餐"',
    m_coin_amount DECIMAL(10,2) NOT NULL COMMENT '套餐包含的M币数量，用户充值后获得的M币',
    usdt_price DECIMAL(10,2) NOT NULL COMMENT '套餐的USDT价格，用户需要支付的USDT数量',
    discount DECIMAL(5,2) DEFAULT 0 COMMENT '套餐折扣率，如0.10表示10%折扣',
    original_price DECIMAL(10,2) NOT NULL COMMENT '套餐原价，折扣前的价格',
    description TEXT COMMENT '套餐详细描述，包括特点、适用人群等',
    is_popular BOOLEAN DEFAULT FALSE COMMENT '是否为热门套餐，用于前端显示标识',
    is_recommended BOOLEAN DEFAULT FALSE COMMENT '是否为推荐套餐，用于前端推荐显示',
    is_active BOOLEAN DEFAULT TRUE COMMENT '套餐是否启用，false表示套餐被禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '套餐创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '套餐信息最后更新时间'
);
```

### 充值订单表 (recharge_orders)
```sql
CREATE TABLE recharge_orders (
    id VARCHAR(36) PRIMARY KEY COMMENT '充值订单唯一标识符，使用UUID格式',
    user_id VARCHAR(36) NOT NULL COMMENT '发起充值的用户ID，关联users表',
    package_id VARCHAR(36) NOT NULL COMMENT '选择的充值套餐ID，关联recharge_packages表',
    amount DECIMAL(10,2) NOT NULL COMMENT '用户实际支付的金额，单位USDT',
    m_coins DECIMAL(10,2) NOT NULL COMMENT '用户获得的M币数量，根据套餐计算',
    payment_method VARCHAR(50) NOT NULL COMMENT '支付方式，如"USDT"、"BTC"、"ETH"',
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending' COMMENT '订单状态：pending-待支付，completed-已完成，failed-支付失败',
    transaction_hash VARCHAR(100) COMMENT '区块链交易哈希值，用于验证支付',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '订单创建时间',
    completed_at TIMESTAMP NULL COMMENT '订单处理完成的时间',
    FOREIGN KEY (user_id) REFERENCES users(id) COMMENT '用户外键约束，用户删除时级联删除订单',
    FOREIGN KEY (package_id) REFERENCES recharge_packages(id) COMMENT '套餐外键约束'
);
```

### 公告表 (announcements)
```sql
CREATE TABLE announcements (
    id VARCHAR(36) PRIMARY KEY COMMENT '公告唯一标识符，使用UUID格式',
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '公告信息最后更新时间'
);
```

### 用户会话表 (user_sessions)
```sql
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY COMMENT '会话唯一标识符，使用UUID格式',
    user_id VARCHAR(36) NOT NULL COMMENT '会话所属用户ID，关联users表',
    token_hash VARCHAR(255) NOT NULL COMMENT 'JWT令牌的哈希值，用于验证令牌有效性',
    expires_at TIMESTAMP NOT NULL COMMENT '会话过期时间，超过此时间令牌失效',
    is_active BOOLEAN DEFAULT TRUE COMMENT '会话是否有效，false表示会话被禁用',
    ip_address VARCHAR(45) COMMENT '用户登录时的IP地址，支持IPv4和IPv6',
    user_agent TEXT COMMENT '用户登录时的浏览器信息，用于安全审计',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '会话创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE COMMENT '用户外键约束，用户删除时级联删除会话'
);
```

### 系统配置表 (system_configs)
```sql
CREATE TABLE system_configs (
    id VARCHAR(36) PRIMARY KEY COMMENT '配置项唯一标识符，使用UUID格式',
    key_name VARCHAR(100) UNIQUE NOT NULL COMMENT '配置项键名，全局唯一，用于标识配置项',
    value TEXT NOT NULL COMMENT '配置项的值，可以是字符串、数字或JSON格式',
    description TEXT COMMENT '配置项的描述信息，说明配置项的作用和用途',
    is_encrypted BOOLEAN DEFAULT FALSE COMMENT '配置值是否加密存储，true表示需要解密后使用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '配置项创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '配置项最后更新时间'
);
```

### 操作日志表 (operation_logs)
```sql
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL COMMENT '用户外键约束，用户删除时设置为NULL'
);
```

## API端点设计

### 认证相关
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- GET /api/auth/user - 获取用户信息
- PUT /api/auth/user - 更新用户信息

### CVV检测相关
- GET /api/cvv-check/config - 获取检测配置
- GET /api/cvv-check/status - 获取检测状态
- GET /api/cvv-check/user-status - 获取用户检测状态
- POST /api/cvv-check/start-detection - 开始检测
- POST /api/cvv-check/stop-detection - 停止检测
- GET /api/cvv-check/detection-progress - 获取检测进度
- POST /api/cvv-check/detection-results - 获取检测结果
- POST /api/cvv-check/generate-extract-code - 生成提取码
- GET /api/cvv-check/get-extract-code - 获取提取码信息

### BIN分类相关
- GET /api/bin-classify/config - 获取分类配置
- POST /api/bin-classify/start - 开始分类
- GET /api/bin-classify/results - 获取分类结果

### 卡信息提取相关
- GET /api/extract-code/config - 获取提取配置
- POST /api/extract-code/generate - 生成提取码
- GET /api/extract-code/info - 获取提取码信息
- POST /api/extract-code/verify - 验证提取码
- GET /api/extract-code/history - 获取提取历史

### 信息生成相关
- GET /api/info-generate/config - 获取生成配置
- POST /api/info-generate/start - 开始生成
- GET /api/info-generate/results - 获取生成结果

### 充值相关
- GET /api/recharge/config - 获取充值配置
- GET /api/recharge/packages - 获取充值套餐
- POST /api/recharge/create-order - 创建充值订单
- GET /api/recharge/history - 获取充值历史
- POST /api/recharge/callback - 支付回调

### 公告相关
- GET /api/announcements - 获取公告列表

## 代码架构要求

### 目录结构
```
m7-backend/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── config/
│   ├── database/
│   ├── models/
│   ├── handlers/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── polling/
├── pkg/
│   ├── auth/
│   ├── logger/
│   └── response/
├── migrations/
├── docs/
├── scripts/
├── go.mod
├── go.sum
├── docker-compose.yml
├── Dockerfile
└── README.md
```

### 核心设计原则
1. **低耦合高内聚**: 使用依赖注入，接口抽象
2. **分层架构**: Handler -> Service -> Repository
3. **错误处理**: 统一错误处理和响应格式
4. **日志记录**: 结构化日志，支持不同级别
5. **配置管理**: 环境变量和配置文件分离
6. **数据库迁移**: 版本化数据库迁移
7. **API文档**: 自动生成Swagger文档
8. **测试覆盖**: 单元测试和集成测试

### 关键实现要求
1. **JWT认证**: 实现安全的用户认证机制
2. **HTTP轮询**: 检测进度查询接口
3. **并发控制**: 限制用户同时进行的检测任务
4. **资源管理**: 合理的内存和数据库连接管理
5. **安全防护**: SQL注入防护，XSS防护，CORS配置
6. **性能优化**: 数据库索引优化，查询优化
7. **监控告警**: 系统健康检查和性能监控

## 错误处理规范

### 错误码定义
```go
const (
    // 认证相关错误
    ErrInvalidToken     = "INVALID_TOKEN"
    ErrTokenExpired     = "TOKEN_EXPIRED"
    ErrUnauthorized     = "UNAUTHORIZED"
    
    // 业务逻辑错误
    ErrInsufficientBalance = "INSUFFICIENT_BALANCE"
    ErrDetectionLimitExceeded = "DETECTION_LIMIT_EXCEEDED"
    ErrChannelUnavailable = "CHANNEL_UNAVAILABLE"
    ErrInvalidCardNumber = "INVALID_CARD_NUMBER"
    ErrExtractCodeExpired = "EXTRACT_CODE_EXPIRED"
    ErrPaymentRequired = "PAYMENT_REQUIRED"
    
    // 系统错误
    ErrSystemMaintenance = "SYSTEM_MAINTENANCE"
    ErrInternalError = "INTERNAL_ERROR"
    ErrDatabaseError = "DATABASE_ERROR"
)
```

### 统一错误响应格式
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "error": "ERROR_CODE",
  "timestamp": 1704067200,
  "request_id": "uuid"
}
```

### 时间格式规范
- **所有时间字段**: 使用10位Unix时间戳（秒级精度）
- **时间戳格式**: 整数类型，如 `1704067200`
- **时区**: UTC时间
- **示例**: `1704067200` 表示 2024-01-01 00:00:00 UTC

## 安全要求

### 认证安全
1. **JWT令牌管理**
   - 令牌过期时间：24*7小时
   - 刷新令牌机制
   - 令牌撤销机制
   - 多设备登录控制

2. **密码安全**
   - 密码明文存储（不进行加密）
   - 密码强度验证
   - 登录失败限制（5次失败后锁定1分钟）

3. **会话管理**
   - 会话超时机制
   - 异地登录检测
   - 设备指纹识别
   - 会话并发控制


2. **输入验证**
   - 严格的输入验证
   - SQL注入防护
   - XSS攻击防护
   - CSRF防护

3. **访问控制**
   - 基于角色的权限控制
   - API接口权限验证
   - 资源访问控制
   - 操作审计日志

### 业务安全
1. **频率限制**
   - API调用频率限制
   - 用户操作频率限制
   - IP地址限制
   - 异常行为检测



## 性能要求

### 响应时间要求
- **API响应时间**: < 200ms (95%请求)
- **数据库查询**: < 100ms (95%查询)
- **检测任务启动**: < 5秒
- **文件上传**: < 10秒 (10MB文件)

### 并发处理要求
- **用户并发**: 支持1000+并发用户
- **检测任务**: 支持100+并发检测任务
- **数据库连接**: 最大100个连接
- **内存使用**: < 2GB (单实例)

### 可用性要求
- **系统可用性**: 99.9%
- **故障恢复时间**: < 5分钟
- **数据备份**: 每日自动备份
- **监控告警**: 实时监控和告警

## 特殊业务逻辑

### CVV检测流程
1. 用户提交检测请求
2. 验证用户余额和权限
3. 检查用户detection_status状态（必须为not_detected或completed）
4. 创建检测任务，设置任务status为pending
5. 更新用户detection_status为detecting
6. 启动检测进程，更新任务status为running
7. 实时更新检测进度
8. 检测完成时更新任务status为completed，用户detection_status为completed
9. 保存检测结果
10. 生成提取码(可选)

### 状态关联逻辑
- **用户detection_status** 与 **任务status** 完全一致
- **not_detected** → 可以创建新任务
- **detecting** → 任务运行中
- **completed** → 任务完成
- 用户只能有一个detecting状态的任务
- 任务状态变更时自动同步用户detection_status

### 支付处理
1. 支持USDT支付
2. 支付回调验证
3. 自动充值M币
4. 订单状态管理

### 提取码机制
1. 检测完成后生成提取码
2. 提取码有效期管理
3. 支付验证机制
4. 使用记录跟踪

## 构建和部署配置

### 构建配置
```bash
# 构建脚本
#!/bin/bash
# build.sh

# 设置环境变量
export CGO_ENABLED=0
export GOOS=linux
export GOARCH=amd64

# 构建应用
go build -o bin/m7-backend cmd/server/main.go

# 复制配置文件
cp -r config/ bin/
cp -r migrations/ bin/

echo "构建完成，可执行文件位于 bin/m7-backend"
```

### 部署脚本
```bash
# 部署脚本
#!/bin/bash
# deploy.sh

# 停止现有服务
sudo systemctl stop m7-backend

# 备份现有版本
cp /opt/m7-backend/m7-backend /opt/m7-backend/m7-backend.backup.$(date +%Y%m%d_%H%M%S)

# 复制新版本
cp bin/m7-backend /opt/m7-backend/
cp -r bin/config /opt/m7-backend/
cp -r bin/migrations /opt/m7-backend/

# 设置权限
chmod +x /opt/m7-backend/m7-backend

# 启动服务
sudo systemctl start m7-backend
sudo systemctl status m7-backend

echo "部署完成"
```

### systemd服务配置
```ini
# /etc/systemd/system/m7-backend.service
[Unit]
Description=M7 Backend Service
After=network.target mariadb.service redis.service
Wants=mariadb.service redis.service

[Service]
Type=simple
User=m7-backend
Group=m7-backend
WorkingDirectory=/opt/m7-backend
ExecStart=/opt/m7-backend/m7-backend
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=m7-backend

# 环境变量
Environment=APP_ENV=production
Environment=CONFIG_PATH=/opt/m7-backend/config/config.yaml

# 安全设置
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/m7-backend/logs

[Install]
WantedBy=multi-user.target
```

### Makefile配置
```makefile
# Makefile
.PHONY: build test clean run dev deploy

# 变量定义
BINARY_NAME=m7-backend
BINARY_PATH=bin/$(BINARY_NAME)
BUILD_TIME=$(shell date +%Y-%m-%d_%H:%M:%S)
GIT_COMMIT=$(shell git rev-parse --short HEAD)
VERSION=$(shell git describe --tags --always --dirty)

# 构建标志
LDFLAGS=-ldflags "-X main.Version=$(VERSION) -X main.BuildTime=$(BUILD_TIME) -X main.GitCommit=$(GIT_COMMIT)"

# 构建应用
build:
	@echo "构建应用..."
	@mkdir -p bin
	@go build $(LDFLAGS) -o $(BINARY_PATH) cmd/server/main.go
	@echo "构建完成: $(BINARY_PATH)"

# 运行测试
test:
	@echo "运行测试..."
	@go test -v ./...

# 运行测试并生成覆盖率报告
test-coverage:
	@echo "运行测试并生成覆盖率报告..."
	@go test -v -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out -o coverage.html
	@echo "覆盖率报告已生成: coverage.html"

# 代码格式化
fmt:
	@echo "格式化代码..."
	@go fmt ./...

# 代码检查
lint:
	@echo "运行代码检查..."
	@golangci-lint run

# 清理构建文件
clean:
	@echo "清理构建文件..."
	@rm -rf bin/
	@rm -f coverage.out coverage.html

# 运行应用
run: build
	@echo "启动应用..."
	@./$(BINARY_PATH)

# 开发模式运行
dev:
	@echo "开发模式启动..."
	@go run cmd/server/main.go

# 安装依赖
deps:
	@echo "安装依赖..."
	@go mod download
	@go mod tidy

# 部署到生产环境
deploy: build
	@echo "部署到生产环境..."
	@sudo systemctl stop m7-backend || true
	@sudo cp $(BINARY_PATH) /opt/m7-backend/
	@sudo systemctl start m7-backend
	@echo "部署完成"

# 查看服务状态
status:
	@sudo systemctl status m7-backend

# 查看日志
logs:
	@sudo journalctl -u m7-backend -f

# 重启服务
restart:
	@sudo systemctl restart m7-backend

# 生成默认配置文件
config:
	@echo "生成默认配置文件..."
	@mkdir -p config
	@cat > config/config.yaml << 'EOF'
app:
  name: "M7 Backend"
  version: "1.0.0"
  port: 8080
  env: "development"
  debug: true

server:
  host: "0.0.0.0"
  port: 8080
  read_timeout: 30s
  write_timeout: 30s
  idle_timeout: 120s

database:
  host: "localhost"
  port: 3306
  name: "m7_backend"
  username: "root"
  password: "password"
  charset: "utf8mb4"
  collation: "utf8mb4_unicode_ci"
  max_open_conns: 100
  max_idle_conns: 10
  max_lifetime: "1h"
  ssl_mode: "disable"

redis:
  host: "localhost"
  port: 6379
  password: ""
  db: 0
  pool_size: 10
  min_idle_conns: 5
  max_conn_age: "1h"
  pool_timeout: "4s"
  idle_timeout: "5m"
  idle_check_frequency: "1m"

jwt:
  secret: "your-secret-key-change-this-in-production"
  expire_hours: 168
  refresh_expire_hours: 720
  issuer: "m7-backend"

logging:
  level: "info"
  format: "json"
  output: "stdout"
  file_path: "./logs/app.log"
  max_size: 100
  max_backups: 3
  max_age: 28
  compress: true

monitoring:
  prometheus:
    enabled: true
    port: 9090
    path: "/metrics"
  grafana:
    enabled: true
    port: 3000

security:
  rate_limit:
    requests_per_minute: 60
    burst: 10
  cors:
    allowed_origins: ["*"]
    allowed_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_headers: ["*"]
    max_age: 86400

business:
  detection:
    max_concurrent_tasks: 3
    timeout_minutes: 30
    auto_stop_count: 0
  recharge:
    min_amount: 10.00
    max_amount: 10000.00
    exchange_rate: 1.0
  extract_code:
    valid_hours: 24
    max_usage_count: 1
EOF
	@echo "配置文件已生成: config/config.yaml"
```

## 部署要求

### 生产环境部署
1. **服务管理**: 使用systemd管理服务
2. **负载均衡**: Nginx反向代理
3. **数据库**: MariaDB主从复制
4. **缓存**: Redis集群
5. **监控**: Prometheus + Grafana
6. **日志**: ELK Stack
7. **备份**: 自动化数据备份

### YAML配置文件
```yaml
# config/config.yaml
app:
  name: "M7 Backend"
  version: "1.0.0"
  port: 8080
  env: "production"
  debug: false

server:
  host: "0.0.0.0"
  port: 8080
  read_timeout: 30s
  write_timeout: 30s
  idle_timeout: 120s

database:
  host: "localhost"
  port: 3306
  name: "m7_backend"
  username: "root"
  password: "password"
  charset: "utf8mb4"
  collation: "utf8mb4_unicode_ci"
  max_open_conns: 100
  max_idle_conns: 10
  max_lifetime: "1h"
  ssl_mode: "disable"

redis:
  host: "localhost"
  port: 6379
  password: ""
  db: 0
  pool_size: 10
  min_idle_conns: 5
  max_conn_age: "1h"
  pool_timeout: "4s"
  idle_timeout: "5m"
  idle_check_frequency: "1m"

jwt:
  secret: "your-secret-key"
  expire_hours: 168  # 7天
  refresh_expire_hours: 720  # 30天
  issuer: "m7-backend"

logging:
  level: "info"
  format: "json"
  output: "stdout"
  file_path: "/var/log/m7-backend/app.log"
  max_size: 100  # MB
  max_backups: 3
  max_age: 28  # days
  compress: true

monitoring:
  prometheus:
    enabled: true
    port: 9090
    path: "/metrics"
  grafana:
    enabled: true
    port: 3000

security:
  rate_limit:
    requests_per_minute: 60
    burst: 10
  cors:
    allowed_origins: ["*"]
    allowed_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_headers: ["*"]
    max_age: 86400

business:
  detection:
    max_concurrent_tasks: 3
    timeout_minutes: 30
    auto_stop_count: 0
  recharge:
    min_amount: 10.00
    max_amount: 10000.00
    exchange_rate: 1.0
  extract_code:
    valid_hours: 24
    max_usage_count: 1
```

## MariaDB特定配置

### Go配置结构体
```go
// 主配置结构
type Config struct {
    App        AppConfig        `yaml:"app"`
    Server     ServerConfig     `yaml:"server"`
    Database   DatabaseConfig   `yaml:"database"`
    Redis      RedisConfig      `yaml:"redis"`
    JWT        JWTConfig        `yaml:"jwt"`
    Logging    LoggingConfig    `yaml:"logging"`
    Monitoring MonitoringConfig `yaml:"monitoring"`
    Security   SecurityConfig   `yaml:"security"`
    Business   BusinessConfig   `yaml:"business"`
}

// 应用配置
type AppConfig struct {
    Name    string `yaml:"name"`
    Version string `yaml:"version"`
    Port    int    `yaml:"port"`
    Env     string `yaml:"env"`
    Debug   bool   `yaml:"debug"`
}

// 服务器配置
type ServerConfig struct {
    Host         string        `yaml:"host"`
    Port         int          `yaml:"port"`
    ReadTimeout  time.Duration `yaml:"read_timeout"`
    WriteTimeout time.Duration `yaml:"write_timeout"`
    IdleTimeout  time.Duration `yaml:"idle_timeout"`
}

// 数据库配置
type DatabaseConfig struct {
    Host         string        `yaml:"host"`
    Port         int          `yaml:"port"`
    Name         string        `yaml:"name"`
    Username     string        `yaml:"username"`
    Password     string        `yaml:"password"`
    Charset      string        `yaml:"charset"`
    Collation    string        `yaml:"collation"`
    MaxOpenConns int          `yaml:"max_open_conns"`
    MaxIdleConns int          `yaml:"max_idle_conns"`
    MaxLifetime  time.Duration `yaml:"max_lifetime"`
    SSLMode      string        `yaml:"ssl_mode"`
}

// Redis配置
type RedisConfig struct {
    Host               string        `yaml:"host"`
    Port               int          `yaml:"port"`
    Password           string        `yaml:"password"`
    DB                 int          `yaml:"db"`
    PoolSize           int          `yaml:"pool_size"`
    MinIdleConns       int          `yaml:"min_idle_conns"`
    MaxConnAge         time.Duration `yaml:"max_conn_age"`
    PoolTimeout        time.Duration `yaml:"pool_timeout"`
    IdleTimeout        time.Duration `yaml:"idle_timeout"`
    IdleCheckFrequency time.Duration `yaml:"idle_check_frequency"`
}

// JWT配置
type JWTConfig struct {
    Secret             string `yaml:"secret"`
    ExpireHours        int    `yaml:"expire_hours"`
    RefreshExpireHours int    `yaml:"refresh_expire_hours"`
    Issuer             string `yaml:"issuer"`
}

// 日志配置
type LoggingConfig struct {
    Level      string `yaml:"level"`
    Format     string `yaml:"format"`
    Output     string `yaml:"output"`
    FilePath   string `yaml:"file_path"`
    MaxSize    int    `yaml:"max_size"`
    MaxBackups int    `yaml:"max_backups"`
    MaxAge     int    `yaml:"max_age"`
    Compress   bool   `yaml:"compress"`
}

// 监控配置
type MonitoringConfig struct {
    Prometheus PrometheusConfig `yaml:"prometheus"`
    Grafana    GrafanaConfig   `yaml:"grafana"`
}

type PrometheusConfig struct {
    Enabled bool   `yaml:"enabled"`
    Port    int    `yaml:"port"`
    Path    string `yaml:"path"`
}

type GrafanaConfig struct {
    Enabled bool `yaml:"enabled"`
    Port    int  `yaml:"port"`
}

// 安全配置
type SecurityConfig struct {
    RateLimit RateLimitConfig `yaml:"rate_limit"`
    CORS      CORSConfig      `yaml:"cors"`
}

type RateLimitConfig struct {
    RequestsPerMinute int `yaml:"requests_per_minute"`
    Burst             int `yaml:"burst"`
}

type CORSConfig struct {
    AllowedOrigins []string `yaml:"allowed_origins"`
    AllowedMethods []string `yaml:"allowed_methods"`
    AllowedHeaders []string `yaml:"allowed_headers"`
    MaxAge         int      `yaml:"max_age"`
}

// 业务配置
type BusinessConfig struct {
    Detection   DetectionConfig   `yaml:"detection"`
    Recharge    RechargeConfig    `yaml:"recharge"`
    ExtractCode ExtractCodeConfig  `yaml:"extract_code"`
}

type DetectionConfig struct {
    MaxConcurrentTasks int `yaml:"max_concurrent_tasks"`
    TimeoutMinutes     int `yaml:"timeout_minutes"`
    AutoStopCount      int `yaml:"auto_stop_count"`
}

type RechargeConfig struct {
    MinAmount    float64 `yaml:"min_amount"`
    MaxAmount    float64 `yaml:"max_amount"`
    ExchangeRate float64 `yaml:"exchange_rate"`
}

type ExtractCodeConfig struct {
    ValidHours     int `yaml:"valid_hours"`
    MaxUsageCount  int `yaml:"max_usage_count"`
}
```

### 配置加载和管理
```go
// 配置加载器
type ConfigLoader struct {
    configPath string
    config     *Config
}

// 创建配置加载器
func NewConfigLoader(configPath string) *ConfigLoader {
    return &ConfigLoader{
        configPath: configPath,
    }
}

// 加载配置
func (cl *ConfigLoader) Load() (*Config, error) {
    // Check if config file exists
    if _, err := os.Stat(cl.configPath); os.IsNotExist(err) {
        return nil, fmt.Errorf("config file not found: %s", cl.configPath)
    }

    // Read config file
    data, err := os.ReadFile(cl.configPath)
    if err != nil {
        return nil, fmt.Errorf("failed to read config file: %v", err)
    }

    // Parse YAML config
    config := &Config{}
    if err := yaml.Unmarshal(data, config); err != nil {
        return nil, fmt.Errorf("failed to parse config file: %v", err)
    }

    // Validate config
    if err := cl.validate(config); err != nil {
        return nil, fmt.Errorf("config validation failed: %v", err)
    }

    cl.config = config
    return config, nil
}

// 验证配置
func (cl *ConfigLoader) validate(config *Config) error {
    // Validate app configuration
    if config.App.Name == "" {
        return fmt.Errorf("app name cannot be empty")
    }
    if config.App.Port <= 0 || config.App.Port > 65535 {
        return fmt.Errorf("app port must be between 1-65535")
    }

    // Validate database configuration
    if config.Database.Host == "" {
        return fmt.Errorf("database host cannot be empty")
    }
    if config.Database.Port <= 0 || config.Database.Port > 65535 {
        return fmt.Errorf("database port must be between 1-65535")
    }
    if config.Database.Name == "" {
        return fmt.Errorf("database name cannot be empty")
    }

    // Validate Redis configuration
    if config.Redis.Host == "" {
        return fmt.Errorf("Redis host cannot be empty")
    }

    // Validate JWT configuration
    if config.JWT.Secret == "" {
        return fmt.Errorf("JWT secret cannot be empty")
    }
    if len(config.JWT.Secret) < 32 {
        return fmt.Errorf("JWT secret length must be at least 32 characters")
    }

    return nil
}

// 获取配置
func (cl *ConfigLoader) GetConfig() *Config {
    return cl.config
}

// 热重载配置
func (cl *ConfigLoader) Reload() error {
    return cl.Load()
}

// 配置管理单例
var (
    configInstance *Config
    configOnce     sync.Once
)

// 获取全局配置实例
func GetConfig() *Config {
    configOnce.Do(func() {
        loader := NewConfigLoader("config/config.yaml")
        var err error
        configInstance, err = loader.Load()
        if err != nil {
            log.Fatalf("加载配置失败: %v", err)
        }
    })
    return configInstance
}

// 初始化配置
func InitConfig(configPath string) error {
    loader := NewConfigLoader(configPath)
    config, err := loader.Load()
    if err != nil {
        return err
    }
    configInstance = config
    return nil
}
```

### MariaDB优化配置
```sql
-- MariaDB优化配置
-- 在 /etc/mysql/mariadb.conf.d/50-server.cnf 中添加以下配置

[mysqld]
# 基本配置
default-storage-engine = InnoDB
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# 连接配置
max_connections = 200
max_user_connections = 100
connect_timeout = 10
wait_timeout = 600
interactive_timeout = 600

# 缓冲池配置
innodb_buffer_pool_size = 1G
innodb_buffer_pool_instances = 1
innodb_log_file_size = 256M
innodb_log_buffer_size = 16M

# 查询缓存
query_cache_type = 1
query_cache_size = 64M
query_cache_limit = 2M

# 慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# 二进制日志
log-bin = mysql-bin
binlog_format = ROW
expire_logs_days = 7
```

## 开发工具要求

### 必需工具
- **Go**: 1.21+
- **MariaDB**: 10.6+
- **Redis**: 6.0+
- **Git**: 2.30+
- **Make**: 构建工具

### 推荐工具
- **IDE**: GoLand或VSCode
- **API测试**: Postman或Insomnia
- **数据库管理**: HeidiSQL或DBeaver
- **监控**: Grafana
- **日志**: Kibana

## 代码质量要求

### 代码规范
1. **格式化**: 使用gofmt和goimports
2. **静态分析**: 使用golangci-lint
3. **代码审查**: 所有代码必须经过审查
4. **文档**: 关键函数必须有注释
5. **测试**: 新功能必须有测试

### 性能要求
1. **内存使用**: 单实例内存使用 < 2GB
2. **CPU使用**: 正常负载下CPU使用率 < 70%
3. **响应时间**: API响应时间 < 200ms
4. **并发处理**: 支持1000+并发用户

### 安全要求
1. **依赖安全**: 定期更新依赖包
2. **漏洞扫描**: 使用安全扫描工具
3. **权限控制**: 最小权限原则
4. **数据加密**: 敏感数据必须加密

## 依赖包要求

### go.mod依赖
```go
module m7-backend

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/golang-jwt/jwt/v5 v5.0.0
    github.com/go-redis/redis/v8 v8.11.5
    github.com/spf13/viper v1.16.0
    github.com/sirupsen/logrus v1.9.3
    github.com/prometheus/client_golang v1.16.0
    gopkg.in/yaml.v3 v3.0.1
    gorm.io/gorm v1.25.2
    gorm.io/driver/mysql v1.5.1
    github.com/stretchr/testify v1.8.4
    github.com/golangci/golangci-lint v1.54.2
)
```

### 配置文件结构
```
m7-backend/
├── config/
│   ├── config.yaml          # 主配置文件
│   ├── config.dev.yaml      # 开发环境配置
│   ├── config.prod.yaml     # 生产环境配置
│   └── config.test.yaml     # 测试环境配置
├── migrations/
├── logs/
└── ...
```

### 配置加载示例
```go
// main.go 中的配置加载
func main() {
    // 根据环境变量选择配置文件
    env := os.Getenv("APP_ENV")
    if env == "" {
        env = "development"
    }
    
    configPath := fmt.Sprintf("config/config.%s.yaml", env)
    if err := InitConfig(configPath); err != nil {
        log.Fatalf("failed to initialize config: %v", err)
    }
    
    config := GetConfig()
    log.Infof("application started: %s v%s", config.App.Name, config.App.Version)
    
    // 启动服务器
    server := NewServer(config)
    server.Start()
}
```

请按照以上要求实现完整的后端系统，确保代码质量高、可维护性强、性能优秀。
