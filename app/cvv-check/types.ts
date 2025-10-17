// CVV检测页面相关类型定义

export interface CVVResult {
  id: number
  cardNumber: string
  cvv: string
  expiry: string
  other: string | null
  detectionCompletedAt: string
}

export interface DetectionResult {
  cvv: string
  status: "valid" | "invalid" | "unknown"
  message: string
  timestamp: string
}

export interface Channel {
  id: number
  name: string
  rate: string
  speed: string
  description: string
  status: "online" | "offline" | "busy"
  consumption?: string
}

export interface DetectionMode {
  "mode-id": number
  name: string
  "channels-data": {
    description: string
    channels: Channel[]
  }
}

export interface DetectionConfig {
  detectionModes: DetectionMode[]
}

export interface DetectingCVV {
  cvv: string
  startTime: Date
  elapsedTime: number
}

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

export interface ConnectionStatus {
  backend: "connected" | "disconnected" | "connecting"
  frontend: "connected" | "disconnected"
  lastHeartbeat: Date | null
}

export type UserDetectionStatus = "not_detected" | "detecting" | "completed"

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


