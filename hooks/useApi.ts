/**
 * API相关Hook
 */

import { useState, useCallback } from 'react'
import { apiRequest } from '@/lib/api'
import { ApiResponse } from '@/types/common'

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useApi<T = any>(options?: UseApiOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(async (
    url: string, 
    requestOptions: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest<T>(url, requestOptions)
      
      if (response.success) {
        setData(response.data || null)
        options?.onSuccess?.(response.data)
      } else {
        setError(response.message || '请求失败')
        options?.onError?.(response.message || '请求失败')
      }
      
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络请求失败'
      setError(errorMessage)
      options?.onError?.(errorMessage)
      
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }, [options])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset
  }
}
