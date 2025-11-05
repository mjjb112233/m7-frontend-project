// CVV检测页面相关类型定义

export interface CVVResult {
  id: number
  cardNumber: string
  cvv: string
  expiry: string
  other: string | null
  detectionCompletedAt: number // Unix秒级时间戳
}

export interface DetectionResult {
  cvv: string
  status: "valid" | "invalid" | "unknown"
  message: string
  timestamp: string
}

export interface Channel {
  id: number
  name_zh: string
  name_en: string
  rate: string
  speed: string  // 检测速度枚举值（用于业务逻辑）
  speed_zh: string  // 检测速度显示名称（中文）
  speed_en: string  // 检测速度显示名称（英文）
  description_zh: string
  description_en: string
  status: "idle" | "offline" | "busy"
  consumption?: string
}

export interface DetectionMode {
  "mode-id": number
  name_zh: string
  name_en: string
  "channels-data": {
    description_zh: string
    description_en: string
    channels: Channel[]
  }
}

export interface DetectionConfig {
  detectionModes: DetectionMode[]
}

export interface DetectionStatus {
  currentCVV: string
  processedCount: number
  totalCount: number
  validCount: number
  invalidCount: number
  unknownCount: number
  isRunning: boolean
}

// API响应：检测进度数据
export interface DetectionProgressResponse {
  status: "detecting" | "completed" | "stopped"
  total: number
  processed: number
  success: number
  failed: number
  validCount: number
  invalidCount: number
  unknownCount: number
  totalConsumed: number
  serviceStatus: string // 检测服务状态（固定为"在线"）
  channelStatus: string // 通道状态（"在线"/"拥挤"/"繁忙"）
  channelUserCount: number // 通道用户人数（200-10000）
  channelRate: number // 通道单卡消耗（任务创建时的快照）
  channelId: number // 通道ID（任务创建时的快照）
  channelSpeedZh?: string // 通道检测速度显示名称（中文，任务创建时的快照）
  channelSpeedEn?: string // 通道检测速度显示名称（英文，任务创建时的快照）
  channelDescriptionZh?: string // 通道介绍/描述（中文，任务创建时的快照）
  channelDescriptionEn?: string // 通道介绍/描述（英文，任务创建时的快照）
}

// API响应：检测结果数据
export interface DetectionResultsResponse {
  validResults: CVVResult[]
  invalidResults: CVVResult[]
  unknownResults: CVVResult[]
  validCount: number
  invalidCount: number
  unknownCount: number
  consumedCoins: number
  completedAt?: number // 检测完毕的时间（Unix时间戳秒级，可选）
  expiresAt?: number // 过期时间（Unix时间戳秒级，可选）
}

// API响应：取消状态数据
export interface CancelStatusResponse {
  status: "processing" | "completed"
}

export interface ConnectionStatus {
  backend: "connected" | "disconnected" | "connecting"
  frontend: "connected" | "disconnected"
  lastHeartbeat: Date | null
}

export type UserDetectionStatus = "idle" | "detecting" | "completed"

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

export interface DetectionResultData {
  totalCards: number
  processedCards: number
  validCards: number
  invalidCards: number
  successRate: number
  detectionTime: string
  consumedCoins: number
  remainingBalance: number

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

export type CVVStep = 
  | "config" 
  | "input" 
  | "precheck" 
  | "detecting" 
  | "detecting-prompt" 
  | "results" 
  | "completed-prompt" 
  | "completed"

export type DetectionModeType = "charge_test" | "no_cvv" | "with_cvv"

export type ErrorType = "insufficient_coins" | "service_down" | "server_error" | "other"

export type StatusAlertType = "info" | "warning" | "success"

export type NotificationType = "success" | "error" | "warning" | "info"


