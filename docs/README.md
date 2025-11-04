# M7 前端项目文档

## 项目概述

M7前端是一个基于Next.js 14开发的金融科技平台前端应用，提供银行卡检测、BIN分类、CVV验证等核心功能。

## 技术栈

- **框架**: Next.js 14.2.16
- **语言**: TypeScript 5
- **UI库**: React 18, Radix UI
- **样式**: Tailwind CSS
- **状态管理**: React Context API
- **HTTP客户端**: Fetch API

## 项目结构

```
m7-frontend/
├── app/                    # Next.js应用目录
│   ├── (auth)/            # 认证页面组
│   ├── (features)/         # 功能页面组（需要认证）
│   ├── (marketing)/        # 营销页面组（公开）
│   ├── layout.tsx          # 根布局
│   └── globals.css         # 全局样式
├── components/             # 组件目录
│   ├── ui/                 # 基础UI组件
│   ├── layout/             # 布局组件
│   ├── business/            # 业务组件
│   └── shared/             # 共享组件
│       └── toast/          # Toast组件
├── lib/                    # 核心库
│   ├── api/                # API客户端
│   │   ├── request.ts      # 请求工具
│   │   └── [feature]/      # 各功能API
│   ├── config/             # 配置管理（逻辑层）
│   │   ├── index.ts         # 配置管理器
│   │   ├── types.ts         # 配置类型
│   │   └── loader.ts        # 配置加载器
│   ├── utils/              # 工具函数
│   └── hooks/              # 共享Hooks
├── types/                  # 统一类型定义
│   ├── api.types.ts        # API类型
│   ├── auth.types.ts       # 认证类型
│   ├── common.types.ts     # 通用类型
│   └── index.ts            # 类型导出
├── constants/              # 常量定义
│   ├── api.ts              # API端点
│   ├── routes.ts           # 路由常量
│   └── config.ts           # 配置常量
├── contexts/               # React Contexts
│   ├── auth-context.tsx    # 认证上下文
│   └── language-context.tsx # 语言上下文
├── config/                 # 配置文件目录（数据层）
│   └── app.config.json     # 统一配置文件
└── docs/                   # 项目文档
    ├── backend/            # 后端文档
    └── api/                 # API文档
```

## 配置系统

### 配置文件结构

项目使用统一的配置管理系统：

- **config/app.config.json** (数据层): 存储所有配置数据
- **lib/config/** (逻辑层): 提供配置读取和类型安全访问

### 配置访问

```typescript
import { getApiBaseUrl, getApiConfig, getAppConfig } from '@/lib/config/index'

// 获取API基础URL
const apiUrl = getApiBaseUrl()

// 获取完整API配置
const apiConfig = getApiConfig()

// 获取应用配置
const appConfig = getAppConfig()
```

### 环境变量支持

配置系统支持通过环境变量覆盖默认配置：
- `NEXT_PUBLIC_API_BASE_URL`: API基础URL
- `NEXT_PUBLIC_API_TIMEOUT`: API超时时间
- `NEXT_PUBLIC_DEBUG_MODE`: 调试模式
- `NEXT_PUBLIC_USE_MOCK_DATA`: 使用模拟数据

## 类型系统

项目使用统一的类型定义系统：

```typescript
// 从统一入口导入类型
import type { ApiResponse, User, PaginationParams } from '@/types'

// 或从具体模块导入
import type { ApiResponse } from '@/types/api.types'
import type { User } from '@/types/auth.types'
```

## API客户端

### 使用示例

```typescript
import { apiRequest, authenticatedRequest } from '@/lib/api'

// 不带鉴权的请求
const response = await apiRequest('/endpoint')

// 带鉴权的请求
const response = await authenticatedRequest('/endpoint', token, {
  method: 'POST',
  body: data
})
```

### API端点常量

```typescript
import { API_ENDPOINTS } from '@/constants/api'

// 使用端点常量
const endpoint = API_ENDPOINTS.CVV_CHECK.START_DETECTION
```

## 开发指南

### 启动开发服务器

```bash
npm run dev
```

项目将在 http://localhost:3000 运行

### 构建生产版本

```bash
npm run build
npm run start
```

### 代码规范

- 使用TypeScript严格模式
- 遵循React Hooks最佳实践
- 使用Tailwind CSS进行样式开发
- 组件使用函数式组件和Hooks

## 功能模块

### CVV检测
- 路径: `app/cvv-check`
- 功能: 实时CVV检测、进度跟踪、结果管理

### BIN分类
- 路径: `app/bin-classify`
- 功能: 银行卡BIN信息查询和分类

### BIN查询
- 路径: `app/bin-query`
- 功能: 单卡BIN信息查询

### 信息生成
- 路径: `app/info-generate`
- 功能: 持卡人信息生成

### 充值
- 路径: `app/recharge`
- 功能: 充值套餐管理和支付

## 注意事项

1. **配置文件**: 统一使用 `config/app.config.json`，不要创建其他配置文件
2. **类型定义**: 使用统一的 `types/` 目录，避免分散定义
3. **组件复用**: 共享组件放在 `components/shared/` 目录
4. **API调用**: 统一使用 `lib/api/request.ts` 中的请求方法

