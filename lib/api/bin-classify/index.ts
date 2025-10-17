import { useAuth } from "@/contexts/auth-context"
import { authenticatedRequest } from "@/lib/api"

export function useBinClassifyAPI() {
  const { token } = useAuth()
  
  // 获取BIN分类配置
  const fetchBinClassifyConfig = async () => {
    if (!token) return null
    
    try {
      const response = await authenticatedRequest('/bin-classify/config', token)
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to get BIN classification config:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting BIN classification config:', error)
      return null
    }
  }
  
  // 开始BIN分类
  const startBinClassify = async (requestData: any) => {
    if (!token) return null
    
    try {
      const response = await authenticatedRequest('/bin-classify/start', token, {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to start BIN classification:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error starting BIN classification:', error)
      return null
    }
  }
  
  // 获取BIN分类结果
  const fetchBinClassifyResults = async (taskId: string) => {
    if (!token || !taskId) return null
    
    try {
      const response = await authenticatedRequest(`/bin-classify/results?taskId=${taskId}`, token)
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to get BIN classification results:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting BIN classification results:', error)
      return null
    }
  }
  
  return {
    fetchBinClassifyConfig,
    startBinClassify,
    fetchBinClassifyResults,
  }
}
