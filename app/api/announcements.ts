/**
 * 公告相关API
 */

import { apiRequest } from '@/lib/api'

// 公告接口定义
export interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error'
  priority: 'low' | 'medium' | 'high'
  startTime: string
  endTime: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GetAnnouncementsResponse {
  success: boolean
  data: Announcement[]
  message: string
}

/**
 * 获取公告列表
 */
export async function getAnnouncements(): Promise<GetAnnouncementsResponse> {
  return apiRequest<Announcement[]>('/announcements')
}

/**
 * 获取活跃公告
 */
export async function getActiveAnnouncements(): Promise<GetAnnouncementsResponse> {
  return apiRequest<Announcement[]>('/announcements/active')
}

/**
 * 根据类型获取公告
 */
export async function getAnnouncementsByType(type: Announcement['type']): Promise<GetAnnouncementsResponse> {
  return apiRequest<Announcement[]>(`/announcements/type/${type}`)
}
