// BIN分类页面相关类型定义

export interface CardInfo {
  cardNumber: string
  binLength: number
  numberLength: number
  cardBrand: string
  type: string
  cardSegmentType: string
  bankName: string
  countryAlpha2: string
  countryNumeric: string
  countryName: string
  productName: string
  createdAt: string
}

// API请求和响应类型
export interface BinClassifyRequest {
  cards: string[]
}

export interface BinClassifyQueryResponse {
  success: boolean
  data: {
    queryId: string
    status: 'processing'
  }
  message: string
}

export interface BinClassifyResultResponse {
  success: boolean
  data: {
    queryId: string
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    totalCount: number
    processedCount?: number
    pendingCount?: number
    failedCount?: number
    results?: CardInfo[]
    failedResults?: {
      cardNumber: string
      error: string
    }[]
    createdAt: string
    updatedAt: string
  }
  message: string
}

export interface BinClassifyCancelResponse {
  success: boolean
  data: {
    queryId: string
    status: 'cancelled'
  } | null
  message: string
}

export interface GroupedResult {
  [key: string]: CardInfo[]
}

export interface ProcessingStatus {
  isProcessing: boolean
  processedCount: number
  totalCount: number
  currentCard: string
  progress: number
}

export interface ClassificationResult {
  groupedResults: GroupedResult
  totalCards: number
  categories: string[]
  processingTime: number
}

export interface BinClassifyConfig {
  selectedCategory: "country" | "bank" | "type" | "level" | "brand" | "product"
  groupBy: string
  sortOrder: "asc" | "desc"
}

export interface BinClassifyState {
  cardInput: string
  selectedCategory: string
  groupedResults: GroupedResult
  expandedGroups: Set<string>
  isProcessing: boolean
  processingStatus: ProcessingStatus
  classificationResult: ClassificationResult | null
  config: BinClassifyConfig
}
