"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到控制台
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">出错了</h1>
        <p className="text-gray-600 mb-6">
          {error.message || "应用遇到了一个错误，请稍后重试"}
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-6">错误代码: {error.digest}</p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            重试
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  )
}

