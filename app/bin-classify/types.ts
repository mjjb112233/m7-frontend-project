// BIN分类页面相关类型定义

export interface CardInfo {
  cardNumber: string
  brand: string
  type: string
  level: string
  bank: string
  country: string
  currency: string
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
