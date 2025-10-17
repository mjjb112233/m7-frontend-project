"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  username: string // Added username field
  name: string
  avatar?: string
  mCoins: number
  level: number // Added user level field
}

interface AuthContextType {
  user: User | null
  token: string | null // 添加token字段
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean> // Added register function
  logout: () => void
  updateMCoins: (amount: number) => void
  refreshUserInfo: () => Promise<void> // 添加刷新用户信息方法
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null) // 添加token状态
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("token") // 从localStorage获取token
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("user")
      }
    }
    if (savedToken) {
      setToken(savedToken) // 设置token
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
  }, [token])

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("🔐 AuthContext login 开始，邮箱:", email)
    setIsLoading(true)
    try {
      // 使用统一的API客户端
      console.log("📡 导入API客户端...")
      const { apiRequest } = await import('@/lib/api')
      console.log("📡 发送登录请求...")
      const response = await apiRequest('/auth/login', {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      console.log("📡 API响应:", response)

      if (response.success) {
        const token = (response.data as any).token
        
        // 设置token到localStorage，7天过期
        const expirationTime = new Date()
        expirationTime.setDate(expirationTime.getDate() + 7)
        localStorage.setItem("token", token)
        localStorage.setItem("tokenExpiration", expirationTime.toISOString())
        
        setToken(token)
        setUser((response.data as any).user)
        return true
      } else {
        // 抛出错误，让前端处理错误信息
        const error = new Error(response.message || "登录失败")
        throw error
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error // 重新抛出错误，让前端处理
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { apiRequest } = await import('@/lib/api')
      const response = await apiRequest('/auth/register', {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      })

      if (response.success) {
        const token = (response.data as any).token
        const user = (response.data as any).user
        
        // 设置token到localStorage，7天过期
        const expirationTime = new Date()
        expirationTime.setDate(expirationTime.getDate() + 7)
        localStorage.setItem("token", token)
        localStorage.setItem("tokenExpiration", expirationTime.toISOString())
        
        setToken(token)
        setUser(user)
        return true
      } else {
        // 抛出错误，让前端处理错误信息
        const error = new Error(response.message || "注册失败")
        throw error
      }
    } catch (error) {
      console.error("Registration failed:", error)
      throw error // 重新抛出错误，让前端处理
    } finally {
      setIsLoading(false)
    }
  }

  // 获取用户信息
  const fetchUserInfo = async (token: string): Promise<User | null> => {
    try {
      const { authenticatedRequest } = await import('@/lib/api')
      const response = await authenticatedRequest('/auth/user', token, {
        method: 'GET'
      })

      if (response.success && response.data) {
        return response.data as User
      } else {
        console.error("获取用户信息失败:", response.message)
        return null
      }
    } catch (error) {
      console.error("获取用户信息错误:", error)
      return null
    }
  }

  // 检查token是否过期
  const isTokenExpired = (): boolean => {
    const expiration = localStorage.getItem("tokenExpiration")
    if (!expiration) return true
    
    return new Date() > new Date(expiration)
  }

  // 初始化用户状态
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")
      
      if (storedToken && !isTokenExpired()) {
        setToken(storedToken)
        
        // 如果有缓存的用户信息，先使用缓存
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch (error) {
            console.error("解析用户信息失败:", error)
          }
        }
        
        // 然后获取最新的用户信息
        const userInfo = await fetchUserInfo(storedToken)
        if (userInfo) {
          setUser(userInfo)
          localStorage.setItem("user", JSON.stringify(userInfo))
        } else {
          // 如果获取用户信息失败，清除token
          localStorage.removeItem("token")
          localStorage.removeItem("tokenExpiration")
          localStorage.removeItem("user")
          setToken(null)
          setUser(null)
        }
      } else if (storedToken && isTokenExpired()) {
        // Token过期，清除所有存储
        localStorage.removeItem("token")
        localStorage.removeItem("tokenExpiration")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
      }
    }

    initializeAuth()
  }, [])

  const logout = () => {
    setUser(null)
    setToken(null) // 清除token
    localStorage.removeItem("user")
    localStorage.removeItem("token") // 清除localStorage中的token
    localStorage.removeItem("tokenExpiration") // 清除过期时间
  }

  const updateMCoins = (amount: number) => {
    if (user) {
      setUser({ ...user, mCoins: user.mCoins + amount })
    }
  }

  const refreshUserInfo = async () => {
    if (token) {
      const userInfo = await fetchUserInfo(token)
      if (userInfo) {
        setUser(userInfo)
        localStorage.setItem("user", JSON.stringify(userInfo))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateMCoins, refreshUserInfo }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
