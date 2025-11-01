import { useAuth } from "@/contexts/auth-context"
import { authenticatedRequest } from "@/lib/api/request"
import { API_ENDPOINTS } from "@/constants/api"
import { BinClassifyRequest, BinClassifyQueryResponse, BinClassifyResultResponse, BinClassifyCancelResponse } from "@/app/bin-classify/types"

export function useBinClassifyAPI() {
  const { token } = useAuth()
  
  // 1. 开始BIN分类查询
  const startBinClassifyQuery = async (cards: string[]): Promise<BinClassifyQueryResponse | null> => {
    if (!token) return null
    
    try {
      const requestData: BinClassifyRequest = {
        cards
      }
      
      const response = await authenticatedRequest<BinClassifyQueryResponse>(API_ENDPOINTS.BIN_CLASSIFY.QUERY, token, {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      
      if (response.success) {
        return response
      } else {
        console.error('Failed to start BIN classification query:', response.message)
        return response
      }
    } catch (error) {
      console.error('Error starting BIN classification query:', error)
      return {
        success: false,
        data: { queryId: '', status: 'failed' },
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // 2. 获取BIN分类查询结果
  const getBinClassifyResults = async (queryId: string): Promise<BinClassifyResultResponse | null> => {
    if (!token || !queryId) return null
    
    try {
      const response = await authenticatedRequest<BinClassifyResultResponse>(`${API_ENDPOINTS.BIN_CLASSIFY.RESULTS}/${queryId}`, token)
      
      if (response.success) {
        return response
      } else {
        console.error('Failed to get BIN classification results:', response.message)
        return response
      }
    } catch (error) {
      console.error('Error getting BIN classification results:', error)
      return {
        success: false,
        data: { queryId, status: 'failed' },
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  // 3. 取消BIN分类查询
  const cancelBinClassifyQuery = async (queryId: string): Promise<BinClassifyCancelResponse | null> => {
    if (!token || !queryId) return null
    
    try {
      const response = await authenticatedRequest<BinClassifyCancelResponse>(`${API_ENDPOINTS.BIN_CLASSIFY.CANCEL}/${queryId}`, token, {
        method: 'POST'
      })
      
      if (response.success) {
        return response
      } else {
        console.error('Failed to cancel BIN classification query:', response.message)
        return response
      }
    } catch (error) {
      console.error('Error cancelling BIN classification query:', error)
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
  
  return {
    startBinClassifyQuery,
    getBinClassifyResults,
    cancelBinClassifyQuery,
  }
}
