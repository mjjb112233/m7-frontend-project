import { useAuth } from "@/contexts/auth-context"
import { authenticatedRequest } from "@/lib/api"
import { 
  UserDetectionStatus, 
  DetectionStatus, 
  DetectionProgressData,
  DetectionResultData,
  Channel,
  DetectionMode,
  ErrorType,
  DetectionProgressResponse,
  DetectionResultsResponse,
  CancelStatusResponse
} from "@/app/cvv-check/types"

export function useCVVCheckAPI() {
  const { token } = useAuth()
  
  // 获取用户检测状态
  const fetchUserDetectionStatus = async () => {
    if (!token) return null
    
    console.log("[CVV-API] fetchUserDetectionStatus 被调用")
    try {
      const response = await authenticatedRequest('/cvv-check/detection-status', token)
      
      if (response.success) {
        const userData = response.data as { 
          status: string, 
          detectionId?: string | null
        }
        const status = userData.status as UserDetectionStatus
        if (status === "idle" || status === "detecting" || status === "completed") {
          return {
            status,
            detectionId: userData.detectionId
          }
        } else {
          return { status: "idle" as UserDetectionStatus }
        }
      } else {
        console.error('Failed to get user detection status:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting user detection status:', error)
      return null
    }
  }
  
  // 获取检测配置
  const fetchDetectionConfig = async () => {
    if (!token) return null
    
    console.log("[CVV-API] fetchDetectionConfig 被调用")
    try {
      console.log('[CVV-API] Starting to get detection config...')
      const response = await authenticatedRequest('/cvv-check/config', token)
      
      console.log('[CVV-API] Config API response data:', response)
      
      if (response.success) {
        console.log('[CVV-API] Setting detection config:', response.data)
        return response.data
      } else {
        console.error('Failed to get detection config:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting detection config:', error)
      return null
    }
  }
  
  // 获取检测进度
  const fetchDetectionProgress = async (localDetectionUuid?: string) => {
    if (!token) return null
    
    try {
      const url = localDetectionUuid 
        ? `/cvv-check/detection-progress?detectionId=${localDetectionUuid}`
        : '/cvv-check/detection-progress'
      
      const response = await authenticatedRequest(url, token, {
        method: 'GET'
      })
      
      const data = response
      
      if (data.success) {
        return data.data
      } else {
        console.error('Failed to get detection progress:', data.message)
        return null
      }
    } catch (error) {
      console.error('Error getting detection progress:', error)
      return null
    }
  }
  
  // 获取检测结果
  const fetchDetectionResults = async (localDetectionUuid: string) => {
    if (!token || !localDetectionUuid) return null
    
    try {
      const response = await authenticatedRequest(`/cvv-check/detection-results?detectionId=${localDetectionUuid}`, token, {
        method: 'POST'
      })
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to get detection results:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting detection results:', error)
      return null
    }
  }
  
  // 停止检测
  const stopDetection = async (localDetectionUuid: string) => {
    if (!token || !localDetectionUuid) return null
    
    try {
      const response = await authenticatedRequest('/cvv-check/stop-detection', token, {
        method: 'POST',
        body: JSON.stringify({
          detectionId: localDetectionUuid
        })
      })
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to stop detection:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error stopping detection:', error)
      return null
    }
  }
  
  // 启动检测
  const startDetection = async (requestData: any) => {
    if (!token) return null
    
    try {
      console.log("[CVV-API] 发送检测启动请求，数据:", requestData)
      
      const response = await authenticatedRequest("/cvv-check/start-detection", token, {
        method: "POST",
        body: JSON.stringify(requestData),
      })
      
      if (response.success) {
        return response.data
      } else {
        console.error("[CVV-API] Detection start failed:", response)
        // 返回错误信息对象，便于前端处理
        return {
          success: false,
          message: response.message || "检测启动失败",
          error: response.error
        }
      }
    } catch (error) {
      console.error("[CVV-API] Error sending detection config:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "检测启动失败，请稍后重试",
        error: "NETWORK_ERROR"
      }
    }
  }
  
  // 重置检测状态
  const resetDetectionStatus = async () => {
    if (!token) return null
    
    try {
      console.log('[CVV-API] Starting to reset detection status...')
      const response = await authenticatedRequest('/cvv-check/reset-detection-status', token, {
        method: 'GET'
      })
      
      console.log('[CVV-API] Reset detection status response:', response)
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to reset detection status:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error resetting detection status:', error)
      return null
    }
  }
  
  // 获取取消状态（用于查询已取消任务的停止状态）
  const fetchCancelStatus = async (localDetectionUuid: string) => {
    if (!token || !localDetectionUuid) return null
    
    try {
      const response = await authenticatedRequest(`/cvv-check/cancel-status?detectionId=${localDetectionUuid}`, token, {
        method: 'GET'
      })
      
      if (response.success) {
        return response.data as { status: "processing" | "completed" }
      } else {
        console.error('Failed to get cancel status:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting cancel status:', error)
      return null
    }
  }
  
  return {
    fetchUserDetectionStatus,
    fetchDetectionConfig,
    fetchDetectionProgress,
    fetchDetectionResults,
    stopDetection,
    startDetection,
    resetDetectionStatus,
    fetchCancelStatus,
  }
}
