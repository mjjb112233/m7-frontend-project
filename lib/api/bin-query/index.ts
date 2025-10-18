import { useState, useCallback } from 'react'
import { authenticatedRequest } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants/api'

export interface BINQueryRequest {
  bin: string
}

export interface BINQueryResult {
  bin_length: number           // BIN长度
  pan_or_token: string        // PAN或Token类型
  card_brand: string          // 卡品牌（VISA、MC等）
  type: string               // 卡类型（Credit/Debit）
  funding_source: string     // 资金来源
  prepaid: boolean           // 是否预付费卡
  card_segment_type: string  // 卡段类型
  number_length: number      // 卡号长度
  bank_name: string          // 银行名称
  bank_clean_name: string    // 银行清洁名称
  issuer_currency: string    // 发行货币
  country_alpha2: string     // 国家代码（2位）
  country_name: string       // 国家名称
  auth_required: boolean     // 是否需要认证
  authentication_name: string // 认证名称
  product_name: string       // 产品名称
  domestic_only: boolean     // 是否仅限国内使用
  gambling_blocked: boolean  // 是否阻止赌博
  reloadable: boolean        // 是否可重载
  account_updater: boolean   // 账户更新器支持
  level2: boolean           // Level2功能
  level3: boolean           // Level3功能
  alm: boolean              // ALM功能
  shared_bin: boolean       // 是否为共享BIN
}

// 为了向后兼容，保留DetailedBINQueryResult作为BINQueryResult的别名
export type DetailedBINQueryResult = BINQueryResult

export interface BINQueryResponse {
  success: boolean
  data?: BINQueryResult
  message?: string
}

export interface DetailedBINQueryResponse {
  success: boolean
  data?: DetailedBINQueryResult
  message?: string
}

export interface BINHistoryRecord {
  id: string
  bin: string
  result?: BINQueryResult
  status: 'success' | 'failed' | 'notFound'
  queryTime: string
}

export interface BINHistoryResponse {
  success: boolean
  data?: {
    records: BINHistoryRecord[]
    total: number
    page: number
    pageSize: number
  }
  message?: string
}

// 查询BIN信息
export const queryBINInfo = async (bin: string, token: string): Promise<BINQueryResponse> => {
  // TODO(stagewise): 替换为真实的BIN查询API调用
  const response = await authenticatedRequest(API_ENDPOINTS.BIN_QUERY.QUERY, token, {
    method: 'POST',
    body: JSON.stringify({ bin })
  })
  return response
}

// 获取查询历史
export const getBINHistory = async (page: number = 1, pageSize: number = 10, token: string): Promise<BINHistoryResponse> => {
  // TODO(stagewise): 替换为真实的历史查询API调用
  const response = await authenticatedRequest(`${API_ENDPOINTS.BIN_QUERY.HISTORY}?page=${page}&pageSize=${pageSize}`, token)
  return response
}

// BIN查询Hook
export const useBINQuery = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queryBIN = useCallback(async (bin: string, token: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await queryBINInfo(bin, token)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '查询失败'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getHistory = useCallback(async (page: number, pageSize: number, token: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await getBINHistory(page, pageSize, token)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取历史记录失败'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    error,
    queryBIN,
    getHistory,
  }
}