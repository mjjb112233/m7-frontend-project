/**
 * 配置管理工具（已废弃，请使用 @/lib/config/index）
 * 此文件保留用于向后兼容
 * @deprecated 请使用 @/lib/config/index 替代
 */

// 重新导出新配置系统的接口和函数，保持向后兼容
export { getApiBaseUrl, getApiConfig } from './config/index'
export type { ApiConfig } from './config/index'

// 导出默认实例（向后兼容）
const configManager = {
  getApiBaseUrl: () => require('./config/index').getApiBaseUrl(),
  getApiConfig: () => require('./config/index').getApiConfig(),
}

export default configManager
