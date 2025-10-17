/**
 * 配置文件
 */

// 应用配置
export const APP_CONFIG = {
  NAME: 'M7 金融科技平台',
  VERSION: '2.1.0',
  DESCRIPTION: '专业的银行卡检测和分类平台',
  AUTHOR: 'M7 Team',
} as const

// 用户等级配置
export const USER_LEVELS = {
  GUEST: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
} as const

// 用户等级权限配置
export const USER_PERMISSIONS = {
  [USER_LEVELS.GUEST]: {
    canAccessCVVCheck: false,
    canAccessBinClassify: false,
    canAccessBinQuery: false,
    canAccessRecharge: false,
    canAccessInfoGenerate: false,
    canAccessExtractCode: false,
  },
  [USER_LEVELS.LEVEL_1]: {
    canAccessCVVCheck: true,
    canAccessBinClassify: true,
    canAccessBinQuery: true,
    canAccessRecharge: true,
    canAccessInfoGenerate: false,
    canAccessExtractCode: false,
  },
  [USER_LEVELS.LEVEL_2]: {
    canAccessCVVCheck: true,
    canAccessBinClassify: true,
    canAccessBinQuery: true,
    canAccessRecharge: true,
    canAccessInfoGenerate: true,
    canAccessExtractCode: false,
  },
  [USER_LEVELS.LEVEL_3]: {
    canAccessCVVCheck: true,
    canAccessBinClassify: true,
    canAccessBinQuery: true,
    canAccessRecharge: true,
    canAccessInfoGenerate: true,
    canAccessExtractCode: true,
  },
} as const

// 支付相关配置
export const PAYMENT_CONFIG = {
  CURRENCY: 'USDT',
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 10000,
  TIMEOUT: 30 * 60 * 1000, // 30分钟
} as const

// 检测配置
export const DETECTION_CONFIG = {
  MAX_CVV_COUNT: 1000,
  MAX_CARD_COUNT: 500,
  TIMEOUT: 5 * 60 * 1000, // 5分钟
  HEARTBEAT_INTERVAL: 30 * 1000, // 30秒
} as const

// 缓存配置
export const CACHE_CONFIG = {
  ANNOUNCEMENTS_TTL: 24 * 60 * 60 * 1000, // 24小时
  USER_DATA_TTL: 7 * 24 * 60 * 60 * 1000, // 7天
  SESSION_TTL: 24 * 60 * 60 * 1000, // 24小时
} as const

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const
