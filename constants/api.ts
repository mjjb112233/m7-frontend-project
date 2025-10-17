/**
 * API相关常量
 */

import { getApiBaseUrl, getApiConfig } from '@/lib/config'

// API基础URL
export const API_BASE_URL = getApiBaseUrl()

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    USER: '/auth/user',
  },
  // 公告相关
  ANNOUNCEMENTS: '/announcements',
  // CVV检测相关
  CVV_CHECK: {
    CONFIG: '/cvv-check/config',
    STATUS: '/cvv-check/status',
    USER_STATUS: '/cvv-check/user-status',
    START_DETECTION: '/cvv-check/start-detection',
    STOP_DETECTION: '/cvv-check/stop-detection',
    DETECTION_PROGRESS: '/cvv-check/detection-progress',
    DETECTION_RESULTS: '/cvv-check/detection-results',
    RESET_DETECTION_STATUS: '/cvv-check/reset-detection-status',
  },
  // BIN分类相关
  BIN_CLASSIFY: {
    CONFIG: '/bin-classify/config',
    START: '/bin-classify/start',
    RESULTS: '/bin-classify/results',
  },
  // BIN查询相关
  BIN_QUERY: {
    QUERY: '/bin-query/query',
    HISTORY: '/bin-query/history',
  },

  // 充值相关
  RECHARGE: {
    CONFIG: '/recharge/config',
    PACKAGES: '/recharge/packages',
    CREATE_ORDER: '/recharge/create-order',
    HISTORY: '/recharge/history',
    PAYMENT: '/recharge/payment',
    CALLBACK: '/recharge/callback',
    EXCHANGE_CODE: '/recharge/exchange-code',
  },
  // 信息生成相关
  INFO_GENERATE: {
    CONFIG: '/info-generate/config',
    START: '/info-generate/start',
    RESULTS: '/info-generate/results',
    PRICE: '/info-generate/price',
    GENERATE: '/info-generate/generate',
  },
} as const

// 从配置获取请求超时时间
export const REQUEST_TIMEOUT = getApiConfig().timeout

// 从配置获取重试次数
export const MAX_RETRY_ATTEMPTS = getApiConfig().retries

// 心跳间隔
export const HEARTBEAT_INTERVAL = 30000 // 30秒
