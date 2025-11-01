import React from "react"
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  progress?: number
}

export function LoadingOverlay({ 
  isVisible, 
  message = "处理中...", 
  progress 
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-2xl border max-w-sm w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span className="text-lg font-medium text-gray-900">{message}</span>
        </div>
        
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
        
        {progress !== undefined && (
          <div className="text-sm text-gray-600 mt-2 text-center">
            {Math.round(progress)}% 完成
          </div>
        )}
      </div>
    </div>
  )
}