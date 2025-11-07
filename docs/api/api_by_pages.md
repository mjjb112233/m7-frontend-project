# M7 前端项目 API 接口文档（按页面分类）

## 目录

- [基础信息](#基础信息)
- [登录页面 API](#登录页面-api)
- [注册页面 API](#注册页面-api)
- [首页 API](#首页-api)
- [CVV检测页面 API](#cvv检测页面-api)
- [BIN分类页面 API](#bin分类页面-api)
- [BIN查询页面 API](#bin查询页面-api)
- [信息生成页面 API](#信息生成页面-api)
- [充值页面 API](#充值页面-api)
- [账户页面 API](#账户页面-api)
- [公告相关 API](#公告相关-api)

---

## 基础信息

### API 基础配置

- **基础URL**: 从配置文件读取（`config/app.config.json` 中的 `api.baseUrl`）
- **默认基础URL**: `http://localhost:8080/api`
- **认证方式**: JWT Bearer Token
- **响应格式**: JSON
- **字符编码**: UTF-8
- **时间格式**: 10位Unix时间戳（秒级精度，UTC时区）

### 通用响应格式

#### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

#### 错误响应
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

### 认证说明

- 需要认证的接口需要在请求头中添加：`Authorization: Bearer <token>`
- Token 通过登录接口获取
- Token 有效期：7天

---

## 登录页面 API

### 用户登录

- **URL**: `POST /auth/login`
- **描述**: 用户登录，获取访问令牌
- **认证**: 不需要
- **请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "username": "username",
      "email": "user@example.com",
      "name": "User Name",
      "level": 1,
      "mCoins": 50.00,
      "avatarSeed": "Felix",
      "avatarStyle": "adventurer"
    }
  },
  "message": "Login successful"
}
```

- **使用场景**: 
  - 登录页面提交表单时调用
  - 通过 `AuthContext` 的 `login` 方法调用

- **错误处理**:
  - 401: 邮箱或密码错误
  - 400: 请求参数错误

---

## 注册页面 API

### 用户注册

- **URL**: `POST /auth/register`
- **描述**: 新用户注册
- **认证**: 不需要
- **请求体**:
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "avatarSeed": "Felix",
  "avatarStyle": "adventurer"
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "username": "newuser",
      "email": "newuser@example.com",
      "level": 1,
      "mCoins": 50.00,
      "avatarSeed": "Felix",
      "avatarStyle": "adventurer"
    }
  },
  "message": "Registration successful"
}
```

- **使用场景**: 
  - 注册页面提交表单时调用
  - 通过 `AuthContext` 的 `register` 方法调用
  - 自动生成随机头像信息

- **错误处理**:
  - 400: 邮箱已存在、用户名已存在、密码不符合要求
  - 422: 验证错误

---

## 首页 API

### 获取公告列表

- **URL**: `GET /announcements/`
- **描述**: 获取系统公告列表（全局使用，首页加载时调用）
- **认证**: 可选
- **请求参数**: 无

- **响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "announcement_id",
      "titleZh": "系统维护通知",
      "titleEn": "System Maintenance Notice",
      "messageZh": "系统将于今晚进行维护",
      "messageEn": "System will be under maintenance tonight",
      "uiType": "warning",
      "carouselDuration": 5000
    }
  ]
}
```

- **使用场景**: 
  - 应用启动时调用一次
  - 使用 sessionStorage 缓存，避免重复请求
  - 通过 `getAnnouncements()` 函数调用

- **缓存机制**: 
  - 首次请求后缓存到 sessionStorage
  - 后续请求直接使用缓存数据

---

## CVV检测页面 API

### 获取用户检测状态

- **URL**: `GET /cvv-check/detection-status`
- **描述**: 获取用户当前的CVV检测状态
- **认证**: 需要
- **请求参数**: 无

- **响应**:
```json
{
  "success": true,
  "data": {
    "status": "idle",
    "detectionId": "det_1759142666464_w78sy5el2"
  }
}
```

- **状态值**: `idle` | `detecting` | `completed`
- **使用场景**: 页面加载时检查是否有进行中的检测任务

---

### 获取检测配置

- **URL**: `GET /cvv-check/config`
- **描述**: 获取CVV检测的配置信息，包括检测模式和通道
- **认证**: 需要

- **响应**:
```json
{
  "success": true,
  "data": {
    "detectionModes": [
      {
        "mode-id": 1,
        "name": "扣测",
        "channels-data": {
          "description": "扣测模式",
          "channels": [
            {
              "id": 1,
              "name": "高速通道",
              "rate": "2.5",
              "speed": "fast",
              "description": "高速检测通道，速度快",
              "status": "online"
            }
          ]
        }
      }
    ]
  }
}
```

- **使用场景**: 配置步骤中加载可用的检测模式和通道

---

### 开始检测

- **URL**: `POST /cvv-check/start-detection`
- **描述**: 启动CVV检测任务
- **认证**: 需要
- **请求体**:
```json
{
  "cardDataList": [
    "4246315290520780|6|2028|299|77098",
    "4833120094187128|6|2030|427|48504"
  ],
  "mode-id": 1,
  "channelId": 2,
  "autoStopCount": 0,
  "consumption": 3
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "detectionId": "det_1759142666464_w78sy5el2",
    "status": "detecting",
    "totalCVVs": 9,
    "consumption": 3,
    "mode-id": 1,
    "channelId": 2
  },
  "message": "Detection started successfully"
}
```

- **使用场景**: 用户提交检测配置后启动检测

---

### 获取检测进度

- **URL**: `GET /cvv-check/detection-progress`
- **描述**: 获取检测进度信息
- **认证**: 需要
- **查询参数**: 
  - `detectionId` (可选): 检测任务ID

- **响应**:
```json
{
  "success": true,
  "data": {
    "detectionId": "det_1759142666464_w78sy5el2",
    "status": "detecting",
    "totalCVVs": 9,
    "completedCVVs": 3,
    "progress": 33,
    "validCount": 1,
    "invalidCount": 0,
    "unknownCount": 2,
    "consumedMCoins": "0.9",
    "checkData": [
      {
        "cardNumber": "****6393",
        "startTime": 1759142371
      }
    ],
    "systemStatus": {
      "detectionService": "running",
      "channel": "active",
      "concurrentUsers": 25
    }
  }
}
```

- **使用场景**: 
  - 检测进行中定期轮询获取进度
  - 建议轮询间隔：2-5秒

---

### 获取检测结果

- **URL**: `POST /cvv-check/detection-results`
- **描述**: 获取检测结果
- **认证**: 需要
- **查询参数**: 
  - `detectionId` (必需): 检测任务ID

- **请求体**: 无（使用查询参数传递 detectionId）

- **响应**:
```json
{
  "success": true,
  "data": {
    "validResults": [
      {
        "id": 1,
        "cardNumber": "4147202688856879",
        "cvv": "728",
        "expiry": "07/29",
        "other": "测试数据1",
        "detectionCompletedAt": 1704067200
      }
    ],
    "invalidResults": [],
    "unknownResults": [],
    "validCount": 1,
    "invalidCount": 0,
    "unknownCount": 0,
    "consumedCoins": 15.5,
    "detectionStartTime": 1704067200,
    "detectionEndTime": 1704067500
  }
}
```

- **使用场景**: 检测完成后获取最终结果

---

### 停止检测

- **URL**: `POST /cvv-check/stop-detection`
- **描述**: 停止当前正在进行的检测
- **认证**: 需要
- **请求体**:
```json
{
  "detectionId": "det_1759142666464_w78sy5el2"
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "message": "Detection stopped"
  }
}
```

- **使用场景**: 用户主动停止检测任务

---

### 重置检测状态

- **URL**: `GET /cvv-check/reset-detection-status`
- **描述**: 重置用户的检测状态
- **认证**: 需要

- **响应**:
```json
{
  "success": true,
  "data": {
    "message": "Detection status reset successfully"
  }
}
```

- **使用场景**: 清除用户的检测状态，允许开始新的检测

---

### 获取取消状态

- **URL**: `GET /cvv-check/cancel-status`
- **描述**: 查询已取消任务的停止状态
- **认证**: 需要
- **查询参数**: 
  - `detectionId` (必需): 检测任务ID

- **响应**:
```json
{
  "success": true,
  "data": {
    "status": "processing"
  }
}
```

- **状态值**: `processing` | `completed`
- **使用场景**: 查询取消操作的执行状态

---

## BIN分类页面 API

### 开始BIN分类查询

- **URL**: `POST /bin-classify/query`
- **描述**: 开始BIN分类查询任务
- **认证**: 需要
- **请求体**:
```json
{
  "cards": [
    "1234567890123456",
    "9876543210987654"
  ]
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "queryId": "query_1234567890",
    "status": "processing"
  },
  "message": "Classification task started"
}
```

- **使用场景**: 用户提交卡号列表后启动分类任务

---

### 获取BIN分类结果

- **URL**: `GET /bin-classify/results/{queryId}`
- **描述**: 获取BIN分类查询结果
- **认证**: 需要
- **路径参数**: 
  - `queryId` (必需): 查询任务ID

- **响应**:
```json
{
  "success": true,
  "data": {
    "queryId": "query_1234567890",
    "status": "completed",
    "results": {
      "中国": [
        {
          "cardNumber": "1234567890123456",
          "brand": "Visa",
          "type": "信用卡",
          "level": "金卡",
          "bank": "中国银行",
          "country": "中国",
          "currency": "CNY"
        }
      ]
    },
    "totalCards": 2,
    "categories": ["中国", "美国"],
    "processingTime": 5
  }
}
```

- **使用场景**: 轮询查询任务结果

---

### 取消BIN分类查询

- **URL**: `POST /bin-classify/cancel/{queryId}`
- **描述**: 取消BIN分类查询任务
- **认证**: 需要
- **路径参数**: 
  - `queryId` (必需): 查询任务ID

- **响应**:
```json
{
  "success": true,
  "data": null,
  "message": "Query cancelled successfully"
}
```

- **使用场景**: 用户取消正在进行的分类任务

---

## BIN查询页面 API

### 查询BIN信息

- **URL**: `POST /bin-query/query`
- **描述**: 查询银行卡BIN码的详细信息
- **认证**: 需要
- **请求体**:
```json
{
  "bin": "424631"
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "bin_length": 6,
    "number_length": 16,
    "card_brand": "VISA",
    "type": "Credit",
    "card_segment_type": "Classic",
    "bank_name": "Bank Name",
    "country_alpha2": "US",
    "country_numeric": "840",
    "country_name": "United States",
    "product_name": "Visa Classic",
    "authentication_required": true,
    "authentication_name": "3D Secure"
  },
  "message": "Query successful"
}
```

- **使用场景**: 用户输入BIN码后查询详细信息

---

## 信息生成页面 API

### 获取信息生成价格

- **URL**: `GET /info-generate/price`
- **描述**: 获取信息生成的价格（每张卡的价格）
- **认证**: 需要

- **响应**:
```json
{
  "success": true,
  "data": {
    "price": 2.0
  },
  "message": "Generation price retrieved successfully"
}
```

- **使用场景**: 页面加载时获取当前价格，用于计算总费用

---

### 生成信息

- **URL**: `POST /info-generate/generate`
- **描述**: 为卡号生成相关信息（姓名、地址、电话等）
- **认证**: 需要
- **权限要求**: 用户等级 >= 2
- **请求体**:
```json
{
  "cardNumbers": [
    "4246315290520780|06|2028|299|77098",
    "4833120094187128|06|2030|427|48504"
  ],
  "pricePerCard": 2.0
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "successCount": 1,
    "failedCount": 1,
    "totalCost": 3.0,
    "successData": [
      {
        "cardNumber": "4246315290520780",
        "month": "06",
        "year": "2028",
        "fullName": "John Doe",
        "phone": "+1-555-001-8483",
        "email": "john.doe1@gmail.com",
        "address": "100 Main St",
        "city": "Boston",
        "state": "MA",
        "zipCode": "02101",
        "country": "United States"
      }
    ],
    "failedCardNumbers": [
      "4833120094187128|06|2030|427|48504"
    ],
    "generateTime": 1759152610
  },
  "message": "Information generated successfully"
}
```

- **使用场景**: 用户提交卡号列表后生成相关信息

---

## 充值页面 API

### 获取充值套餐

- **URL**: `GET /recharge/packages`
- **描述**: 获取可用的充值套餐列表
- **认证**: 需要

- **响应**:
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "pkg_10",
        "nameZh": "入门套餐",
        "nameEn": "Starter Package",
        "m_coin_amount": 10,
        "usdtPrice": 10,
        "discount": 0,
        "original_price": 10,
        "descriptionZh": "适合新用户体验CVV检测功能",
        "descriptionEn": "Perfect for new users",
        "is_popular": false
      },
      {
        "id": "pkg_50",
        "nameZh": "推荐套餐",
        "nameEn": "Recommended Package",
        "m_coin_amount": 50,
        "usdtPrice": 48.02,
        "discount": 4,
        "original_price": 50,
        "is_popular": true
      }
    ],
    "total": 6
  }
}
```

- **使用场景**: 页面加载时获取套餐列表

---

### 创建充值支付订单

- **URL**: `POST /recharge/payment`
- **描述**: 创建充值支付订单
- **认证**: 需要
- **请求体**:
```json
{
  "packageId": "pkg_50"
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "paymentId": "mock-payment-1759152000408",
    "usdtAmount": 48.02,
    "walletAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    "transactionHash": "0x6a84ced279198",
    "paymentInstructions": [
      "请确保使用TRC20网络转账",
      "转账金额必须精确匹配 48.02 USDT",
      "支付完成后，M币将在10分钟内到账"
    ],
    "validUntil": 1759153800,
    "packageInfo": {
      "packageId": "pkg_50",
      "mCoinAmount": 50,
      "usdtPrice": 48.02,
      "discount": 4
    }
  },
  "message": "Payment order created successfully"
}
```

- **使用场景**: 用户选择套餐后创建支付订单

---

### 查询支付结果

- **URL**: `GET /recharge/result/{paymentId}`
- **描述**: 查询支付订单的状态和结果
- **认证**: 需要
- **路径参数**: 
  - `paymentId` (必需): 支付订单ID

- **响应**:
```json
{
  "success": true,
  "data": {
    "paymentId": "mock-payment-1759152000408",
    "paymentStatus": "success",
    "mCoinAmount": 50,
    "newBalance": 1080,
    "transactionHash": "0xeab468030a338",
    "confirmTime": 1759152243
  },
  "message": "Payment verification successful"
}
```

- **支付状态**: `pending` | `success` | "failed"
- **使用场景**: 
  - 支付后轮询查询支付结果
  - 建议轮询间隔：5-10秒

---

### 取消支付订单

- **URL**: `GET /recharge/cancel/{paymentId}`
- **描述**: 取消支付订单
- **认证**: 需要
- **路径参数**: 
  - `paymentId` (必需): 支付订单ID

- **响应**:
```json
{
  "success": true,
  "data": {
    "message": "Payment order cancelled"
  }
}
```

- **使用场景**: 用户取消未支付的订单

---

### 兑换码充值

- **URL**: `POST /recharge/exchange-code`
- **描述**: 使用兑换码进行充值
- **认证**: 需要
- **请求体**:
```json
{
  "exchangeCode": "EXCHANGE123456"
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "mCoinAmount": 100,
    "newBalance": 1100,
    "exchangeCode": "EXCHANGE123456"
  },
  "message": "Exchange code redeemed successfully"
}
```

- **使用场景**: 用户输入兑换码进行充值

---

### 获取充值历史

- **URL**: `GET /recharge/history`
- **描述**: 获取用户的充值历史记录
- **认证**: 需要
- **查询参数**: 
  - `page` (可选): 页码，默认为1
  - `limit` (可选): 每页数量，默认为20

- **响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "order_id",
      "orderId": "ORDER123",
      "packageName": "推荐套餐",
      "mCoins": 50.00,
      "amount": 48.02,
      "status": "completed",
      "createdAt": 1704067200,
      "completedAt": 1704067500
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "pages": 1
  }
}
```

- **使用场景**: 账户页面显示充值历史记录

---

## 账户页面 API

### 获取用户信息

- **URL**: `GET /auth/user`
- **描述**: 获取当前登录用户的详细信息
- **认证**: 需要

- **响应**:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "name": "User Name",
    "level": 2,
    "mCoins": 100.00,
    "avatarSeed": "Felix",
    "avatarStyle": "adventurer",
    "lastLoginAt": 1704067200,
    "createdAt": 1703980800
  }
}
```

- **使用场景**: 
  - 应用初始化时获取用户信息
  - 账户页面显示用户信息
  - 刷新用户信息时调用

---

### 更新用户头像

- **URL**: `PUT /auth/avatar`
- **描述**: 更新用户的头像信息
- **认证**: 需要
- **请求体**:
```json
{
  "avatarSeed": "Aneka",
  "avatarStyle": "adventurer"
}
```

- **响应**:
```json
{
  "success": true,
  "data": {
    "avatarSeed": "Aneka",
    "avatarStyle": "adventurer"
  },
  "message": "Avatar updated successfully"
}
```

- **使用场景**: 用户在账户页面选择新头像后保存

---

### 修改密码

- **URL**: `POST /auth/change-password`
- **描述**: 修改用户密码
- **认证**: 需要
- **请求体**:
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

- **响应**:
```json
{
  "success": true,
  "data": null,
  "message": "Password changed successfully"
}
```

- **使用场景**: 用户在账户页面修改密码
- **注意事项**: 修改密码成功后会自动退出登录

---

## 公告相关 API

### 获取公告列表

- **URL**: `GET /announcements/`
- **描述**: 获取系统公告列表（全局使用）
- **认证**: 可选

- **响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "announcement_id",
      "titleZh": "系统维护通知",
      "titleEn": "System Maintenance Notice",
      "messageZh": "系统将于今晚进行维护",
      "messageEn": "System will be under maintenance tonight",
      "uiType": "warning",
      "carouselDuration": 5000
    }
  ]
}
```

- **使用场景**: 
  - 应用启动时调用一次
  - 使用 sessionStorage 缓存
  - 全局组件（如 Header、DynamicAnnouncement）使用

- **UI类型**: `info` | `warning` | `success` | `error`

---

## 错误代码

| 错误代码 | 描述 |
|---------|------|
| `INVALID_TOKEN` | 无效的认证令牌 |
| `INSUFFICIENT_BALANCE` | 余额不足 |
| `DETECTION_LIMIT_EXCEEDED` | 检测数量超限 |
| `CHANNEL_UNAVAILABLE` | 检测通道不可用 |
| `INVALID_CARD_NUMBER` | 无效的卡号格式 |
| `PAYMENT_REQUIRED` | 需要支付 |
| `SYSTEM_MAINTENANCE` | 系统维护中 |
| `PERMISSION_DENIED` | 权限不足 |

---

## 注意事项

1. **认证要求**: 除登录、注册、公告接口外，其他接口都需要在请求头中携带 `Authorization: Bearer <token>`

2. **权限要求**: 
   - 信息生成页面需要用户等级 >= 2
   - BIN查询需要用户等级 >= 1
   - 其他功能根据用户等级有不同的访问权限

3. **轮询建议**: 
   - CVV检测进度：2-5秒间隔
   - 支付结果查询：5-10秒间隔
   - BIN分类结果：根据任务状态调整

4. **缓存机制**: 
   - 公告数据使用 sessionStorage 缓存
   - 用户信息使用 localStorage 缓存

5. **超时设置**: 
   - 默认超时时间：30秒（可在配置文件中修改）
   - 支付结果查询建议使用更长超时时间（10分钟）

---

## 快速导航

- [登录页面](#登录页面-api)
- [注册页面](#注册页面-api)
- [CVV检测](#cvv检测页面-api)
- [BIN分类](#bin分类页面-api)
- [BIN查询](#bin查询页面-api)
- [信息生成](#信息生成页面-api)
- [充值](#充值页面-api)
- [账户](#账户页面-api)
- [公告](#公告相关-api)

