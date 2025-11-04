/**
 * 认证相关类型定义
 */

import { USER_LEVELS } from './common'

// 用户类型
export interface User {
  id: string
  username: string
  email: string
  level: number
  mCoins: number
  avatarSeed?: string
  avatarStyle?: string
  accountStatus?: 'active' | 'banned'
  createdAt?: string
  updatedAt?: string
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 注册请求
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  expiresIn?: number
  user: User
}

// 注册响应
export interface RegisterResponse {
  token: string
  user: User
}

// 用户等级类型
export type UserLevel = typeof USER_LEVELS[keyof typeof USER_LEVELS]

