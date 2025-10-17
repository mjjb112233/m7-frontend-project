/**
 * 配置管理工具
 * 从JSON配置文件加载配置，替代环境变量
 */

import configData from './config.json'

// 配置接口定义
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
  retryDelay: number
}

export interface Config {
  api: ApiConfig
}

// 配置类
class ConfigManager {
  private config: Config

  constructor() {
    this.config = configData as Config
  }

  // 获取API基础URL
  getApiBaseUrl(): string {
    return this.config.api.baseUrl
  }

  // 获取API配置
  getApiConfig(): ApiConfig {
    return this.config.api
  }
}

// 创建全局配置实例
const configManager = new ConfigManager()

// 导出配置获取函数
export const getApiBaseUrl = () => configManager.getApiBaseUrl()
export const getApiConfig = () => configManager.getApiConfig()

// 导出配置管理器实例
export default configManager
