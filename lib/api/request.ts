/**
 * 公共请求接口
 * 提供带鉴权和不带鉴权的请求方法
 */

import type { ApiResponse, RequestConfig, MaintenanceResponse, MaintenanceData } from '@/types/api.types'

import { getApiBaseUrl, getApiConfig } from '@/lib/config/index'
import { maintenanceManager } from '@/lib/maintenance-manager'

/**
 * 不带鉴权的请求方法
 */
export async function apiRequest<T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  try {
    const { method = 'GET', headers = {}, body } = config
    const apiConfig = getApiConfig()
    
    const url = endpoint.startsWith('http') ? endpoint : `${getApiBaseUrl()}${endpoint}`
    
    console.log(`[API] 请求: ${method} ${url}`)
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body && method !== 'GET') {
      requestConfig.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    // 添加超时处理，优先使用自定义超时时间
    const controller = new AbortController()
    const timeoutMs = config.timeout || apiConfig.timeout
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    
    requestConfig.signal = controller.signal

    const response = await fetch(url, requestConfig)
    clearTimeout(timeoutId)

    // 检查维护状态码（503）
    if (response.status === 503) {
      let data: MaintenanceResponse = { success: false, message: 'System under maintenance' }
      
      // 尝试解析响应体
      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          data = await response.json()
        }
      } catch (error) {
        console.warn('解析维护响应失败:', error)
        // 使用默认值
      }
      
      // 提取维护数据
      const maintenanceData: MaintenanceData = {
        announcement: data.data?.announcement || data.message,
        endTime: data.data?.endTime,
      }
      
      // 触发维护对话框
      maintenanceManager.openMaintenanceDialog(maintenanceData)
      
      return {
        success: false,
        message: maintenanceData.announcement || 'System under maintenance',
        error: data.error || 'SYSTEM_MAINTENANCE',
      }
    }

    // 解析正常响应
    let data: ApiResponse<T>
    try {
      data = await response.json()
    } catch (error) {
      console.error('解析响应JSON失败:', error)
      throw new Error('Failed to parse response')
    }
    
    if (!response.ok) {
      // HTTP错误时，尝试从响应体中提取错误信息
      if (data && data.message) {
        throw new Error(data.message)
      } else {
        throw new Error(`Network error, please check your network connection and try again`)
      }
    }
    
    console.log(`[API] 响应:`, data)
    
    return data
  } catch (error) {
    console.error('API请求失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '请求失败',
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * 带鉴权的请求方法
 */
export async function authenticatedRequest<T = any>(
  endpoint: string,
  token: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  try {
    const { headers = {}, ...restConfig } = config
    
    const authHeaders = {
      ...headers,
      'Authorization': `Bearer ${token}`,
    }

    return await apiRequest<T>(endpoint, {
      ...restConfig,
      headers: authHeaders,
    })
  } catch (error) {
    console.error('认证请求失败:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '认证请求失败',
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

/**
 * GET请求（不带鉴权）
 */
export async function get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' })
}

/**
 * POST请求（不带鉴权）
 */
export async function post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data,
  })
}

/**
 * PUT请求（不带鉴权）
 */
export async function put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data,
  })
}

/**
 * DELETE请求（不带鉴权）
 */
export async function del<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' })
}

/**
 * GET请求（带鉴权）
 */
export async function authGet<T = any>(endpoint: string, token: string): Promise<ApiResponse<T>> {
  return authenticatedRequest<T>(endpoint, token, { method: 'GET' })
}

/**
 * POST请求（带鉴权）
 */
export async function authPost<T = any>(endpoint: string, token: string, data?: any): Promise<ApiResponse<T>> {
  return authenticatedRequest<T>(endpoint, token, {
    method: 'POST',
    body: data,
  })
}

/**
 * PUT请求（带鉴权）
 */
export async function authPut<T = any>(endpoint: string, token: string, data?: any): Promise<ApiResponse<T>> {
  return authenticatedRequest<T>(endpoint, token, {
    method: 'PUT',
    body: data,
  })
}

/**
 * DELETE请求（带鉴权）
 */
export async function authDelete<T = any>(endpoint: string, token: string): Promise<ApiResponse<T>> {
  return authenticatedRequest<T>(endpoint, token, { method: 'DELETE' })
}

/**
 * PATCH请求（不带鉴权）
 */
export async function patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data,
  })
}

/**
 * PATCH请求（带鉴权）
 */
export async function authPatch<T = any>(endpoint: string, token: string, data?: any): Promise<ApiResponse<T>> {
  return authenticatedRequest<T>(endpoint, token, {
    method: 'PATCH',
    body: data,
  })
}