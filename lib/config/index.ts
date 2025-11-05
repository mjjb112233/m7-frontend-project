/**
 * 配置管理器（统一入口）
 * 提供类型安全的配置访问API
 */

import { loadConfig } from './loader'
import type { AppConfigData, ApiConfig, AppConfig, FeaturesConfig, AuthConfig, PaginationConfig, CVVCheckConfig, LanguageConfig, BrandingConfig, CustomerServiceConfig } from './types'

// 全局配置实例
let configInstance: AppConfigData | null = null

/**
 * 初始化配置管理器
 */
export function initConfig(): AppConfigData {
  if (!configInstance) {
    configInstance = loadConfig()
  }
  return configInstance
}

/**
 * 获取配置实例
 */
function getConfig(): AppConfigData {
  if (!configInstance) {
    configInstance = initConfig()
  }
  return configInstance
}

/**
 * 获取API配置
 */
export function getApiConfig(): ApiConfig {
  return getConfig().api
}

/**
 * 获取API基础URL
 */
export function getApiBaseUrl(): string {
  return getApiConfig().baseUrl
}

/**
 * 获取应用配置
 */
export function getAppConfig(): AppConfig {
  return getConfig().app
}

/**
 * 获取功能配置
 */
export function getFeaturesConfig(): FeaturesConfig {
  return getConfig().features
}

/**
 * 获取认证配置
 */
export function getAuthConfig(): AuthConfig {
  return getConfig().auth
}

/**
 * 获取分页配置
 */
export function getPaginationConfig(): PaginationConfig {
  return getConfig().pagination
}

/**
 * 获取CVV检测配置
 */
export function getCVVCheckConfig(): CVVCheckConfig {
  return getConfig().cvvCheck
}

/**
 * 获取语言配置
 */
export function getLanguageConfig(): LanguageConfig {
  return getConfig().language
}

/**
 * 获取品牌配置
 */
export function getBrandingConfig(): BrandingConfig {
  return getConfig().branding
}

/**
 * 获取复制时携带的网站名字
 */
export function getCopyWebsiteName(): string {
  return getBrandingConfig().copyWebsiteName
}

/**
 * 获取Logo显示的名字
 */
export function getLogoName(): string {
  return getBrandingConfig().logoName
}

/**
 * 获取客服配置
 */
export function getCustomerServiceConfig(): CustomerServiceConfig {
  return getConfig().customerService
}

/**
 * 获取完整配置
 */
export function getFullConfig(): AppConfigData {
  return getConfig()
}

// 自动初始化配置
initConfig()

// 导出类型
export type { AppConfigData, ApiConfig, AppConfig, FeaturesConfig, AuthConfig, PaginationConfig, CVVCheckConfig, LanguageConfig, BrandingConfig, CustomerServiceConfig }

