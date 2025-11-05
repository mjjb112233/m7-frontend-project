/**
 * 配置加载器
 * 负责读取config/app.config.json并合并环境变量
 */

import type { AppConfigData } from './types'

// 导入配置文件（Next.js支持JSON导入）
import configData from '../../config/app.config.json'

/**
 * 加载配置文件
 */
export function loadConfig(): AppConfigData {
  try {
    // 使用导入的配置数据
    const config = configData as AppConfigData
    
    // 合并环境变量覆盖（如果存在）
    const env = process.env.NODE_ENV || 'development'
    
    // 从环境变量覆盖配置
    const mergedConfig: AppConfigData = {
      ...config,
      app: {
        ...config.app,
        environment: env,
      },
      api: {
        ...config.api,
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || config.api.baseUrl,
        timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || config.api.timeout,
      },
      features: {
        ...config.features,
        debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' || config.features.debugMode,
        mockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || config.features.mockData,
      },
    }
    
    return mergedConfig
  } catch (error) {
    console.error('Failed to load config:', error)
    // 返回默认配置
    return getDefaultConfig()
  }
}

/**
 * 获取默认配置
 */
function getDefaultConfig(): AppConfigData {
  return {
    app: {
      name: 'M7 金融科技平台',
      version: '2.1.0',
      environment: 'development',
    },
    api: {
      baseUrl: 'http://localhost:8080/api',
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
    },
    features: {
      debugMode: true,
      enableLogging: true,
      mockData: false,
    },
    auth: {
      tokenKey: 'm7_auth_token',
      tokenExpiry: '7d',
    },
    pagination: {
      defaultPageSize: 10,
      maxPageSize: 100,
    },
    cvvCheck: {
      cancelStatusPollInterval: 3,
      detectionProgressPollInterval: 2,
    },
    language: {
      defaultLanguage: "zh",
    },
    branding: {
      copyWebsiteName: "cc-m7.com",
      logoName: "cc-m7",
      tabTitle: "cc-m7",
    },
    customerService: {
      contactUrl: "https://t.me/your_customer_service_bot",
    },
  }
}

