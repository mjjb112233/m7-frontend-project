/**
 * API相关类型定义
 */

// 公告类型
export interface Announcement {
  id: string
  type: 'maintenance' | 'promotion' | 'update'
  title: string
  message: string
  priority: number
  carouselDuration: number
  position?: 'top' | 'hero' | 'floating'
}

// 用户信息类型
export interface User {
  id: string
  username: string
  email: string
  level: number
  mCoins: number
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 认证相关类型
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresIn: number
  user: User
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

// CVV检测相关类型
export interface CVVDetectionRequest {
  cvvs: string[]
  autoStopCount: number
  channelId: string
  modeId: string
}

export interface CVVDetectionResponse {
  success: boolean
  data?: {
    detectionId: string
    totalCost: number
  }
  message?: string
}

// BIN分类相关类型
export interface BINClassifyRequest {
  cardNumbers: string[]
  category: string
}

export interface BINClassifyResponse {
  success: boolean
  data?: {
    results: Array<{
      cardNumber: string
      brand: string
      type: string
      level: string
      bank: string
      country: string
      currency: string
    }>
  }
  message?: string
}

// 卡信息提取相关类型
export interface CardInfo {
  cardNumber: string
  expiry: string
  cvv: string
  other?: {
    zip?: string
    holder?: string
    country?: string
    province?: string
    city?: string
    street?: string
    phone?: string
  }
}

export interface ExtractCodeRequest {
  extractCode: string
  verificationCode: string
}

export interface ExtractCodeResponse {
  success: boolean
  data?: {
    extractCode: string
    cardInfo: CardInfo[]
    totalCards: number
    extractTime: string
    dataSource: string
    isPaymentRequired: boolean
    amount: number
    status: string
    remarks: string
  }
  message?: string
}

// 充值相关类型
export interface RechargePackage {
  id: string
  mCoins: number
  usdtPrice: number
  discount: number
  originalPrice: number
}

export interface RechargePackagesResponse {
  success: boolean
  data?: RechargePackage[]
  message?: string
}

// 信息生成相关类型
export interface InfoGenerateRequest {
  cardNumbers: string[]
}

export interface InfoGenerateResponse {
  success: boolean
  data?: {
    successData: Array<{
      cardNumber: string
      generatedInfo: {
        name: string
        address: string
        phone: string
        email: string
      }
    }>
    failedCardNumbers: string[]
    totalCost: number
  }
  message?: string
}
