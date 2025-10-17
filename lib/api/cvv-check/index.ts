import { useAuth } from "@/contexts/auth-context"
import { authenticatedRequest } from "@/lib/api"
import { 
  UserDetectionStatus, 
  DetectionStatus, 
  DetectionProgressData,
  DetectionResultData,
  Channel,
  DetectionMode,
  ErrorType
} from "@/app/cvv-check/types"

export function useCVVCheckAPI() {
  const { token } = useAuth()
  
  // 获取用户检测状态
  const fetchUserDetectionStatus = async () => {
    if (!token) return null
    
    console.log("[CVV-API] fetchUserDetectionStatus 被调用")
    try {
      const response = await authenticatedRequest('/cvv-check/user-status', token)
      
      if (response.success) {
        const userData = response.data as { 
          status: string, 
          detectionId?: string | null
        }
        const status = userData.status as UserDetectionStatus
        if (status === "not_detected" || status === "detecting" || status === "completed") {
          return {
            status,
            detectionId: userData.detectionId
          }
        } else {
          return { status: "not_detected" as UserDetectionStatus }
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
      const response = await authenticatedRequest('/cvv-check/detection-results', token, {
        method: 'POST',
        body: JSON.stringify({
          detectionId: localDetectionUuid
        })
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
        return null
      }
    } catch (error) {
      console.error("[CVV-API] Error sending detection config:", error)
      return null
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
  
  return {
    fetchUserDetectionStatus,
    fetchDetectionConfig,
    fetchDetectionProgress,
    fetchDetectionResults,
    stopDetection,
    startDetection,
    resetDetectionStatus,
  }
}
