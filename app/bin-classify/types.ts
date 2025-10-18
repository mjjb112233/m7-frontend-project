// BIN分类页面相关类型定义

export interface CardInfo {
  CardNumber: string
  CardBrand: string
  Type: string
  CountryName: string
  CardSegmentType: string
  IssuerCurrency: string
  BankName: string
  AuthRequired: boolean
  AuthenticationName: string
}

// API请求和响应类型
export interface BinClassifyRequest {
  cards: string[]
}

export interface BinClassifyQueryResponse {
  success: boolean
  data: {
    queryId: string
    status: 'processing' | 'completed' | 'failed'
  }
  message: string
}

export interface BinClassifyResultResponse {
  success: boolean
  data: {
    queryId: string
    status: 'processing' | 'completed' | 'failed'
    totalCount?: number
    processedCount?: number
    results?: CardInfo[]
  }
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
  selectedCategory: "country" | "bank" | "type" | "level" | "currency"
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
