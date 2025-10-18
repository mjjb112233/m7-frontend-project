import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { TrendingUp, Copy } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
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
  const { refreshUserInfo } = useAuth()
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
        
        // 刷新用户信息以获取最新的M币余额
        await refreshUserInfo()

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

    const copyCardToClipboard = (result: CVVResult) => {
      const cardInfo = `${result.cardNumber}|${result.cvv}|${result.expiry}${result.other ? `|${result.other}` : ''}`
      navigator.clipboard.writeText(cardInfo).then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      })
    }

    return (
      <div className="flex flex-col h-96">
        {/* 固定高度的数据展示区域 */}
        <div className="flex-1 min-h-0">
          {!results || results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              {t("cvv.noDataForStatus")}
            </div>
          ) : (
            <div className="space-y-2 h-full overflow-y-auto pr-2">
              {(results || []).map((result, index) => (
                <div key={result.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border hover:shadow-sm transition-shadow">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      status === "有效" || status === "valid"
                        ? "bg-green-500"
                        : status === "无效" || status === "invalid"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-medium text-gray-900 truncate">
                      {result.cardNumber}
                    </div>
                  </div>
                  <div className="flex-shrink-0 font-mono text-xs text-gray-600">
                    CVV: {result.cvv}
                  </div>
                  <div className="flex-shrink-0 font-mono text-xs text-gray-600">
                    {result.expiry}
                  </div>
                  {result.other && (
                    <div className="flex-shrink-0 font-mono text-xs text-gray-500 max-w-20 truncate" title={result.other}>
                      {result.other}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCardToClipboard(result)}
                    className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-100"
                    title="复制卡片信息"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* 固定在底部的复制按钮 */}
        <div className="flex-shrink-0 pt-4 border-t border-gray-100">
          <div className="flex justify-center">
            <Button
              {...({ variant: "outline", size: "sm" } as any)}
              onClick={copyAllToClipboard}
              disabled={!results || results.length === 0}
              className="flex items-center gap-2 bg-transparent"
            >
              <Copy className="h-4 w-4" />
              {t("cvv.copyAll")} ({(results || []).length} {t("cvv.items")})
            </Button>
          </div>
        </div>
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
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            {t("cvv.detectionResults")}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 左侧：总消耗信息 */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative space-y-4">
                  {/* 主要消耗信息 */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3">
                      <span className="text-white text-xl font-bold">M</span>
                    </div>
                    <div className="text-sm font-medium text-gray-600 mb-1">{t("cvv.totalConsumption")}</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {detectionResults && detectionResults.consumedCoins ? detectionResults.consumedCoins.toFixed(1) : '0.0'}
                    </div>
                    <div className="text-sm text-indigo-700 font-semibold">{t("cvv.mCoins")}</div>
                  </div>
                  
                  {/* 任务ID */}
                  {detectionId && (
                    <div className="bg-white/70 rounded-lg p-3 border border-indigo-100">
                      <div className="text-xs text-gray-500 mb-2 text-center">任务ID</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-mono text-gray-700 flex-1 break-all text-center">
                          {detectionId}
                        </div>
                        <button
                          onClick={() => copyToClipboard(detectionId)}
                          className="flex-shrink-0 w-6 h-6 bg-indigo-100 hover:bg-indigo-200 rounded flex items-center justify-center transition-colors duration-200 group"
                          title="复制任务ID"
                        >
                          <Copy className="w-3 h-3 text-indigo-600 group-hover:text-indigo-700" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 时间信息 */}
                  {detectionResults && (
                    <div className="space-y-3 pt-4 border-t border-indigo-100">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">启动时间</div>
                        <div className="text-sm font-medium text-gray-700">
                          {formatTimestamp(detectionResults.detectionStartTime, 'full')}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">结束时间</div>
                        <div className="text-sm font-medium text-gray-700">
                          {formatTimestamp(detectionResults.detectionEndTime, 'full')}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">消耗时间</div>
                        <div className="text-sm font-medium text-indigo-600 font-semibold">
                          {detectionResults.detectionDuration}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧：显示卡信息区域 */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="valid" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
              <TabsTrigger 
                value="valid" 
                className="text-sm font-medium data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:border-green-200 hover:bg-green-50 transition-colors duration-200"
              >
                {t("cvv.validTab")}
              </TabsTrigger>
              <TabsTrigger 
                value="invalid" 
                className="text-sm font-medium data-[state=active]:bg-red-100 data-[state=active]:text-red-700 data-[state=active]:border-red-200 hover:bg-red-50 transition-colors duration-200"
              >
                {t("cvv.invalidTab")}
              </TabsTrigger>
              <TabsTrigger 
                value="unknown" 
                className="text-sm font-medium data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 data-[state=active]:border-yellow-200 hover:bg-yellow-50 transition-colors duration-200"
              >
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
            </div>
          </div>
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