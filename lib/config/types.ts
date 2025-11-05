/**
 * 配置类型定义
 */

// API配置接口
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
  retryDelay: number
}

// 应用配置接口
export interface AppConfig {
  name: string
  version: string
  environment: string
}

// 功能配置接口
export interface FeaturesConfig {
  debugMode: boolean
  enableLogging: boolean
  mockData: boolean
}

// 认证配置接口
export interface AuthConfig {
  tokenKey: string
  tokenExpiry: string
}

// 分页配置接口
export interface PaginationConfig {
  defaultPageSize: number
  maxPageSize: number
}

// CVV检测配置接口
export interface CVVCheckConfig {
  cancelStatusPollInterval: number  // cancel-status轮询间隔（秒）
  detectionProgressPollInterval: number  // 检测进度轮询间隔（秒）
}

// 语言配置接口
export interface LanguageConfig {
  defaultLanguage: string  // 默认语言（"zh"或"en"）
}

// 品牌配置接口
export interface BrandingConfig {
  copyWebsiteName: string  // 复制时携带的网站名字
  logoName: string  // Logo显示的名字
  tabTitle: string  // 浏览器标签页显示的标题
}

// 客服配置接口
export interface CustomerServiceConfig {
  contactUrl: string  // 客服联系链接（如Telegram链接）
}

// 完整配置接口
export interface AppConfigData {
  app: AppConfig
  api: ApiConfig
  features: FeaturesConfig
  auth: AuthConfig
  pagination: PaginationConfig
  cvvCheck: CVVCheckConfig
  language: LanguageConfig
  branding: BrandingConfig
  customerService: CustomerServiceConfig
}

