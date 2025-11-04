# M7后端项目文档和目录结构

## 项目概述
M7后端系统是一个基于Go语言开发的卡片检测和分类系统，提供CVV检测、BIN分类、卡信息提取、信息生成、充值等核心功能。

## 技术栈
- **语言**: Go 1.21+
- **Web框架**: Gin
- **数据库**: MariaDB 10.6+
- **ORM**: GORM
- **认证**: JWT
- **实时通信**: HTTP轮询
- **缓存**: Redis (可选)
- **日志**: Logrus
- **配置**: Viper + YAML
- **文档**: Swagger

## 项目目录结构

```
m7-backend/
├── cmd/                          # 应用程序入口
│   └── server/
│       └── main.go              # 主程序入口
├── internal/                     # 内部包，不对外暴露
│   ├── config/                   # 配置管理
│   │   ├── config.go
│   │   ├── loader.go
│   │   └── database.go
│   ├── database/                # 数据库相关
│   │   ├── connection.go
│   │   ├── migrations.go
│   │   └── seeds.go
│   ├── models/                   # 数据模型
│   │   ├── user.go
│   │   ├── detection_task.go
│   │   ├── detection_card.go
│   │   ├── detection_channel.go
│   │   ├── extract_code.go
│   │   ├── recharge_package.go
│   │   ├── recharge_order.go
│   │   ├── announcement.go
│   │   ├── user_session.go
│   │   ├── system_config.go
│   │   └── operation_log.go
│   ├── handlers/                 # HTTP处理器
│   │   ├── auth.go
│   │   ├── cvv_check.go
│   │   ├── bin_classify.go
│   │   ├── card_extract.go
│   │   ├── info_generate.go
│   │   ├── recharge.go
│   │   └── announcement.go
│   ├── routes/                    # 路由配置
│   │   ├── router.go              # 主路由配置
│   │   ├── auth_routes.go         # 认证路由
│   │   ├── cvv_routes.go          # CVV检测路由
│   │   ├── bin_routes.go          # BIN分类路由
│   │   ├── extract_routes.go      # 提取码路由
│   │   ├── info_routes.go         # 信息生成路由
│   │   ├── recharge_routes.go     # 充值路由
│   │   └── announcement_routes.go # 公告路由
│   ├── services/                 # 业务逻辑层
│   │   ├── auth_service.go
│   │   ├── detection_service.go
│   │   ├── card_service.go
│   │   ├── payment_service.go
│   │   └── notification_service.go
│   ├── repositories/             # 数据访问层
│   │   ├── user_repository.go
│   │   ├── detection_task_repository.go
│   │   ├── detection_card_repository.go
│   │   ├── detection_channel_repository.go
│   │   ├── extract_code_repository.go
│   │   ├── recharge_package_repository.go
│   │   ├── recharge_order_repository.go
│   │   ├── announcement_repository.go
│   │   ├── user_session_repository.go
│   │   ├── system_config_repository.go
│   │   └── operation_log_repository.go
│   ├── middleware/               # 中间件
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── logger.go
│   │   └── rate_limit.go
│   ├── interfaces/              # 接口定义
│   │   ├── repository.go         # 仓储接口
│   │   ├── service.go           # 服务接口
│   │   ├── handler.go           # 处理器接口
│   │   └── middleware.go        # 中间件接口
│   ├── dto/                     # 数据传输对象
│   │   ├── auth_dto.go
│   │   ├── detection_dto.go
│   │   ├── card_dto.go
│   │   ├── recharge_dto.go
│   │   └── common_dto.go
│   ├── validators/              # 验证器
│   │   ├── auth_validator.go
│   │   ├── detection_validator.go
│   │   ├── card_validator.go
│   │   └── recharge_validator.go
│   ├── utils/                    # 工具函数
│   │   ├── jwt.go
│   │   ├── password.go           # 密码处理（明文存储）
│   │   ├── validator.go
│   │   ├── crypto.go
│   │   ├── response.go
│   │   └── pagination.go
│   ├── events/                   # 事件系统
│   │   ├── event.go
│   │   ├── publisher.go
│   │   ├── subscriber.go
│   │   └── handlers/
│   │       ├── detection_event.go
│   │       ├── payment_event.go
│   │       └── notification_event.go
│   ├── di/                       # 依赖注入
│   │   ├── container.go          # 依赖注入容器
│   │   ├── providers.go          # 服务提供者
│   │   └── wire.go              # 依赖注入配置
│   ├── factories/                # 工厂模式
│   │   ├── repository_factory.go
│   │   ├── service_factory.go
│   │   └── handler_factory.go
│   └── polling/                  # 轮询处理
│       ├── hub.go
│       ├── client.go
│       └── handler.go
├── pkg/                         # 公共包，可被外部使用
│   ├── auth/                    # 认证相关
│   │   ├── jwt.go
│   │   └── password.go          # 密码处理（明文存储）
│   ├── logger/                  # 日志相关
│   │   └── logger.go
│   ├── response/                # 响应格式
│   │   └── response.go
│   └── errors/                  # 错误处理
│       └── errors.go
├── config/                      # 配置文件
│   ├── config.yaml              # 主配置文件
│   ├── config.dev.yaml          # 开发环境配置
│   ├── config.prod.yaml         # 生产环境配置
│   └── config.test.yaml         # 测试环境配置
├── migrations/                  # 数据库迁移文件
│   ├── 001_create_users.sql
│   ├── 002_create_detection_tasks.sql
│   ├── 003_create_detection_cards.sql
│   ├── 004_create_detection_channels.sql
│   ├── 005_create_extract_codes.sql
│   ├── 006_create_recharge_packages.sql
│   ├── 007_create_recharge_orders.sql
│   ├── 008_create_announcements.sql
│   ├── 009_create_user_sessions.sql
│   ├── 010_create_system_configs.sql
│   └── 011_create_operation_logs.sql
├── docs/                       # 文档
│   ├── api/                     # API文档
│   │   ├── auth.md
│   │   ├── cvv_check.md
│   │   ├── bin_classify.md
│   │   ├── card_extract.md
│   │   ├── info_generate.md
│   │   ├── recharge.md
│   │   └── announcement.md
│   ├── database/               # 数据库文档
│   │   ├── schema.md
│   │   └── indexes.md
│   └── deployment/             # 部署文档
│       ├── docker.md
│       └── production.md
├── scripts/                    # 脚本文件
│   ├── migrate.sh
│   ├── seed.sh
│   └── test.sh
├── tests/                      # 测试文件
│   ├── integration/
│   ├── unit/
│   └── fixtures/
├── logs/                       # 日志文件目录
│   └── app.log
├── bin/                        # 构建输出目录
│   └── m7-backend
├── .gitignore
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## 核心模块说明

### 1. 认证模块 (auth)
- 用户注册/登录
- JWT令牌管理
- 密码加密
- 权限验证

### 2. CVV检测模块 (cvv_check)
- 实时CVV检测
- 检测进度跟踪
- 检测结果管理
- HTTP轮询进度查询

### 3. BIN分类模块 (bin_classify)
- 卡片BIN信息查询
- 分类算法实现
- 结果导出

### 4. 卡信息提取模块 (card_extract)
- 提取码生成和验证
- 支付验证
- 历史记录管理

### 5. 信息生成模块 (info_generate)
- 持卡人信息生成
- 地址信息生成
- 联系方式生成

### 6. 充值模块 (recharge)
- 充值套餐管理
- 订单处理
- 支付回调处理

### 7. 公告模块 (announcement)
- 系统公告管理
- 轮播公告
- 维护通知

## 路由设计

### 路由文件结构
- **router.go** - 主路由配置，注册所有子路由
- **auth_routes.go** - 认证相关路由 (/api/auth/*)
- **cvv_routes.go** - CVV检测路由 (/api/cvv-check/*)
- **bin_routes.go** - BIN分类路由 (/api/bin-classify/*)
- **extract_routes.go** - 提取码路由 (/api/extract-code/*)
- **info_routes.go** - 信息生成路由 (/api/info-generate/*)
- **recharge_routes.go** - 充值路由 (/api/recharge/*)
- **announcement_routes.go** - 公告路由 (/api/announcements/*)

### 路由组织原则
1. **模块化路由**: 每个功能模块有独立的路由文件
2. **统一前缀**: 所有API路由使用/api前缀
3. **版本控制**: 支持API版本管理
4. **中间件**: 统一应用认证、日志、限流等中间件
5. **错误处理**: 统一的错误处理和响应格式

## 低耦合架构设计

### 1. 接口抽象层 (interfaces/)
- **repository.go**: 定义所有仓储接口，实现数据访问层抽象
- **service.go**: 定义所有服务接口，实现业务逻辑层抽象
- **handler.go**: 定义所有处理器接口，实现HTTP层抽象
- **middleware.go**: 定义所有中间件接口，实现横切关注点抽象

### 2. 数据传输对象 (dto/)
- **auth_dto.go**: 认证相关的请求/响应DTO
- **detection_dto.go**: 检测相关的请求/响应DTO
- **card_dto.go**: 卡片相关的请求/响应DTO
- **recharge_dto.go**: 充值相关的请求/响应DTO
- **common_dto.go**: 通用DTO，如分页、响应格式等

### 3. 验证器层 (validators/)
- **auth_validator.go**: 认证请求验证
- **detection_validator.go**: 检测请求验证
- **card_validator.go**: 卡片请求验证
- **recharge_validator.go**: 充值请求验证

### 4. 事件驱动架构 (events/)
- **event.go**: 事件基础结构
- **publisher.go**: 事件发布者
- **subscriber.go**: 事件订阅者
- **handlers/**: 事件处理器
  - **detection_event.go**: 检测相关事件处理
  - **payment_event.go**: 支付相关事件处理
  - **notification_event.go**: 通知相关事件处理

### 5. 依赖注入 (di/)
- **container.go**: 依赖注入容器，管理所有服务实例
- **providers.go**: 服务提供者，定义如何创建服务实例
- **wire.go**: 依赖注入配置，使用Google Wire进行编译时依赖注入

### 6. 工厂模式 (factories/)
- **repository_factory.go**: 仓储工厂，创建数据访问层实例
- **service_factory.go**: 服务工厂，创建业务逻辑层实例
- **handler_factory.go**: 处理器工厂，创建HTTP处理器实例

## 低耦合设计原则

### 1. 依赖倒置原则 (DIP)
- 高层模块不依赖低层模块，都依赖于抽象
- 抽象不依赖细节，细节依赖抽象
- 通过接口实现模块间的解耦

### 2. 单一职责原则 (SRP)
- 每个模块只负责一个功能
- 服务层只处理业务逻辑
- 仓储层只处理数据访问
- 处理器层只处理HTTP请求

### 3. 开闭原则 (OCP)
- 对扩展开放，对修改关闭
- 通过接口和依赖注入实现可扩展性
- 新功能通过实现接口添加，无需修改现有代码

### 4. 接口隔离原则 (ISP)
- 客户端不应依赖它不需要的接口
- 接口应该小而专一
- 避免胖接口，提供细粒度的接口

### 5. 依赖注入模式
- 通过构造函数注入依赖
- 使用接口而不是具体实现
- 便于单元测试和模拟

## 架构层次说明

```
┌─────────────────────────────────────┐
│           HTTP Layer                │  ← handlers/, routes/
├─────────────────────────────────────┤
│         Business Layer              │  ← services/
├─────────────────────────────────────┤
│         Data Access Layer           │  ← repositories/
├─────────────────────────────────────┤
│         Infrastructure Layer        │  ← database/, events/
└─────────────────────────────────────┘
```

## 低耦合实现示例

### 1. 接口定义示例
```go
// internal/interfaces/repository.go
type UserRepository interface {
    Create(user *models.User) error
    GetByID(id string) (*models.User, error)
    GetByEmail(email string) (*models.User, error)
    Update(user *models.User) error
    Delete(id string) error
}

// internal/interfaces/service.go
type AuthService interface {
    Register(req *dto.RegisterRequest) (*dto.RegisterResponse, error)
    Login(req *dto.LoginRequest) (*dto.LoginResponse, error)
    ValidateToken(token string) (*models.User, error)
}
```

### 2. 依赖注入示例
```go
// internal/di/container.go
type Container struct {
    userRepo    interfaces.UserRepository
    authService interfaces.AuthService
    userService interfaces.UserService
}

func NewContainer(db *gorm.DB) *Container {
    return &Container{
        userRepo:    repositories.NewUserRepository(db),
        authService: services.NewAuthService(userRepo),
        userService: services.NewUserService(userRepo),
    }
}
```

### 3. 事件驱动示例
```go
// internal/events/event.go
type Event interface {
    GetType() string
    GetData() interface{}
    GetTimestamp() time.Time
}

type DetectionCompletedEvent struct {
    TaskID    string
    UserID    string
    Results   []models.DetectionCard
    Timestamp time.Time
}

func (e *DetectionCompletedEvent) GetType() string {
    return "detection.completed"
}
```

### 4. 工厂模式示例
```go
// internal/factories/service_factory.go
type ServiceFactory struct {
    userRepo interfaces.UserRepository
}

func NewServiceFactory(userRepo interfaces.UserRepository) *ServiceFactory {
    return &ServiceFactory{userRepo: userRepo}
}

func (f *ServiceFactory) CreateAuthService() interfaces.AuthService {
    return services.NewAuthService(f.userRepo)
}
```

## 测试友好设计

### 1. 接口模拟
- 所有依赖都通过接口注入
- 便于创建Mock对象进行单元测试
- 支持依赖替换和测试隔离

### 2. 配置分离
- 配置通过依赖注入传递
- 支持测试环境独立配置
- 便于环境切换和测试

### 3. 事件测试
- 事件系统支持测试模式
- 可以验证事件发布和订阅
- 支持异步操作测试

## 性能优化

### 1. 连接池管理
- 数据库连接池统一管理
- Redis连接池复用
- HTTP客户端连接池

### 2. 缓存策略
- 接口层缓存
- 服务层缓存
- 数据层缓存

### 3. 异步处理
- 事件驱动异步处理
- 后台任务队列
- 非阻塞操作

## AI代码生成质量保证

### 1. 代码生成策略

#### 1.1 分步骤生成
- **第一步**: 生成接口定义
- **第二步**: 生成数据结构
- **第三步**: 生成基础实现
- **第四步**: 生成业务逻辑
- **第五步**: 生成测试代码

#### 1.2 模板驱动生成
```go
// 使用代码模板确保一致性
// internal/templates/repository_template.go
type {{.Name}}Repository interface {
    Create({{.Name | ToLower}} *models.{{.Name}}) error
    GetByID(id string) (*models.{{.Name}}, error)
    Update({{.Name | ToLower}} *models.{{.Name}}) error
    Delete(id string) error
}
```

#### 1.3 约束条件生成
- 明确指定Go版本和依赖版本
- 强制使用特定的设计模式
- 要求遵循项目命名规范
- 强制添加错误处理

### 2. 代码验证机制

#### 2.1 静态分析工具
```yaml
# .golangci.yml
linters:
  enable:
    - gofmt
    - goimports
    - govet
    - ineffassign
    - misspell
    - unused
    - gosimple
    - staticcheck
    - gosec
    - errcheck
    - gocyclo
    - goconst
    - gocritic
    - gomnd
    - gosec
    - interfacer
    - maligned
    - prealloc
    - scopelint
    - structcheck
    - varcheck
    - whitespace

linters-settings:
  gocyclo:
    min-complexity: 15
  gomnd:
    settings:
      mnd:
        checks: argument,case,condition,operation,return,assign
  gosec:
    severity: medium
    confidence: medium
```

#### 2.2 代码质量门禁
```go
// 强制要求实现的接口
type RequiredInterface interface {
    // 必须实现的方法
    Validate() error
    Process() error
    Cleanup() error
}

// 强制要求的结构体标签
type User struct {
    ID       string `json:"id" gorm:"primaryKey" validate:"required"`
    Username string `json:"username" gorm:"uniqueIndex" validate:"required,min=3,max=50"`
    Email    string `json:"email" gorm:"uniqueIndex" validate:"required,email"`
}
```

### 3. 测试驱动开发

#### 3.1 测试先行
```go
// 先生成测试，再生成实现
func TestUserRepository_Create(t *testing.T) {
    // Given
    repo := NewUserRepository(mockDB)
    user := &models.User{
        Username: "testuser",
        Email:    "test@example.com",
    }
    
    // When
    err := repo.Create(user)
    
    // Then
    assert.NoError(t, err)
    assert.NotEmpty(t, user.ID)
}
```

#### 3.2 测试覆盖率要求
```bash
# 要求测试覆盖率 > 80%
go test -coverprofile=coverage.out ./...
go tool cover -func=coverage.out | grep total
```

### 4. 代码审查检查点

#### 4.1 安全检查清单
- [ ] 输入验证和清理
- [ ] SQL注入防护
- [ ] XSS攻击防护
- [ ] 权限验证
- [ ] 错误信息不泄露敏感信息
- [ ] 密码明文存储（按需求）

#### 4.2 性能检查清单
- [ ] 数据库查询优化
- [ ] 连接池配置
- [ ] 缓存策略
- [ ] 内存泄漏检查
- [ ] 并发安全

#### 4.3 代码质量检查清单
- [ ] 函数复杂度 < 15
- [ ] 文件行数 < 500
- [ ] 函数参数 < 5个
- [ ] 嵌套层级 < 4层
- [ ] 错误处理完整
- [ ] 日志记录适当

### 5. 自动化验证

#### 5.1 CI/CD流水线
```yaml
# .github/workflows/quality-check.yml
name: Quality Check
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v3
        with:
          go-version: '1.21'
      
      - name: Run tests
        run: go test -v -coverprofile=coverage.out ./...
      
      - name: Check coverage
        run: |
          go tool cover -func=coverage.out
          COVERAGE=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | sed 's/%//')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage is $COVERAGE%, but required 80%"
            exit 1
          fi
      
      - name: Run linters
        run: |
          go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
          golangci-lint run
      
      - name: Security scan
        run: |
          go install github.com/securecodewarrior/gosec/v2/cmd/gosec@latest
          gosec ./...
```

#### 5.2 预提交钩子
```bash
#!/bin/bash
# .git/hooks/pre-commit
echo "Running pre-commit checks..."

# 格式化检查
if ! gofmt -l . | grep -q .; then
    echo "Code is not formatted. Run 'gofmt -w .'"
    exit 1
fi

# 导入检查
if ! goimports -l . | grep -q .; then
    echo "Imports are not organized. Run 'goimports -w .'"
    exit 1
fi

# 测试检查
if ! go test ./...; then
    echo "Tests are failing"
    exit 1
fi

# 静态分析
if ! golangci-lint run; then
    echo "Linting failed"
    exit 1
fi

echo "All checks passed!"
```

### 6. 代码生成最佳实践

#### 6.1 提示词优化
```
请按照以下要求生成Go代码：

1. 必须遵循Go官方编码规范
2. 必须添加完整的错误处理
3. 必须添加适当的日志记录
4. 必须添加单元测试
5. 必须使用接口抽象
6. 必须添加输入验证
7. 必须考虑并发安全
8. 必须添加性能优化
9. 必须添加安全防护
10. 必须添加文档注释

代码结构要求：
- 使用依赖注入
- 实现接口抽象
- 添加中间件支持
- 支持配置管理
- 添加监控指标
```

#### 6.2 代码模板
```go
// 标准服务模板
type {{.ServiceName}}Service struct {
    repo    interfaces.{{.RepositoryName}}
    logger  logger.Logger
    config  *config.Config
}

func New{{.ServiceName}}Service(
    repo interfaces.{{.RepositoryName}},
    logger logger.Logger,
    config *config.Config,
) interfaces.{{.ServiceName}}Service {
    return &{{.ServiceName}}Service{
        repo:   repo,
        logger: logger,
        config: config,
    }
}

func (s *{{.ServiceName}}Service) {{.MethodName}}(req *dto.{{.RequestName}}) (*dto.{{.ResponseName}}, error) {
    // 输入验证
    if err := s.validate{{.RequestName}}(req); err != nil {
        s.logger.Error("Validation failed", "error", err)
        return nil, err
    }
    
    // 业务逻辑
    result, err := s.repo.{{.RepositoryMethod}}(req)
    if err != nil {
        s.logger.Error("Repository operation failed", "error", err)
        return nil, err
    }
    
    // 返回结果
    return &dto.{{.ResponseName}}{
        // 映射字段
    }, nil
}
```

### 7. 错误预防策略

#### 7.1 常见错误类型
- **空指针引用**: 强制空值检查
- **资源泄漏**: 使用defer确保资源释放
- **并发竞争**: 使用互斥锁和通道
- **内存泄漏**: 定期检查内存使用
- **SQL注入**: 使用参数化查询
- **XSS攻击**: 输入验证和输出转义
- **密码安全**: 明文存储（按需求）

#### 7.2 错误处理模式
```go
// 标准错误处理模式
func (s *Service) ProcessData(data *Data) error {
    // 1. Input validation
    if err := s.validateData(data); err != nil {
        return fmt.Errorf("validation failed: %w", err)
    }
    
    // 2. Business logic
    result, err := s.processBusinessLogic(data)
    if err != nil {
        s.logger.Error("Business logic failed", "error", err)
        return fmt.Errorf("processing failed: %w", err)
    }
    
    // 3. Persistence
    if err := s.saveResult(result); err != nil {
        s.logger.Error("Save failed", "error", err)
        return fmt.Errorf("save failed: %w", err)
    }
    
    return nil
}
```

### 8. 持续改进

#### 8.1 代码质量指标
- 测试覆盖率 > 80%
- 代码重复率 < 5%
- 圈复杂度 < 15
- 技术债务 < 10%

#### 8.2 定期审查
-
- 持续学习和改进

## 数据库设计

### 核心表结构
1. **users** - 用户表
2. **detection_tasks** - 检测任务表
3. **detection_cards** - 检测卡信息表
4. **detection_channels** - 检测通道表
5. **extract_codes** - 提取码表
6. **recharge_packages** - 充值套餐表
7. **recharge_orders** - 充值订单表
8. **announcements** - 公告表
9. **user_sessions** - 用户会话表
10. **system_configs** - 系统配置表
11. **operation_logs** - 操作日志表

## API设计规范

### 响应格式
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "error": null,
  "timestamp": 1704067200
}
```

### 错误处理
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "error": "ERROR_CODE",
  "timestamp": 1704067200
}
```

### 分页格式
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  },
  "timestamp": 1704067200
}
```

## 开发规范

### 代码规范
1. 使用Go标准格式化工具
2. 遵循Go命名规范
3. 添加适当的注释
4. 使用接口抽象
5. 错误处理要完整

### 测试规范
1. 单元测试覆盖率 > 80%
2. 集成测试覆盖主要业务流程
3. 性能测试覆盖关键接口

### 部署规范
1. 使用systemd管理服务
2. 支持多环境YAML配置
3. 健康检查机制
4. 日志收集和监控
5. 二进制文件直接部署

## 安全考虑

### 认证安全
1. JWT令牌过期机制
2. 密码加密存储
3. 登录失败限制
4. 会话管理

### 数据安全
1. SQL注入防护
2. XSS攻击防护
3. CSRF防护
4. 数据加密传输

### 业务安全
1. 接口频率限制
2. 用户权限控制
3. 敏感操作审计
4. 数据备份机制

## 性能优化

### 数据库优化
1. 合理的索引设计
2. 查询优化
3. 连接池管理
4. 读写分离
5. MariaDB特定优化
   - 使用InnoDB存储引擎
   - 配置合适的缓冲池大小
   - 启用查询缓存
   - 优化慢查询日志

### 应用优化
1. 缓存策略
2. 并发控制
3. 内存管理
4. 资源池化

### 监控告警
1. 系统指标监控
2. 业务指标监控
3. 错误率监控
4. 性能指标监控
