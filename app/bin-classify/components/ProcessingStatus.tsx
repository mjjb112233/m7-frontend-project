import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, BarChart3 } from "lucide-react"
import { ProcessingStatus as ProcessingStatusType } from "../types"

interface ProcessingStatusProps {
  processingStatus: ProcessingStatusType
}

export function ProcessingStatus({ processingStatus }: ProcessingStatusProps) {
  if (!processingStatus.isProcessing) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          处理进度
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>处理进度</span>
            <span>{processingStatus.processedCount} / {processingStatus.totalCount}</span>
          </div>
          <Progress value={processingStatus.progress} className="w-full" />
        </div>
        
        {processingStatus.currentCard && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">当前处理卡片</div>
            <div className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
              {processingStatus.currentCard}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BarChart3 className="h-4 w-4" />
          正在分析卡片信息...
        </div>
      </CardContent>
    </Card>
  )
}
