/**
 * 认证相关类型定义
 */

export interface User {
  id: string
  username: string
  email: string
  level: number
  mCoins: number
  avatar?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateMCoins: (amount: number) => void
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresIn: number
  user: User
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserPayload {
  userId: string
  username: string
  level: number
  mCoins: number
}
