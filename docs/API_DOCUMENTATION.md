# M7前端项目API接口文档

## 1. 项目概述

### 1.1 技术栈
- **前端框架**: Next.js 14 + TypeScript
- **状态管理**: React Context + Custom Hooks
- **UI组件**: Tailwind CSS + shadcn/ui
- **API客户端**: 统一封装的fetch请求
- **Mock服务**: MSW (Mock Service Worker)

### 1.2 API基础配置
- **开发环境**: `http://localhost:8080/api`
- **生产环境**: 通过环境变量 `NEXT_PUBLIC_API_BASE_URL` 配置
- **认证方式**: JWT Bearer Token

## 2. 通用响应格式

```typescript
interface ApiResponse<T> {
  success: boolean    // 请求是否成功
  data?: T | null     // 响应数据，失败时为null
  message?: string    // 响应消息，成功或失败的原因
  error?: string      // 详细错误信息
}
```

## 3. 认证相关API

### 3.1 用户登录
- **接口**: `POST /auth/login`
- **描述**: 用户登录获取访问令牌
- **请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **成功响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800,
    "user": {
      "id": "user_123",
      "username": "testuser",
      "email": "test@example.com",
      "name": "测试用户",
      "level": 2,
      "mCoins": 500.0,
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  "message": "登录成功"
}
```

### 3.2 用户注册
- **接口**: `POST /auth/register`
- **描述**: 新用户注册
- **请求体**:
```json
{
  "username": "newuser",
  "email": "new@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### 3.3 获取用户信息
- **接口**: `GET /auth/user`
- **描述**: 获取当前登录用户信息
- **认证**: 需要Bearer Token

## 4. CVV检测相关API

### 4.1 获取用户检测状态
- **接口**: `GET /cvv-check/user-status`
- **认证**: 需要Bearer Token
- **响应**:
```json
{
  "success": true,
  "data": {
    "status": "detecting",
    "detectionId": "det_123456789"
  }
}
```

### 4.2 获取检测配置
- **接口**: `GET /cvv-check/config`
- **认证**: 需要Bearer Token
- **响应**:
```json
{
  "success": true,
  "data": {
    "channels": [
      {
        "id": 1,
        "name": "高速通道",
        "rate": "99.9%",
        "speed": "100/分钟",
        "description": "高准确率检测通道",
        "status": "online",
        "consumption": "1 M币/张"
      }
    ],
    "modes": [
      {
        "id": "charge_test",
        "name": "扣费测试",
        "description": "真实扣费检测"
      }
    ],
    "settings": {
      "maxCardsPerBatch": 1000,
      "autoStopEnabled": true,
      "defaultValidStopCount": 10
    }
  }
}
```

### 4.3 启动检测
- **接口**: `POST /cvv-check/start-detection`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "cvvs": ["123", "456", "789"],
  "autoStopCount": 10,
  "channelId": "1",
  "modeId": "charge_test"
}
```

### 4.4 获取检测进度
- **接口**: `GET /cvv-check/detection-progress`
- **认证**: 需要Bearer Token
- **查询参数**: `detectionId` (可选)
- **响应**:
```json
{
  "success": true,
  "data": {
    "totalCards": 100,
    "processedCards": 45,
    "validCards": 12,
    "invalidCards": 30,
    "progress": 45,
    "estimatedTimeRemaining": "2分钟",
    "currentChannel": {
      "id": 1,
      "name": "高速通道",
      "speed": "100/分钟"
    },
    "detectionConfig": {
      "mode": "charge_test",
      "autoStop": true,
      "validStopCount": 10
    },
    "startTime": "2024-01-15T10:30:00Z",
    "logs": [
      {
        "time": "2024-01-15T10:30:15Z",
        "message": "开始检测第1张卡",
        "type": "info"
      }
    ]
  }
}
```

### 4.5 获取检测结果
- **接口**: `POST /cvv-check/detection-results`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "detectionId": "det_123456789"
}
```

### 4.6 停止检测
- **接口**: `POST /cvv-check/stop-detection`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "detectionId": "det_123456789"
}
```

### 4.7 生成提取码
- **接口**: `POST /cvv-check/generate-extract-code`
- **认证**: 需要Bearer Token

### 4.8 获取提取码价格
- **接口**: `POST /cvv-check/extract-code/generate/price`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "detectionId": "det_123456789"
}
```

## 5. BIN分类相关API

### 5.1 获取BIN分类配置
- **接口**: `GET /bin-classify/config`
- **认证**: 需要Bearer Token

### 5.2 开始BIN分类
- **接口**: `POST /bin-classify/start`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "cardNumbers": ["4147202688856879", "5555555555554444"],
  "category": "country"
}
```

### 5.3 获取BIN分类结果
- **接口**: `GET /bin-classify/results`
- **认证**: 需要Bearer Token
- **查询参数**: `taskId`
- **响应**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "cardNumber": "4147202688856879",
        "brand": "Visa",
        "type": "Credit",
        "level": "Classic",
        "bank": "Chase Bank",
        "country": "United States",
        "currency": "USD"
      }
    ],
    "groupedResults": {
      "United States": [
        {
          "cardNumber": "4147202688856879",
          "brand": "Visa",
          "type": "Credit",
          "level": "Classic",
          "bank": "Chase Bank",
          "country": "United States",
          "currency": "USD"
        }
      ]
    },
    "totalCards": 100,
    "categories": ["United States", "Canada"],
    "processingTime": 1500
  }
}
```

## 6. 卡信息提取相关API

### 6.1 获取卡信息提取配置
- **接口**: `GET /card-extract/config`
- **认证**: 需要Bearer Token

### 6.2 开始卡信息提取
- **接口**: `POST /card-extract/start`
- **认证**: 需要Bearer Token

### 6.3 获取卡信息提取结果
- **接口**: `GET /card-extract/results`
- **认证**: 需要Bearer Token
- **查询参数**: `taskId`

## 7. 提取码相关API

### 7.1 查询提取码
- **接口**: `POST /extract-code`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "extractCode": "EXT123456789"
}
```

### 7.2 验证提取码
- **接口**: `POST /extract-code/verify`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "extractCode": "EXT123456789",
  "verificationCode": "VER123456"
}
```

### 7.3 提取码支付
- **接口**: `POST /extract-code/payment`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "extractCode": "EXT123456789",
  "verificationCode": "VER123456"
}
```

### 7.4 支付回调
- **接口**: `POST /extract-code/payment/callback`
- **认证**: 需要Bearer Token

### 7.5 获取提取码历史
- **接口**: `GET /extract-code/history`
- **认证**: 需要Bearer Token

## 8. 信息生成相关API

### 8.1 获取信息生成配置
- **接口**: `GET /info-generate/config`
- **认证**: 需要Bearer Token

### 8.2 开始信息生成
- **接口**: `POST /info-generate/start`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "cardNumbers": ["4147202688856879", "5555555555554444"]
}
```

### 8.3 获取信息生成结果
- **接口**: `GET /info-generate/results`
- **认证**: 需要Bearer Token
- **查询参数**: `taskId`
- **响应**:
```json
{
  "success": true,
  "data": {
    "successData": [
      {
        "cardNumber": "4147202688856879",
        "generatedInfo": {
          "name": "John Doe",
          "address": "123 Main St",
          "phone": "+1-555-0123",
          "email": "john@example.com"
        }
      }
    ],
    "failedCardNumbers": [],
    "totalCost": 10
  }
}
```

## 9. 充值相关API

### 9.1 获取充值套餐
- **接口**: `GET /recharge/packages`
- **认证**: 需要Bearer Token
- **响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "pkg_10",
      "name": "入门套餐",
      "mCoinAmount": 10,
      "usdtPrice": 10,
      "discount": 0,
      "originalPrice": 10,
      "description": "适合新用户体验CVV检测功能",
      "isPopular": false,
      "isRecommended": false,
      "isActive": true
    }
  ]
}
```

### 9.2 创建充值订单
- **接口**: `POST /recharge/create-order`
- **认证**: 需要Bearer Token
- **请求体**:
```json
{
  "packageId": "pkg_10",
  "paymentMethod": "usdt"
}
```

### 9.3 获取充值历史
- **接口**: `GET /recharge/history`
- **认证**: 需要Bearer Token

## 10. 公告相关API

### 10.1 获取公告列表
- **接口**: `GET /announcements`
- **响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ann_001",
      "type": "maintenance",
      "title": "系统维护通知",
      "message": "系统将于今晚23:00-01:00进行维护升级",
      "priority": 3,
      "position": "top",
      "carouselDuration": 5000
    }
  ]
}
```

## 11. 错误处理

### 11.1 常见HTTP状态码
- `200`: 请求成功
- `400`: 请求参数错误
- `401`: 未授权，需要登录
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部错误

### 11.2 错误响应格式
```json
{
  "success": false,
  "data": null,
  "message": "错误描述信息",
  "error": "详细错误信息"
}
```

## 12. 权限控制

### 12.1 用户权限级别
- **游客 (0)**: 只能访问基础功能
- **级别1**: 可访问CVV检测、BIN分类、充值
- **级别2**: 在级别1基础上增加卡信息提取、信息生成
- **级别3+**: 在级别2基础上增加提取码查询功能

### 12.2 受保护路由
- `/account`: 需要登录
- `/card-extract`: 需要级别1权限
- `/info-generate`: 需要级别2权限
- `/extract-code`: 需要级别3权限

## 13. 开发调试

### 13.1 调试模式
通过环境变量 `NEXT_PUBLIC_DEBUG_MODE=true` 启用调试模式，会在控制台输出详细的API请求日志。

### 13.2 Mock数据
项目集成了MSW (Mock Service Worker) 用于开发环境的API模拟，Mock数据定义在 `mocks/handlers.ts` 文件中。

### 13.3 环境变量
```bash
# API基础URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# 调试模式
NEXT_PUBLIC_DEBUG_MODE=true
```

---

*本文档最后更新时间: 2024年1月*