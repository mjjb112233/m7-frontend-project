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
  avatarSeed?: string // DiceBear avatar seed
  avatarStyle?: string // DiceBear avatar style
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
  // confirmPassword is only used for frontend validation, not sent to backend
}

export interface UserPayload {
  userId: string
  username: string
  level: number
  mCoins: number
}
