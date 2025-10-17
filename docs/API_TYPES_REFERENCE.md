# M7前端项目API类型参考文档

## 1. 通用类型定义

### 1.1 基础响应类型
```typescript
// 通用API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T | null
  message?: string
  error?: string
}

// 分页参数
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

// 分页响应
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  message?: string
}
```

### 1.2 用户相关类型
```typescript
// 用户信息
export interface User {
  id: string
  username: string
  email: string
  name: string
  level: number
  mCoins: number
  avatar?: string
  createdAt: string
  updatedAt: string
}

// 认证上下文类型
export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateMCoins: (amount: number) => void
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  expiresIn: number
  user: User
}

// 注册请求
export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}
```

## 2. CVV检测相关类型

### 2.1 核心检测类型
```typescript
// CVV检测结果
export interface CVVResult {
  id: number
  cardNumber: string
  cvv: string
  expiry: string
  other: string | null
  detectionCompletedAt: string
}

// 检测结果详情
export interface DetectionResult {
  cvv: string
  status: "valid" | "invalid" | "unknown"
  message: string
  timestamp: string
}

// 检测通道
export interface Channel {
  id: number
  name: string
  rate: string
  speed: string
  description: string
  status: "online" | "offline" | "busy"
  consumption?: string
}

// 检测进度数据
export interface DetectionProgressData {
  totalCards: number
  processedCards: number
  validCards: number
  invalidCards: number
  progress: number
  estimatedTimeRemaining: string
  currentChannel: {
    id: number
    name: string
    speed: string
  }
  detectionConfig: {
    mode: string
    autoStop: boolean
    validStopCount?: number
  }
  startTime: string
  logs: Array<{
    time: string
    message: string
    type: "info" | "success" | "warning" | "error"
  }>
}

// 检测结果数据
export interface DetectionResultData {
  totalCards: number
  processedCards: number
  validCards: number
  invalidCards: number
  successRate: number
  detectionTime: string
  consumedCoins: number
  remainingBalance: number
  isCodeGenerated: boolean
  detectionConfig: {
    mode: string
    channel: string
    autoStop: boolean
    validStopCount?: number
  }
  validCardsList: Array<{
    cardNumber: string
    expiryDate: string
    cvv: string
    bank: string
    cardType: string
    country: string
  }>
}
```

### 2.2 检测状态和步骤类型
```typescript
// CVV检测步骤
export type CVVStep = 
  | "config" 
  | "input" 
  | "precheck" 
  | "detecting" 
  | "detecting-prompt" 
  | "results" 
  | "completed-prompt" 
  | "completed"

// 检测模式
export type DetectionMode = "charge_test" | "no_cvv" | "with_cvv"

// 错误类型
export type ErrorType = "insufficient_coins" | "service_down" | "server_error" | "other"

// 用户检测状态
export type UserDetectionStatus = "not_detected" | "detecting" | "completed"

// 检测状态
export interface DetectionStatus {
  currentCVV: string
  processedCount: number
  totalCount: number
  validCount: number
  invalidCount: number
  unknownCount: number
  isRunning: boolean
  detectingCVVs: DetectingCVV[]
}

// 连接状态
export interface ConnectionStatus {
  backend: "connected" | "disconnected" | "connecting"
  frontend: "connected" | "disconnected"
  lastHeartbeat: Date | null
}
```

### 2.3 提取码相关类型
```typescript
// 提取码设置
export interface ExtractCodeSettings {
  validTime: string
  usdtAmount: string
  usdtWallet: string
  requirePayment: boolean
}

// 生成的提取码
export interface GeneratedCode {
  code: string
  validUntil: string
  verificationCode: string
}

// 提取码价格
export interface ExtractCodePrice {
  price: number
  detectionId: string
}
```

## 3. BIN分类相关类型

```typescript
// 卡片信息
export interface CardInfo {
  cardNumber: string
  brand: string
  type: string
  level: string
  bank: string
  country: string
  currency: string
}

// 分组结果
export interface GroupedResult {
  [key: string]: CardInfo[]
}

// 处理状态
export interface ProcessingStatus {
  isProcessing: boolean
  processedCount: number
  totalCount: number
  currentCard: string
  progress: number
}

// 分类结果
export interface ClassificationResult {
  groupedResults: GroupedResult
  totalCards: number
  categories: string[]
  processingTime: number
}

// BIN分类配置
export interface BinClassifyConfig {
  selectedCategory: "country" | "bank" | "type" | "level" | "currency"
  groupBy: string
  sortOrder: "asc" | "desc"
}
```

## 4. 卡信息提取相关类型

```typescript
// 卡片信息
export interface CardInfo {
  cardNumber: string    // 卡号（必需）
  expiry: string        // 有效期（必需）
  cvv: string          // CVV（必需）
  zip?: string         // 邮编（可选）
  holder?: string      // 持卡人姓名（可选）
  country?: string     // 国家（可选）
  province?: string    // 省/州（可选）
  city?: string        // 城市（可选）
  street?: string      // 街道（可选）
  phone?: string       // 电话（可选）
}

// 提取结果
export interface ExtractResult {
  cards: CardInfo[]
  count: number
  detectTime: string
  dataSource: string
  remarks?: string
  sourceType: "cvv-detection" | "user-generated"
  requiresPayment: boolean
  paymentAmount?: number
  paymentWallet?: string
}

// 提取历史
export interface ExtractHistory {
  id: string
  extractCode: string
  extractTime: string
  cardCount: number
  dataSource: string
  status: "success" | "failed" | "payment_required"
  paymentAmount?: number
  paymentStatus?: "pending" | "completed" | "failed"
  paymentWallet?: string
  remarks?: string
}

// 支付订单
export interface PaymentOrder {
  orderId: string
  amount: number
  walletAddress: string
  transactionHash?: string
  paymentInstructions?: string[]
}
```

## 5. 信息生成相关类型

```typescript
// 生成的信息
export interface GeneratedInfo {
  cardNumber: string
  name: string
  country: string
  state: string
  city: string
  street: string
  zipCode: string
  phone: string
}

// 生成结果
export interface GenerateResult {
  successCount: number
  failedCount: number
  totalCost: number
  successData: GeneratedInfo[]
  failedCardNumbers: string[]
  generateTime: string
}

// 生成配置
export interface GenerateConfig {
  dataSource: string
  remarks: string
  autoGenerate: boolean
  paymentRequired: boolean
}

// 支付信息
export interface PaymentInfo {
  amount: number
  currency: string
  wallet: string
  qrCode: string
  paidAt?: string
}
```

## 6. 充值相关类型

```typescript
// 充值套餐
export interface RechargePackage {
  id: string
  name: string
  mCoinAmount: number
  usdtPrice: number
  discount: number
  originalPrice: number
  description: string
  isPopular: boolean
  isRecommended: boolean
  isActive: boolean
}

// 充值订单
export interface RechargeOrder {
  orderId: string
  packageId: string
  amount: number
  mCoins: number
  paymentMethod: string
  status: "pending" | "completed" | "failed"
  createdAt: string
  completedAt?: string
}

// 充值历史
export interface RechargeHistory {
  id: string
  orderId: string
  packageName: string
  mCoins: number
  amount: number
  status: "pending" | "completed" | "failed"
  createdAt: string
  completedAt?: string
}
```

## 7. 公告相关类型

```typescript
// 公告
export interface Announcement {
  id: string
  type: "maintenance" | "promotion" | "update"
  title: string
  message: string
  priority: number
  position?: "top" | "hero" | "floating"
  carouselDuration: number
  createdAt: string
  updatedAt: string
}

// 公告响应
export interface AnnouncementResponse {
  success: boolean
  data: Announcement[]
  message?: string
}
```

## 8. 系统相关类型

```typescript
// 系统状态
export interface SystemStatus {
  status: "normal" | "maintenance" | "error"
  message?: string
  maintenanceStart?: string
  maintenanceEnd?: string
  services: {
    api: boolean
    websocket: boolean
    database: boolean
    payment: boolean
  }
}

// 系统配置
export interface SystemConfig {
  maxCardsPerBatch: number
  maxConcurrentDetections: number
  defaultChannel: string
  supportedCurrencies: string[]
  maintenanceMode: boolean
  newUserBonus: number
}

// 错误信息
export interface ErrorInfo {
  code: string
  message: string
  details?: any
  timestamp: string
  requestId?: string
}
```

## 9. 前端Hook类型

```typescript
// CVV检测Hook返回类型
export interface CVVDetectionHook {
  // 状态
  currentStep: CVVStep
  userDetectionStatus: UserDetectionStatus
  detectionProgressData: DetectionProgressData | null
  detectionResultData: DetectionResultData | null
  isLoadingStatus: boolean
  isLoadingProgress: boolean
  isLoadingResult: boolean
  
  // 方法
  fetchUserDetectionStatus: () => Promise<any>
  fetchDetectionConfig: () => Promise<any>
  fetchDetectionProgress: (detectionId?: string) => Promise<any>
  fetchDetectionResults: (detectionId: string) => Promise<any>
  stopDetection: (detectionId: string) => Promise<any>
  startDetection: (requestData: any) => Promise<any>
}

// BIN分类Hook返回类型
export interface BinClassifyHook {
  // 状态
  cardInput: string
  selectedCategory: string
  groupedResults: GroupedResult
  isProcessing: boolean
  processingStatus: ProcessingStatus
  classificationResult: ClassificationResult | null
  
  // 方法
  processCards: (cards: string[]) => Promise<void>
  toggleGroup: (groupKey: string) => void
  collapseAll: () => void
  resetState: () => void
}
```

---

*本文档提供了M7前端项目中所有主要的数据类型定义，用于TypeScript类型检查和开发参考。*