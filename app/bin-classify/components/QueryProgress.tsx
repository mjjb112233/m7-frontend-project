import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { X, BarChart3 } from "lucide-react"
import { ProcessingStatus } from "../types"

interface QueryProgressProps {
  processingStatus: ProcessingStatus
  onStop?: () => void
}

export function QueryProgress({ processingStatus, onStop }: QueryProgressProps) {
  if (!processingStatus.isProcessing) {
    return null
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-12 translate-x-12"></div>
      
      <CardHeader className="relative bg-gradient-to-r from-blue-600/10 to-indigo-600/10 pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <span>正在分析卡片</span>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600 font-normal">获取BIN信息中...</span>
              </div>
            </div>
          </div>
          {onStop && (
            <Button
              variant="outline"
              size="sm"
              onClick={onStop}
              className="bg-white/80 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mr-1.5">
                <X className="w-2.5 h-2.5 text-white" />
              </div>
              停止查询
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4 p-6">
        {/* 进度信息 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-blue-700">
              处理进度: {processingStatus.processedCount} / {processingStatus.totalCount}
            </span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round(processingStatus.progress)}%
            </span>
          </div>
          <Progress 
            value={processingStatus.progress} 
            className="h-2 bg-white/50"
          />
        </div>
        
        {/* 当前处理的卡号 */}
        {processingStatus.currentCard && (
          <div className="bg-white/80 rounded-lg p-4 border border-blue-200">
            <div className="text-sm font-medium text-gray-700 mb-2">当前处理:</div>
            <div className="font-mono text-base font-semibold text-gray-900 bg-gray-50 rounded px-3 py-2">
              {processingStatus.currentCard}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 text-center">
          正在获取卡片详细信息，请稍候...
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </CardContent>
    </Card>
  )
}