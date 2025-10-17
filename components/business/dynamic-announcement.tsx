"use client"

import { useState, useEffect, useCallback } from "react"
import { AnnouncementBanner } from "./announcement-banner"
import { getAnnouncements, type Announcement } from "@/lib/api/announcements"

// 简单的本地缓存和关闭功能
function dismissAnnouncement(announcementId: string): void {
  try {
    const dismissedKey = `announcement_dismissed_${announcementId}`
    sessionStorage.setItem(dismissedKey, 'true')
    console.log(`[v0] 公告 ${announcementId} 已关闭`)
  } catch (error) {
    console.warn("[v0] 无法关闭公告:", error)
  }
}

function getDismissedAnnouncements(): Set<string> {
  const dismissed = new Set<string>()
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith('announcement_dismissed_')) {
        const announcementId = key.replace('announcement_dismissed_', '')
        dismissed.add(announcementId)
      }
    }
  } catch (error) {
    console.warn("[v0] 无法获取已关闭的公告列表:", error)
  }
  return dismissed
}

interface DynamicAnnouncementProps {
  position?: "top" | "hero" | "floating"
  forceRefresh?: boolean // 是否强制刷新公告数据
}

export function DynamicAnnouncement({
  position = "top",
  forceRefresh = false,
}: DynamicAnnouncementProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const fetchAnnouncements = useCallback(async () => {
    // 如果已经加载过，不再重复请求
    if (hasLoaded) {
      console.log("[v0] 公告已加载过，跳过请求")
      return
    }

    try {
      console.log("[v0] 开始获取公告（首次加载）")
      setError(null)

      const announcements = await getAnnouncements()

      if (announcements && announcements.length > 0) {
        // 获取已关闭的公告列表
        const dismissedAnnouncements = getDismissedAnnouncements()
        
        // 过滤出已关闭的公告（位置固定为top，都可关闭，不限制数量）
        const filteredAnnouncements = announcements
          .filter(announcement => 
            !dismissedAnnouncements.has(announcement.id)
          )
        
        console.log("[v0] 获取到公告数量:", filteredAnnouncements.length)
        setAnnouncements(filteredAnnouncements)
        
        // 如果当前索引超出范围，重置为0
        if (currentIndex >= filteredAnnouncements.length) {
          setCurrentIndex(0)
        }
        
        // 标记为已加载
        setHasLoaded(true)
      } else {
        setError(response.message || "获取公告失败")
        setAnnouncements([])
      }
    } catch (error) {
      console.error("[v0] 获取公告异常:", error)
      setError("无法获取公告数据，请检查网络连接或稍后重试")
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }, [hasLoaded, currentIndex])

  // 只在组件首次挂载时请求公告
  useEffect(() => {
    fetchAnnouncements()
  }, []) // 空依赖数组，只在组件挂载时执行一次

  useEffect(() => {
    // 清除之前的定时器
    if (intervalId) {
      console.log("[v0] 清除之前的自动轮播定时器")
      clearInterval(intervalId)
      setIntervalId(null)
    }

    // 只有多个公告时才轮播
    if (announcements.length > 1) {
      const currentAnnouncement = announcements[currentIndex]
      // 从当前公告获取轮播间隔，如果没有则使用默认值5000ms
      const duration = currentAnnouncement?.carouselDuration || 5000

      console.log("[v0] 设置自动轮播定时器，间隔:", duration, "ms")
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % announcements.length
          console.log("[v0] 自动切换公告，从", prevIndex, "到", nextIndex)
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 500) // 动画持续500ms
          return nextIndex
        })
      }, duration)

      setIntervalId(interval)

      return () => {
        console.log("[v0] useEffect清理，清除自动轮播定时器")
        clearInterval(interval)
      }
    } else {
      console.log("[v0] 公告数量不足，不设置轮播定时器，公告数量:", announcements.length)
    }
  }, [announcements, currentIndex])

  // 页面卸载时清除定时器
  useEffect(() => {
    return () => {
      console.log("[v0] 组件卸载，清除定时器")
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  const handleDismissAnnouncement = useCallback(
    (announcementId: string) => {
      console.log("[v0] 处理公告关闭:", announcementId)

      // 立即清除当前定时器，避免在状态更新过程中继续执行
      if (intervalId) {
        console.log("[v0] 手动关闭公告，立即清除定时器")
        clearInterval(intervalId)
        setIntervalId(null)
      }

      try {
        const result = dismissAnnouncement(announcementId)
        // 公告关闭成功，从列表中移除
        setAnnouncements((prev) => {
          const newAnnouncements = prev.filter((ann) => ann.id !== announcementId)

          // 如果当前显示的公告被关闭，调整索引
          if (currentIndex >= newAnnouncements.length && newAnnouncements.length > 0) {
            setCurrentIndex(0)
          } else if (newAnnouncements.length === 0) {
            setCurrentIndex(0)
          }

          console.log("[v0] 公告关闭后剩余数量:", newAnnouncements.length)
          return newAnnouncements
        })
      } catch (error) {
        console.error("[v0] 关闭公告失败:", error)
      }
    },
    [currentIndex, intervalId],
  )

  // 重试函数，重置加载状态并重新请求
  const handleRetry = useCallback(() => {
    setHasLoaded(false)
    setLoading(true)
    setError(null)
    fetchAnnouncements()
  }, [fetchAnnouncements])

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg min-h-[60px] flex items-center">
        <p className="text-red-600 text-sm flex-1">获取公告失败: {error}</p>
        <button onClick={handleRetry} className="ml-2 text-sm text-red-700 hover:text-red-800 underline">
          重试
        </button>
      </div>
    )
  }

  // 如果没有公告，不显示任何内容
  if (announcements.length === 0) {
    console.log("[v0] 没有可显示的公告")
    return null
  }

  const currentAnnouncement = announcements[currentIndex]
  console.log("[v0] 当前显示公告:", currentAnnouncement?.id, "索引:", currentIndex)

  return (
    <div className="relative overflow-hidden">
      <div
        className={`transform transition-all duration-500 ease-in-out ${
          isAnimating ? "translate-x-0 opacity-100" : "translate-x-0 opacity-100"
        }`}
        style={{
          animation: isAnimating ? "slideInFromRight 0.5s ease-in-out" : "none",
        }}
      >
        <AnnouncementBanner
          type={currentAnnouncement.uiType}
          title={currentAnnouncement.title}
          message={currentAnnouncement.message}
          dismissible={true}
          position="top"
          onDismiss={() => handleDismissAnnouncement(currentAnnouncement.id)}
        />
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
