import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { TrendingUp, Copy } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCVVCheckAPI } from "@/lib/api"
import { formatTimestamp } from "@/lib/utils/format"
import { CVVResult } from "../../types"

interface ResultsStepProps {
  detectionId: string | null
  onRetest: () => void
  copySuccess: boolean
  setCopySuccess: (success: boolean) => void
}

export function ResultsStep({
  detectionId,
  onRetest,
  copySuccess,
  setCopySuccess
}: ResultsStepProps) {
  const { t } = useLanguage()
  const api = useCVVCheckAPI()

  // 内部状态管理
  const [detectionResults, setDetectionResults] = useState<any>(null)
  const [validResults, setValidResults] = useState<CVVResult[]>([])
  const [invalidResults, setInvalidResults] = useState<CVVResult[]>([])
  const [unknownResults, setUnknownResults] = useState<CVVResult[]>([])
  const [isResultsPageLoading, setIsResultsPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  
  // 重新检测相关状态
  const [isResetting, setIsResetting] = useState(false)


  

  

  

  


  // 自动获取检测结果数据
  const fetchDetectionResults = async () => {
    if (!detectionId) {
      console.log("[ResultsStep] 没有检测ID，跳过数据获取")
      setIsResultsPageLoading(false)
      return
    }

    try {
      console.log("[ResultsStep] Starting to get detection results, detection ID:", detectionId)
      setIsResultsPageLoading(true)
      setError(null)

      const result = await api.fetchDetectionResults(detectionId)
      
      if (result) {
        console.log("[ResultsStep] Detection results retrieved successfully:", result)
        setDetectionResults(result)
        
        // 处理结果数据
        const valid = (result as any).validResults || []
        const invalid = (result as any).invalidResults || []
        const unknown = (result as any).unknownResults || []
        
        setValidResults(valid)
        setInvalidResults(invalid)
        setUnknownResults(unknown)
        

      } else {
        console.log("[ResultsStep] Failed to get detection results")
        setError("Failed to get detection results")
      }
    } catch (err) {
      console.error("[ResultsStep] Error getting detection results:", err)
      setError(err instanceof Error ? err.message : "Failed to get detection results")
    } finally {
      setIsResultsPageLoading(false)
    }
  }

  // 监听检测ID变化，自动获取数据
  useEffect(() => {
    if (detectionId) {
      fetchDetectionResults()
    }
  }, [detectionId])







  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    })
  }

  // 重置检测状态
  const handleResetDetection = async () => {
    setIsResetting(true)
    try {
      console.log('[ResultsStep] Starting to reset detection status...')
      const result = await api.resetDetectionStatus()
      
      if (result) {
        console.log('[ResultsStep] Detection status reset successfully:', result)
        // 调用父组件的onRetest回调，跳转到配置页面
        onRetest()
      } else {
        console.error('[ResultsStep] Failed to reset detection status')
        setError('Failed to reset detection status, please try again later')
      }
    } catch (error) {
      console.error('[ResultsStep] Error resetting detection status:', error)
      setError('Error occurred while resetting detection status, please try again later')
    } finally {
      setIsResetting(false)
    }
  }



  const ResultTable = ({ results, status }: { results: CVVResult[]; status: string }) => {
    const copyAllToClipboard = () => {
      const allCVVs = (results || []).map((result) => result.cvv).join("\n")
      navigator.clipboard.writeText(allCVVs).then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
    }

    return (
      <div className="space-y-3">
        {!results || results.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            {t("cvv.noDataForStatus")}
            <div className="flex justify-center pt-4">
              <Button
                {...({ variant: "outline", size: "sm" } as any)}
                onClick={copyAllToClipboard}
                disabled={true}
                className="flex items-center gap-2 bg-transparent opacity-50"
              >
                <Copy className="h-4 w-4" />
                {t("cvv.copyAll")} (0 {t("cvv.items")})
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(results || []).map((result, index) => (
                <div key={result.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        status === "有效" || status === "valid"
                          ? "bg-green-500"
                          : status === "无效" || status === "invalid"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="font-mono text-sm">{result.cardNumber}</span>
                      <span className="font-mono text-xs text-gray-500">CVV: {result.cvv}</span>
                      <span className="font-mono text-xs text-gray-500">有效期: {result.expiry}</span>
                      {result.other && (
                        <span className="font-mono text-xs text-gray-500">其他: {result.other}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimestamp(result.detectionCompletedAt, 'full')}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <Button
                {...({ variant: "outline", size: "sm" } as any)}
                onClick={copyAllToClipboard}
                className="flex items-center gap-2 bg-transparent"
              >
                <Copy className="h-4 w-4" />
                {t("cvv.copyAll")} ({(results || []).length} {t("cvv.items")})
              </Button>
            </div>
          </>
        )}
      </div>
    )
  }

  if (isResultsPageLoading) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg font-medium text-gray-700">正在获取检测结果...</div>
            <div className="text-sm text-gray-500">请稍候，正在加载检测结果数据</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="relative bg-gradient-to-r from-indigo-600/10 to-purple-600/10 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              {t("cvv.detectionResults")}
            </CardTitle>
            
            {/* 时间信息 */}
            {detectionResults && (
              <div className="flex flex-col items-end text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">启动时间</span>
                    <span className="font-medium">
                      {formatTimestamp(detectionResults.detectionStartTime, 'full')}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">结束时间</span>
                    <span className="font-medium">
                      {formatTimestamp(detectionResults.detectionEndTime, 'full')}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">消耗时间</span>
                    <span className="font-medium text-indigo-600">
                      {detectionResults.detectionDuration}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative p-6">
          <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{t("cvv.totalConsumption")}</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {detectionResults && detectionResults.consumedCoins ? detectionResults.consumedCoins.toFixed(1) : '0.0'}
                </div>
                <div className="text-sm text-indigo-700 font-medium">{t("cvv.mCoins")}</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="valid" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white">
              <TabsTrigger value="valid" className="text-sm font-medium">
                {t("cvv.validTab")}
              </TabsTrigger>
              <TabsTrigger value="invalid" className="text-sm font-medium">
                {t("cvv.invalidTab")}
              </TabsTrigger>
              <TabsTrigger value="unknown" className="text-sm font-medium">
                {t("cvv.unknownTab")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="valid" className="mt-6">
              <ResultTable results={validResults} status={t("cvv.validStatus")} />
            </TabsContent>

            <TabsContent value="invalid" className="mt-6">
              <ResultTable results={invalidResults} status={t("cvv.invalidStatus")} />
            </TabsContent>

            <TabsContent value="unknown" className="mt-6">
              <ResultTable results={unknownResults} status={t("cvv.unknownStatus")} />
            </TabsContent>
          </Tabs>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">


        <Button
          {...({ variant: "outline", size: "lg" } as any)}
          onClick={handleResetDetection}
          disabled={isResetting}
          className="transition-all duration-300 hover:scale-105 bg-white hover:shadow-md overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResetting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              重置中...
            </div>
          ) : (
            t("cvv.retest")
          )}
        </Button>
      </div>


    </div>
  )
}