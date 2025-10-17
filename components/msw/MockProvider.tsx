'use client'

import React, { useEffect, useState } from 'react'

interface MockProviderProps {
  children: React.ReactNode
}

export function MockProvider({ children }: MockProviderProps) {
  const [isMSWReady, setIsMSWReady] = useState(false)

  useEffect(() => {
    const initMSW = async () => {
      // 检查是否启用模拟数据
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
      
      if (useMockData && typeof window !== 'undefined') {
        try {
          const { worker } = await import('@/mocks/browser')
          await worker.start({
            onUnhandledRequest: 'bypass',
            serviceWorker: {
              url: '/mockServiceWorker.js'
            }
          })
          console.log('🚀 MSW模拟数据已启动')
          setIsMSWReady(true)
        } catch (error) {
          console.error('❌ MSW启动失败:', error)
          setIsMSWReady(true) // 即使失败也继续渲染
        }
      } else {
        console.log('🌐 使用真实API请求模式')
        setIsMSWReady(true)
      }
    }

    initMSW()
  }, [])

  // 在MSW准备就绪前显示加载状态
  if (!isMSWReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在初始化模拟数据...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
