import { useAuth } from "@/contexts/auth-context"
import { authenticatedRequest } from "@/lib/api"

// 充值套餐接口
export interface RechargePackage {
  id: string
  nameZh: string
  nameEn: string
  m_coin_amount: number
  discount: number
  original_price: number
  descriptionZh?: string
  descriptionEn?: string
  is_popular: boolean
}

export interface GetRechargePackagesResponse {
  success: boolean
  message: string
  data: {
    packages: RechargePackage[]
    total: number
  }
}

export function useRechargeAPI() {
  const { token } = useAuth()
  
  // 获取充值配置
  const fetchRechargeConfig = async () => {
    if (!token) return null
    
    try {
      const response = await authenticatedRequest('/recharge/config', token)
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to get recharge config:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting recharge config:', error)
      return null
    }
  }
  
  // 获取充值套餐
  const fetchRechargePackages = async () => {
    if (!token) return null
    
    try {
      const response = await authenticatedRequest('/recharge/packages', token)
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to get recharge packages:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting recharge packages:', error)
      return null
    }
  }
  
  // 创建充值订单
  const createRechargeOrder = async (requestData: any) => {
    if (!token) return null
    
    try {
      const response = await authenticatedRequest('/recharge/create-order', token, {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to create recharge order:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error creating recharge order:', error)
      return null
    }
  }
  
  // 获取充值历史
  const fetchRechargeHistory = async () => {
    if (!token) return null
    
    try {
      const response = await authenticatedRequest('/recharge/history', token)
      
      if (response.success) {
        return response.data
      } else {
        console.error('Failed to get recharge history:', response.message)
        return null
      }
    } catch (error) {
      console.error('Error getting recharge history:', error)
      return null
    }
  }
  
  return {
    fetchRechargeConfig,
    fetchRechargePackages,
    createRechargeOrder,
    fetchRechargeHistory,
  }
}
