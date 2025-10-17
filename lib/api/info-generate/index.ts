import { useAuth } from "@/contexts/auth-context"
import { authenticatedRequest } from "@/lib/api"

export function useInfoGenerateAPI() {
  const { token } = useAuth()
  
  // 获取信息生成配置
  const fetchInfoGenerateConfig = async () => {
    if (!token) return null
    
    try {
      const response = await authenticatedRequest('/info-generate/config', token)
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to get info generate config:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting info generate config:', error)
      return null
    }
  }
  
  // 开始信息生成
  const startInfoGenerate = async (requestData: any) => {
    if (!token) return null
    
    try {
      const response = await authenticatedRequest('/info-generate/start', token, {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to start info generate:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error starting info generate:', error)
      return null
    }
  }
  
  // 获取信息生成结果
  const fetchInfoGenerateResults = async (taskId: string) => {
    if (!token || !taskId) return null
    
    try {
      const response = await authenticatedRequest(`/info-generate/results?taskId=${taskId}`, token)
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to get info generate results:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting info generate results:', error)
      return null
    }
  }
  
  return {
    fetchInfoGenerateConfig,
    startInfoGenerate,
    fetchInfoGenerateResults,
  }
}
