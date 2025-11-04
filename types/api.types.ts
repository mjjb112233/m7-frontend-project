/**
 * API相关类型定义
 */

// 通用API响应接口
export interface ApiResponse<T = any> {
  success: boolean
  data?: T | null
  message: string
  error?: string
}

// 请求配置接口
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

// 分页参数
export interface PaginationParams {
  page?: number
  limit?: number
  pageSize?: number
  offset?: number
}

// 分页响应
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit?: number
  pageSize?: number
  totalPages?: number
  message?: string
}

