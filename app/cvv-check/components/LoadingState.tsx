import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  message?: string
  description?: string
}

/**
 * 通用加载状态组件
 * 用于显示数据获取过程中的加载状态
 */
export function LoadingState({ 
  message = "正在加载...", 
  description = "请稍候，正在获取数据" 
}: LoadingStateProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-gray-700">{message}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </CardContent>
    </Card>
  )
}
