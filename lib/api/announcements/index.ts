/**
 * 公告API - 获取公告数据
 * 网站打开时请求一次，之后缓存使用
 */

import { get } from '../request'

// 公告接口定义 - 简化版本，只保留实际使用的字段
export interface Announcement {
  id: string
  title: string
  message: string
  uiType: 'info' | 'warning' | 'success' | 'error'
  carouselDuration?: number // 轮播时间间隔（毫秒），可选字段
}

// 缓存键名
const CACHE_KEY = 'announcements_cache'
const REQUESTED_KEY = 'announcements_requested'

// 检查是否已经请求过公告
function hasRequestedAnnouncements(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(REQUESTED_KEY) === 'true'
  } catch (error) {
    console.warn('无法访问会话存储:', error)
    return false
  }
}

// 标记已请求过公告
function markAsRequested(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(REQUESTED_KEY, 'true')
  } catch (error) {
    console.warn('无法设置会话存储:', error)
  }
}

// 缓存公告数据
function cacheAnnouncements(announcements: Announcement[]): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(announcements))
  } catch (error) {
    console.warn('无法缓存公告数据:', error)
  }
}

// 获取缓存的公告数据
function getCachedAnnouncements(): Announcement[] {
  if (typeof window === 'undefined') return []
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    return cached ? JSON.parse(cached) : []
  } catch (error) {
    console.warn('无法读取缓存数据:', error)
    return []
  }
}

/**
 * 获取公告列表
 * 网站打开时请求一次，之后使用缓存数据
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  // 如果已经请求过，直接返回缓存数据
  if (hasRequestedAnnouncements()) {
    console.log('[公告] 使用缓存数据')
    return getCachedAnnouncements()
  }

  try {
    console.log('[公告] 首次请求公告数据')
    const response = await get<Announcement[]>('/announcements/')
    
    if (response.success && response.data) {
      // 缓存数据并标记已请求
      cacheAnnouncements(response.data)
      markAsRequested()
      console.log('[公告] 公告数据已缓存')
      return response.data
    }
    
    return []
  } catch (error) {
    console.error('[公告] 获取公告失败:', error)
    return []
  }
}
