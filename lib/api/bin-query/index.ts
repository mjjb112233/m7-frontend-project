import { useState, useCallback } from 'react'
import { authenticatedRequest } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants/api'

export interface BINQueryRequest {
  bin: string
}

export interface BINQueryResult {
  bin_length: number           // BIN长度
  number_length: number        // 卡号长度
  card_brand: string          // 卡品牌（VISA、MC等）
  type: string               // 卡类型（Credit/Debit）
  card_segment_type: string  // 卡段类型
  bank_name: string          // 银行名称
  country_alpha2: string     // 国家代码（2位）
  country_numeric: string    // 国家数字代码
  country_name: string       // 国家名称
  product_name: string       // 产品名称
  authentication_required: boolean  // 是否需要认证
  authentication_name: string       // 认证名称
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

// 查询BIN信息
export const queryBINInfo = async (bin: string, token: string): Promise<BINQueryResponse> => {

  const response = await authenticatedRequest(API_ENDPOINTS.BIN_QUERY.QUERY, token, {
    method: 'POST',
    body: JSON.stringify({ bin })
  })
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

  return {
    isLoading,
    error,
    queryBIN,
  }
}