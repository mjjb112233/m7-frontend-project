# M7后端系统API端点文档

## 基础信息
- **基础URL**: `http://localhost:8080`
- **认证方式**: JWT Bearer Token
- **响应格式**: JSON
- **字符编码**: UTF-8
- **时间格式**: 10位Unix时间戳（秒级精度，UTC时区）

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### 错误响应
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

### 分页响应
```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  },
  "message": "Data retrieved successfully"
}
```

## 认证相关 API

### 用户注册
- **URL**: `POST /auth/register`
- **描述**: 用户注册
- **请求体**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "level": 1,
      "mCoins": 50.00
    }
  },
  "message": "Registration successful"
}
```

### 用户登录
- **URL**: `POST /auth/login`
- **描述**: 用户登录
- **请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "token": "string",
    "expiresIn": 3600,
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "level": 1,
      "mCoins": 50.00
    }
  },
  "message": "Login successful"
}
```

### 获取用户信息
- **URL**: `GET /auth/user`
- **描述**: 获取当前用户信息
- **Headers**: `Authorization: Bearer <token>`
- **响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "name": "string",
    "level": 1,
    "mCoins": 50.00,
    "avatar": "string",
    "lastLoginAt": 1704067200
  }
}
```

## CVV检测相关 API

### 获取检测配置
- **URL**: `GET /cvv-check/config`
- **描述**: 获取CVV检测配置信息
- **Headers**: `Authorization: Bearer <token>`
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
            },
            {
              "id": 2,
              "name": "标准通道",
              "rate": "3.0",
              "speed": "normal",
              "description": "标准检测通道，平衡速度与准确率",
              "status": "online"
            }
          ]
        }
      },
      {
        "mode-id": 2,
        "name": "无c",
        "channels-data": {
          "description": "无c模式",
          "channels": [
            {
              "id": 1,
              "name": "高速通道",
              "rate": "2.5",
              "speed": "fast",
              "description": "高速检测通道，速度快",
              "status": "online"
            },
            {
              "id": 3,
              "name": "经济通道",
              "rate": "3.5",
              "speed": "slow",
              "description": "经济检测通道，成本低",
              "status": "online"
            }
          ]
        }
      },
      {
        "mode-id": 3,
        "name": "有c",
        "channels-data": {
          "description": "有c模式",
          "channels": [
            {
              "id": 2,
              "name": "标准通道",
              "rate": "3.0",
              "speed": "normal",
              "description": "标准检测通道，平衡速度与准确率",
              "status": "online"
            },
            {
              "id": 3,
              "name": "经济通道",
              "rate": "3.5",
              "speed": "slow",
              "description": "经济检测通道，成本低",
              "status": "online"
            }
          ]
        }
      }
    ]
  },
  "message": "Configuration retrieved successfully"
}
```

### 获取用户检测状态
- **URL**: `GET /cvv-check/user-status`
- **描述**: 获取用户当前检测状态
- **Headers**: `Authorization: Bearer <token>`
- **响应**:
```json
{
  "success": true,
  "data": {
    "status": "not_detected",
    "detectionId": "string"
  }
}
```

### 开始检测
- **URL**: `POST /cvv-check/start-detection`
- **描述**: 开始CVV检测
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "cardDataList": [
    "4246315290520780|6|2028|299|77098",
    "4833120094187128|6|2030|427|48504",
    "4130370201178110|8|2028|866|29205"
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

### 获取检测进度
- **URL**: `GET /cvv-check/detection-progress`
- **描述**: 获取检测进度信息
- **Headers**: `Authorization: Bearer <token>`
- **查询参数**: `detectionId` (必需)
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
      },
      {
        "cardNumber": "****8520",
        "startTime": 1759142397
      },
      {
        "cardNumber": "****9866",
        "startTime": 1759142450
      }
    ],
    "systemStatus": {
      "detectionService": "running",
      "channel": "active",
      "concurrentUsers": 25
    }
  },
  "message": "Detection progress retrieved successfully"
}
```

### 获取检测结果
- **URL**: `POST /cvv-check/detection-results`
- **描述**: 获取检测结果
- **Headers**: `Authorization: Bearer <token>`
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
    "validResults": [
      {
        "id": 1,
        "cardNumber": "4147202688856879",
        "cvv": "728",
        "expiry": "07/29",
        "other": "测试数据1",
        "detectionCompletedAt": 1704067200
      },
      {
        "id": 3,
        "cardNumber": "378282246310005",
        "cvv": "1234",
        "expiry": "08/26",
        "other": "Amex测试卡",
        "detectionCompletedAt": 1704067200
      }
    ],
    "invalidResults": [
      {
        "id": 2,
        "cardNumber": "5555555555554444",
        "cvv": "123",
        "expiry": "12/25",
        "other": null,
        "detectionCompletedAt": 1704067200
      },
      {
        "id": 5,
        "cardNumber": "4000000000000002",
        "cvv": "789",
        "expiry": "11/25",
        "other": "Visa测试卡",
        "detectionCompletedAt": 1704067200
      }
    ],
    "unknownResults": [
      {
        "id": 4,
        "cardNumber": "6011111111111117",
        "cvv": "456",
        "expiry": "05/27",
        "other": "Discover测试",
        "detectionCompletedAt": 1704067200
      }
    ],
    "validCount": 2,
    "invalidCount": 2,
    "unknownCount": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "consumedCoins": 15.5,
    "detectionStartTime": 1704067200,
    "detectionEndTime": 1704067500,
    "detectionDuration": "5分钟",
    "isCodeGenerated": false
  },
  "message": "Detection results retrieved successfully"
}
```

### 停止检测
- **URL**: `POST /cvv-check/stop-detection`
- **描述**: 停止当前检测
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "detectionId": "string"
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


### 获取CVV检测提取码生成价格
- **URL**: `POST /cvv-check/extract-code/generate/price`
- **描述**: 获取CVV检测提取码生成价格
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "detectionId": "det_1759143129946_5ybldwp4z"
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "price": 40
  },
  "message": "CVV detection extract code generation price retrieved successfully"
}
```

### 生成提取码
- **URL**: `POST /cvv-check/generate-extract-code`
- **描述**: 生成提取码
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "detectionId": "det_1759143129946_5ybldwp4z"
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "extractCode": "EX43177386",
    "verificationCode": "VCK08BKA",
    "price": 40,
    "validUntil": 1759575177,
    "paymentInfo": {
      "amount": 40,
      "currency": "M币",
      "paidAt": 1758970377,
      "wallet": "TQn9Y2khEsLJW1ChVWFMSVeRDtVetLHnbz"
    },
    "generatedTime": 1758970377,
    "isExtracted": false
  },
  "message": "Extract code generated successfully"
}
```



### 获取提取码信息
- **URL**: `GET /cvv-check/get-extract-code`
- **描述**: 获取已生成的提取码信息
- **Headers**: `Authorization: Bearer <token>`
- **查询参数**: `detectionId` (必需)
- **响应**:
```json
{
  "success": true,
  "data": {
    "extractCode": "EX44171312",
    "verificationCode": "VC1MR0J4",
    "price": 40,
    "validUntil": 1759576171,
    "paymentInfo": {
      "amount": 40,
      "currency": "M币",
      "paidAt": 1758971371,
      "wallet": "TQn9Y2khEsLJW1ChVWFMSVeRDtVetLHnbz"
    },
    "extractionStatus": false,
    "generatedTime": 1758971371,
    "isExtracted": true,
    "extractedTime": null,
    "extractedAccount": null,
    "extractedUsdtAmount": 0,
    "extractedUsdtWallet": null
  },
  "message": "Extract code information retrieved successfully"
}
```

### 重置检测状态
- **URL**: `GET /cvv-check/reset-detection-status`
- **描述**: 重置用户检测状态
- **Headers**: `Authorization: Bearer <token>`
- **响应**:
```json
{
  "success": true,
  "data": {
    "message": "Detection status reset successfully"
  }
}
```

## BIN分类相关 API

### 获取BIN分类配置
- **URL**: `GET /bin-classify/config`
- **描述**: 获取BIN分类配置
- **Headers**: `Authorization: Bearer <token>`
- **响应**:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "country",
        "name": "按国家分类"
      },
      {
        "id": "bank",
        "name": "按银行分类"
      }
    ]
  }
}
```

### 开始BIN分类
- **URL**: `POST /bin-classify/start`
- **描述**: 开始BIN分类
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "cardNumbers": ["1234567890123456", "9876543210987654"],
  "category": "country"
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "taskId": "string",
    "totalCost": 0.20
  },
  "message": "Classification task started"
}
```

### 获取BIN分类结果
- **URL**: `GET /bin-classify/results`
- **描述**: 获取BIN分类结果
- **Headers**: `Authorization: Bearer <token>`
- **查询参数**: `taskId` (必需)
- **响应**:
```json
{
  "success": true,
  "data": {
    "taskId": "string",
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

## 卡信息提取相关 API

### 使用提取码获取卡信息
- **URL**: `POST /extract-code`
- **描述**: 使用提取码获取卡信息
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "extractCode": "asdad"
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "cardNumber": "414720**********",
        "expiry": "07/29"
      },
      {
        "cardNumber": "5555555**********",
        "expiry": "12/25"
      }
    ],
    "count": 2,
    "detectTime": 1759145364,
    "dataSource": "CVV检测系统",
    "remarks": "通过提取码获取的卡信息",
    "status": "valid",
    "requiresPayment": false,
    "paymentAmount": 0
  },
  "message": "Card information extracted successfully"
}
```

### 验证提取码
- **URL**: `POST /extract-code/verify`
- **描述**: 验证提取码和验证码
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "extractCode": "asdad",
  "verificationCode": "asda"
}
```
- **成功响应**:
```json
{
  "success": true,
  "data": {
    "secret-key": "xxxxxxxxxxxxxxxxxxxxxxx"
  },
  "message": "Verification code verified successfully"
}
```
- **失败响应**:
```json
{
  "success": false,
  "data": {
    "errorCount": 2,
    "maxErrors": 6,
    "remainingAttempts": 4
  },
  "message": "Verification code error"
}
```

### 确认提取码并获取完整卡信息
- **URL**: `POST /extract-code/confirm`
- **描述**: 使用验证成功后的secret-key获取完整的卡信息
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "secret-key": "xxxxxxxxxxxxxxxxxxxxxxx"
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "cards": [
      {
        "cardNumber": "4111111111111111",
        "expiry": "12/25",
        "cvv": "123",
        "other": "名字，地址，邮编等"
      },
      {
        "cardNumber": "5555555555554444",
        "expiry": "06/26",
        "cvv": "456",
        "other": "名字，地址，邮编等"
      }
    ],
    "count": 2
  },
  "message": "Card information retrieved successfully"
}
```

### 提取码支付
- **URL**: `POST /extract-code/payment`
- **描述**: 使用secret-key进行提取码支付
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "secret-key": "xxxxxxxxxxxxxxxxxxxxxxx"
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "orderId": "ORDER_1759145364_ABC12345",
    "amount": 0.05,
    "walletAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "transactionHash": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
  },
  "message": "Payment order created successfully"
}
```

### 支付回调
- **URL**: `POST /extract-code/payment/callback`
- **描述**: 支付完成后的回调接口
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "orderId": "ORDER_1759145364_ABC12345",
  "transactionHash": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "amount": 0.05
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "paymentStatus": "success",
    "secret-key": "xxxxx123323"
  },
  "message": "Payment callback processed successfully"
}
```

### 获取提取历史
- **URL**: `GET /extract-code/history`
- **描述**: 获取提取历史记录
- **Headers**: `Authorization: Bearer <token>`
- **查询参数**: `page` (可选，默认值: 1), `pageSize` (可选，默认值: 10)
- **响应**:
```json
{
  "success": true,
  "data": {
    "histories": [
      {
        "id": "1",
        "extractCode": "EXT001",
        "extractTime": 1704067200,
        "cardCount": 3,
        "dataSource": "CVV检测系统",
        "status": "success",
        "paymentAmount": 0,
        "paymentStatus": "completed",
        "paymentWallet": "",
        "remarks": "成功提取卡信息"
      },
      {
        "id": "2",
        "extractCode": "EXT002",
        "extractTime": 1704154200,
        "cardCount": 5,
        "dataSource": "CVV检测系统",
        "status": "success",
        "paymentAmount": 0.05,
        "paymentStatus": "completed",
        "paymentWallet": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
        "remarks": "支付后成功提取"
      },
      {
        "id": "3",
        "extractCode": "EXT003",
        "extractTime": 1704240900,
        "cardCount": 2,
        "dataSource": "CVV检测系统",
        "status": "failed",
        "paymentAmount": 0,
        "paymentStatus": "pending",
        "paymentWallet": "",
        "remarks": "验证失败"
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "message": "Extract history retrieved successfully"
}
```








## 单独页面的生成提取码

## 单独页面提取码生成相关 API

### 获取提取码生成价格
- **URL**: `GET /extract-generate/price`
- **描述**: 获取提取码生成价格
- **Headers**: `Authorization: Bearer <token>`
- **响应**:
```json
{
  "success": true,
  "data": {
    "price": 40
  },
  "message": "Generation price retrieved successfully"
}
```

### 生成提取码
- **URL**: `POST /extract-generate/create`
- **描述**: 生成提取码
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "cardNumbers": ["4246315290520780|06|2028|299|77098", "4833120094187128|06|2030|427|48504"],
  "remarks": "",
  "validTime": 24,
  "requirePayment": true,
  "usdtAmount": 11,
  "usdtWallet": "222",
  "pricePerCode": 40
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "extractCode": "EXT54645089",
    "verificationCode": "VC646089",
    "validUntil": 1759241045,
    "remarks": "",
    "costMCoins": 40,
    "paymentInfo": {
      "usdtAmount": 11,
      "walletAddress": "222"
    }
  },
  "message": "Extract code generated successfully"
}
```

### 获取生成提取码记录
- **URL**: `GET /extract-generate/records`
- **描述**: 获取提取码生成记录列表
- **Headers**: `Authorization: Bearer <token>`
- **查询参数**:
  - `page` (可选): 页码，默认为1
  - `pageSize` (可选): 每页数量，默认为10
  - `status` (可选): 状态筛选
- **响应**:
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "EXT001",
        "code": "ABC123DEF456",
        "verificationCode": "VER789",
        "remarks": "测试提取",
        "createdAt": 1704067200,
        "status": "completed",
        "paymentRequired": true,
        "usdtAmount": 50,
        "walletAddress": "TRX7n...8kL2",
        "paymentStatus": "paid",
        "validUntil": 1706745600,
        "costMCoins": 50,
        "dataSource": "CVV检测",
        "extractCount": 2
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  },
  "message": "Extract records retrieved successfully"
}
```

























## 信息生成相关 API


### 获取信息生成价格
- **URL**: `GET /info-generate/price`
- **描述**: 获取信息生成价格
- **Headers**: `Authorization: Bearer <token>`
- **响应**:
```json
{
  "success": true,
  "data": {
    "price": 1.5
  },
  "message": "Generation price retrieved successfully"
}
```

### 生成信息
- **URL**: `POST /info-generate/generate`
- **描述**: 生成卡信息
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "cardNumbers": ["4246315290520780|06|2028|299|77098|222", "4833120094187128|06|2030|427|48504"],
  "pricePerCard": 1.5
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "successCount": 1,
    "failedCount": 1,
    "totalCost": 3,
    "successData": [
      {
        "cardNumber": "4246315290520780",
        "month": "06",
        "year": "2028",
        "fullName": "John Doe 1",
        "phone": "+1-555-001-8483",
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

### 获取信息生成结果
- **URL**: `GET /info-generate/results`
- **描述**: 获取信息生成结果
- **Headers**: `Authorization: Bearer <token>`
- **查询参数**: `taskId` (必需)
- **响应**:
```json
{
  "success": true,
  "data": {
    "taskId": "string",
    "status": "completed",
    "successCount": 2,
    "failedCount": 0,
    "totalCost": 0.20,
    "successData": [
      {
        "cardNumber": "1234567890123456",
        "name": "张三",
        "country": "中国",
        "state": "北京市",
        "city": "北京市",
        "street": "朝阳区建国路88号",
        "zipCode": "100000",
        "phone": "13800138000"
      }
    ],
    "failedCardNumbers": [],
    "generateTime": 1704067200
  }
}
```

## 充值相关 API


### 获取充值套餐
- **URL**: `GET /recharge/packages`
- **描述**: 获取充值套餐列表
- **Headers**: `Authorization: Bearer <token>`
- **响应**:
```json
{
  "success": true,
  "data": {
    "packages": [
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
      },
      {
        "id": "pkg_20",
        "name": "标准套餐",
        "mCoinAmount": 20,
        "usdtPrice": 19.6,
        "discount": 2,
        "originalPrice": 20,
        "description": "日常CVV检测的理想选择",
        "isPopular": false,
        "isRecommended": false,
        "isActive": true
      },
      {
        "id": "pkg_50",
        "name": "推荐套餐",
        "mCoinAmount": 50,
        "usdtPrice": 48.02,
        "discount": 4,
        "originalPrice": 50,
        "description": "性价比最高，专业用户首选",
        "isPopular": true,
        "isRecommended": true,
        "isActive": true
      },
      {
        "id": "pkg_100",
        "name": "专业套餐",
        "mCoinAmount": 100,
        "usdtPrice": 94.12,
        "discount": 6,
        "originalPrice": 100,
        "description": "专业用户的高效检测方案",
        "isPopular": false,
        "isRecommended": false,
        "isActive": true
      },
      {
        "id": "pkg_500",
        "name": "企业套餐",
        "mCoinAmount": 500,
        "usdtPrice": 460,
        "discount": 8,
        "originalPrice": 500,
        "description": "大批量检测的最佳方案",
        "isPopular": false,
        "isRecommended": false,
        "isActive": true
      },
      {
        "id": "pkg_1000",
        "name": "旗舰套餐",
        "mCoinAmount": 1000,
        "usdtPrice": 900,
        "discount": 10,
        "originalPrice": 1000,
        "description": "顶级用户的终极检测体验",
        "isPopular": false,
        "isRecommended": false,
        "isActive": true
      }
    ],
    "total": 6
  },
  "message": "Recharge packages retrieved successfully"
}
```



### 创建充值支付订单
- **URL**: `POST /recharge/payment`
- **描述**: 创建充值支付订单
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "packageId": "pkg_1000",
  "mCoinAmount": 1000,
  "usdtPrice": 900,
  "discount": 10
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "paymentId": "mock-payment-1759152000408",
    "usdtAmount": 900,
    "walletAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
    "transactionHash": "0x6a84ced279198",
    "paymentInstructions": [
      "请确保使用TRC20网络转账",
      "转账金额必须精确匹配 900 USDT",
      "支付完成后，M币将在10分钟内到账",
      "如有问题请联系客服"
    ],
    "validUntil": 1759153800,
    "packageInfo": {
      "packageId": "pkg_1000",
      "mCoinAmount": 1000,
      "usdtPrice": 900,
      "discount": 10
    }
  },
  "message": "Payment order created successfully"
}
```

### 充值支付回调
- **URL**: `POST /recharge/callback`
- **描述**: 充值支付完成后的回调接口
- **Headers**: `Authorization: Bearer <token>`
- **请求体**:
```json
{
  "paymentId": "mock-payment-1759152151205",
  "paymentStatus": "confirm",
  "transactionHash": "0x97cbc4f4534268",
  "usdtAmount": 19.6,
  "walletAddress": "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "callbackTime": 1759152152
}
```
- **成功响应**:
```json
{
  "success": true,
  "data": {
    "paymentId": "mock-payment-1759152242588",
    "paymentStatus": "success",
    "mCoinAmount": 20,
    "newBalance": 1080,
    "transactionHash": "0xeab468030a338",
    "confirmTime": 1759152243
  },
  "message": "Payment verification successful"
}
```
- **失败响应**:
```json
{
  "success": true,
  "data": {
    "paymentId": "mock-payment-1759152206819",
    "paymentStatus": "failed",
    "mCoinAmount": 0,
    "newBalance": 500,
    "transactionHash": "",
    "confirmTime": 1759152207
  },
  "message": "Payment verification failed"
}
```

### 获取充值历史
- **URL**: `GET /recharge/history`
- **描述**: 获取充值历史
- **Headers**: `Authorization: Bearer <token>`
- **查询参数**: `page`, `limit` (可选，默认值: page=1, limit=20)
- **响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "orderId": "string",
      "packageName": "新手套餐",
      "mCoins": 100.00,
      "amount": 10.00,
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

## 公告相关 API

### 获取公告列表
- **URL**: `GET /announcements`
- **描述**: 获取公告列表
- **Headers**: `Authorization: Bearer <token>` (可选)
- **查询参数**: `type`, `position` (可选，用于筛选公告类型和位置)
- **响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "type": "maintenance",
      "title": "System Maintenance Notice",
      "message": "System will be under maintenance tonight",
      "priority": 1,
      "position": "top",
      "carouselDuration": 5000,
      "createdAt": 1704067200
    }
  ]
}
```

## 实时通信

### HTTP轮询机制
系统使用HTTP轮询方式获取检测进度，前端定期调用进度查询接口：

- **进度查询**: `GET /cvv-check/detection-progress`
- **轮询间隔**: 建议2-5秒
- **超时处理**: 30秒无响应则停止轮询

### 轮询优化建议
1. **智能轮询**: 根据检测状态调整轮询频率
2. **缓存机制**: 避免重复请求相同数据
3. **错误处理**: 网络异常时自动重试
4. **资源管理**: 检测完成后停止轮询

## 错误代码

| 错误代码 | 描述 |
|---------|------|
| `INVALID_TOKEN` | 无效的认证令牌 |
| `INSUFFICIENT_BALANCE` | 余额不足 |
| `DETECTION_LIMIT_EXCEEDED` | 检测数量超限 |
| `CHANNEL_UNAVAILABLE` | 检测通道不可用 |
| `INVALID_CARD_NUMBER` | 无效的卡号格式 |
| `EXTRACT_CODE_EXPIRED` | 提取码已过期 |
| `PAYMENT_REQUIRED` | 需要支付 |
| `SYSTEM_MAINTENANCE` | 系统维护中 |

## 限流规则

- **认证接口**: 每分钟最多10次请求
- **检测接口**: 每分钟最多5次请求
- **其他接口**: 每分钟最多20次请求
- **轮询请求**: 每个用户最多10个并发请求
