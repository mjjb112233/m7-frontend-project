/**
 * 通用类型定义
 */

// 语言类型
export type Language = "zh" | "en"

// 用户等级
export const USER_LEVELS = {
  GUEST: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
} as const

export type UserLevel = typeof USER_LEVELS[keyof typeof USER_LEVELS]

// 公告位置
export type AnnouncementPosition = "top" | "hero" | "floating"

// 公告类型
export type AnnouncementType = "maintenance" | "promotion" | "update"

// 公告UI类型
export type AnnouncementUIType = "info" | "warning" | "success" | "error"

// 检测状态
export type DetectionStatus = "not_detected" | "detecting" | "completed"

// 系统状态
export type SystemStatus = "normal" | "abnormal" | "maintenance"

// 支付状态
export type PaymentStatus = "pending" | "paid" | "expired" | "cancelled"

// 提取码状态
export type ExtractCodeStatus = "unused" | "used" | "expired"

// 通用响应类型
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
