// 信息生成页面相关类型定义

export interface GeneratedInfo {
  cardNumber: string
  month: string
  year: string
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface GenerateResult {
  successCount: number
  failedCount: number
  totalCost: number
  successData: GeneratedInfo[]
  failedCardNumbers: string[]
  generateTime: string
}

export interface GenerateConfig {
  dataSource: string
  remarks: string
  autoGenerate: boolean
  paymentRequired: boolean
}

export interface GenerateState {
  inputText: string
  generatedInfo: GeneratedInfo[]
  generateResult: GenerateResult | null
  isGenerating: boolean
  generateProgress: number
  config: GenerateConfig
  showPaymentDialog: boolean
  paymentInfo: PaymentInfo | null
}

export interface PaymentInfo {
  amount: number
  currency: string
  wallet: string
  qrCode: string
  paidAt?: string
}
