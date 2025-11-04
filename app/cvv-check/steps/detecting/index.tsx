import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Square, TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCVVCheckAPI } from "@/lib/api"
import { getCVVCheckConfig } from "@/lib/config/index"
import { DetectionStatus, ConnectionStatus, Channel, DetectionProgressResponse } from "../../types"

interface DetectingStepProps {
  localDetectionUuid: string
  selectedChannel: Channel | null
  autoStopCount: string
  onDetectionComplete: () => void // 检测完成时的回调
}

export function DetectingStep({
  localDetectionUuid,
  selectedChannel,
  autoStopCount,
  onDetectionComplete
}: DetectingStepProps) {
  const { t } = useLanguage()
  const api = useCVVCheckAPI()

  // 获取配置
  const cvvConfig = getCVVCheckConfig()
  const progressPollInterval = cvvConfig.detectionProgressPollInterval * 1000 // 转换为毫秒
  const cancelStatusPollInterval = cvvConfig.cancelStatusPollInterval * 1000 // 转换为毫秒

  // 组件内部状态管理
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    currentCVV: "",
    processedCount: 0,
    totalCount: 100,
    validCount: 0,
    invalidCount: 0,
    unknownCount: 0,
    isRunning: true,
  })
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    backend: "connected",
    frontend: "connected",
    lastHeartbeat: null
  })
  const [detectionProgress, setDetectionProgress] = useState<DetectionProgressResponse | null>(null)
  const [isDetectingPageLoading, setIsDetectingPageLoading] = useState(true)
  const [isStoppingDetection, setIsStoppingDetection] = useState(false)
  const [stopButtonDisabled, setStopButtonDisabled] = useState(false)
  const [stopButtonCountdown, setStopButtonCountdown] = useState(0)
  const [stopAlertData, setStopAlertData] = useState<any>(null)
  const [showStopSuccessAlert, setShowStopSuccessAlert] = useState(false)
  const [showStopErrorAlert, setShowStopErrorAlert] = useState(false)
  const [isWaitingForCancel, setIsWaitingForCancel] = useState(false) // 正在等待停止完成
  
  // 控制定时器的状态 - 只有在这个页面时才轮询
  const [shouldPoll, setShouldPoll] = useState(true)

  // 停止检测逻辑
  const handleStopDetection = async () => {
    if (!localDetectionUuid) return

    try {
      setIsStoppingDetection(true)
      setStopButtonDisabled(true)
      
      console.log("[DetectingStep] 开始停止检测...")
      
      // 调用停止检测 API
      const result = await api.stopDetection(localDetectionUuid)
      
      if (result) {
        console.log("[DetectingStep] Stop detection request successful, starting to poll cancel-status")
        setIsWaitingForCancel(true)
        setShouldPoll(false) // 停止进度轮询
        
        // 开始轮询 cancel-status 接口
        const maxPollAttempts = 60 // 最大轮询次数（60秒，每次3秒）
        let pollAttempts = 0
        
        const pollCancelStatus = async (): Promise<void> => {
          try {
            const cancelStatus = await api.fetchCancelStatus(localDetectionUuid)
            
            if (cancelStatus) {
              console.log("[DetectingStep] Cancel status:", cancelStatus)
              
              if (cancelStatus.status === 'completed') {
                console.log("[DetectingStep] 停止完成，跳转到结果页面")
                setIsWaitingForCancel(false)
                onDetectionComplete() // 通知父组件跳转到结果页面
                return
              }
            }
            
            // 如果未完成，继续轮询
            pollAttempts++
            if (pollAttempts >= maxPollAttempts) {
              console.log("[DetectingStep] 轮询超时，直接跳转到结果页面")
              setIsWaitingForCancel(false)
              onDetectionComplete() // 超时后也跳转到结果页面
              return
            }
            
            // 继续下一次轮询
            setTimeout(pollCancelStatus, cancelStatusPollInterval)
          } catch (error) {
            console.error("[DetectingStep] 轮询 cancel-status 失败:", error)
            // 轮询出错时，也跳转到结果页面
            setIsWaitingForCancel(false)
            onDetectionComplete()
          }
        }
        
        // 开始第一次轮询（延迟一点，给后端处理时间）
        setTimeout(pollCancelStatus, cancelStatusPollInterval)
      } else {
        console.log("[DetectingStep] Stop detection failed, response:", result)
        setStopAlertData({ message: t("cvv.stopRequestFailed") })
        setShowStopErrorAlert(true)
        startStopButtonCountdown()
        setIsStoppingDetection(false)
      }
    } catch (error) {
      console.error("[DetectingStep] 停止检测错误:", error)
      setStopAlertData({ message: t("cvv.networkError") })
      setShowStopErrorAlert(true)
      startStopButtonCountdown()
      setIsStoppingDetection(false)
    }
  }

  // 启动停止按钮倒计时
  const startStopButtonCountdown = () => {
    setStopButtonCountdown(10)
    setStopButtonDisabled(true)
    
    const countdown = setInterval(() => {
      setStopButtonCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdown)
          setStopButtonDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 获取检测进度数据
  const fetchDetectionProgress = async () => {
    if (!localDetectionUuid) return

    try {
      console.log("[DetectingStep] 获取检测进度...")
      const result = await api.fetchDetectionProgress(localDetectionUuid)
      if (result) {
        console.log("[DetectingStep] 检测进度获取成功:", result)
        const progressData = result as DetectionProgressResponse
        setDetectionProgress(progressData)
        
        const status = progressData.status
        
        // 更新检测状态 - 使用API响应中的字段名
        setDetectionStatus(prev => ({
          ...prev,
          currentCVV: "",
          processedCount: progressData.processed || 0,
          totalCount: progressData.total || 100,
          validCount: progressData.validCount || 0,
          invalidCount: progressData.invalidCount || 0,
          unknownCount: progressData.unknownCount || 0,
          isRunning: status === 'detecting',
        }))

        // 更新连接状态 - 使用新的API字段
        if (progressData.serviceStatus && progressData.channelStatus) {
          setConnectionStatus({
            backend: progressData.serviceStatus === '在线' ? 'connected' : 'disconnected',
            frontend: progressData.channelStatus === '在线' ? 'connected' : 'disconnected',
            lastHeartbeat: new Date()
          })
        }

        // 根据后端返回的状态判断是否跳转到结果页面
        if (status === 'completed') {
          console.log("[DetectingStep] 检测已完成，准备跳转到结果页面")
          setShouldPoll(false) // 停止轮询
          onDetectionComplete() // 通知父组件跳转到结果页面
        } else if (status === 'error') {
          console.log("[DetectingStep] 检测出现错误")
          setShouldPoll(false) // 停止轮询
          onDetectionComplete() // 通知父组件跳转到结果页面
        }
      }
    } catch (error) {
      console.error("[DetectingStep] 获取检测进度失败:", error)
    } finally {
      setIsDetectingPageLoading(false)
    }
  }

  // 组件挂载时获取数据
  useEffect(() => {
    fetchDetectionProgress()
  }, [localDetectionUuid])

  // 定时获取检测进度 - 只要有检测ID就轮询
  useEffect(() => {
    if (!localDetectionUuid || !shouldPoll) {
      console.log("[DetectingStep] 不满足条件，不启动定时器", {
        hasUuid: !!localDetectionUuid,
        shouldPoll
      })
      return
    }

    console.log("[DetectingStep] 启动定时器，开始轮询检测进度，间隔:", progressPollInterval, "ms")
    const interval = setInterval(() => {
      if (shouldPoll) {
        fetchDetectionProgress()
      }
    }, progressPollInterval) // 使用配置的轮询间隔

    return () => {
      console.log("[DetectingStep] 停止定时器")
      clearInterval(interval)
    }
  }, [localDetectionUuid, shouldPoll])


  // 组件卸载时清理所有定时器和状态
  useEffect(() => {
    return () => {
      console.log("[DetectingStep] 组件卸载，停止轮询并清理所有资源")
      setShouldPoll(false) // 停止轮询
      // 这里可以添加其他清理逻辑，比如取消正在进行的请求
    }
  }, [])

  // 检测状态变化时更新UI，但不影响轮询
  // 轮询会持续获取最新状态，包括检测完成的情况

  const formatElapsedTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (isDetectingPageLoading) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg font-medium text-gray-700">{t("cvv.loadingProgress")}</div>
            <div className="text-sm text-gray-500">{t("cvv.loadingProgressDesc")}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="relative bg-gradient-to-r from-orange-600/10 to-red-600/10 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                {t("cvv.detectionProgress")}
              </CardTitle>
            </div>
            {detectionStatus.isRunning && (
              <Button
                onClick={handleStopDetection}
                {...({ variant: "destructive", size: "sm" } as any)}
                disabled={stopButtonDisabled || isStoppingDetection || isWaitingForCancel}
                className="ml-4 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square className="h-4 w-4 mr-2" />
                {isWaitingForCancel ? t("cvv.waitingForCancel") :
                 isStoppingDetection ? t("cvv.stopping") : 
                 stopButtonCountdown > 0 ? t("cvv.retryWithCountdown").replace("{count}", stopButtonCountdown.toString()) : 
                 t("cvv.stopDetection")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative space-y-6 p-6">
          {/* 系统状态区域 */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              {t("cvv.systemStatus")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <span className="text-sm font-medium">{t("cvv.detectionService")}</span>
                <Badge {...({ variant: detectionProgress?.serviceStatus === "在线" ? "default" : "destructive" } as any)}>
                  {detectionProgress?.serviceStatus || t("cvv.statusOffline")}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <span className="text-sm font-medium">{t("cvv.channelStatus")}</span>
                <Badge {...(() => {
                  const channelStatus = detectionProgress?.channelStatus || ""
                  if (channelStatus === "在线") {
                    return { variant: "default" } as any
                  } else if (channelStatus === "拥挤") {
                    return { variant: "secondary" } as any
                  } else if (channelStatus === "繁忙") {
                    return { variant: "destructive" } as any
                  } else {
                    return { variant: "destructive" } as any
                  }
                })()}>
                  {detectionProgress?.channelStatus === "在线" ? t("cvv.statusOnline") :
                   detectionProgress?.channelStatus === "拥挤" ? t("cvv.statusCrowded") :
                   detectionProgress?.channelStatus === "繁忙" ? t("cvv.statusBusy") :
                   t("cvv.statusOffline")}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <span className="text-sm font-medium">{t("cvv.channelUsers")}</span>
                <Badge {...({ variant: "default" } as any)}>{detectionProgress?.channelUserCount || 0} {t("cvv.people")}</Badge>
              </div>
            </div>
          </div>

          {/* 通道信息区域 */}
          {detectionProgress?.channelId && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                {t("cvv.channelInfo")}
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">{t("cvv.channelIdLabel")}</div>
                    <div className="text-sm font-medium text-gray-900">{t("cvv.channel")}{detectionProgress.channelId}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">{t("cvv.consumptionLabel")}</div>
                    <div className="text-sm font-medium text-indigo-600">
                      {detectionProgress.channelRate?.toFixed(4) || "0.0000"} {t("cvv.mCoins")}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">{t("cvv.speedLabel")}</div>
                    <div className="text-sm font-medium text-gray-900">{detectionProgress.channelSpeed || "-"}</div>
                  </div>
                  <div className="space-y-1 md:col-span-2 md:col-start-1">
                    <div className="text-xs text-gray-500">{t("cvv.description")}</div>
                    <div className="text-sm text-gray-700">{detectionProgress.channelDescription || "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 检测进度区域 */}

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-900">
              <span>{t("cvv.progress")}</span>
              <span>
                {detectionStatus.processedCount} / {detectionStatus.totalCount}
              </span>
            </div>
            <Progress
              value={(detectionStatus.processedCount / detectionStatus.totalCount) * 100}
              className="w-full h-3"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* 第一组：有效、无效、未知 - 用装饰条容器包裹，占3列 */}
            <div className="relative overflow-hidden border border-blue-200 bg-blue-50/80 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 col-span-3">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative p-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="text-2xl font-bold text-green-600">{detectionStatus.validCount}</div>
                    <div className="text-sm text-green-700 font-medium">{t("cvv.valid")}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="text-2xl font-bold text-red-600">{detectionStatus.invalidCount}</div>
                    <div className="text-sm text-red-700 font-medium">{t("cvv.invalid")}</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="text-2xl font-bold text-yellow-600">{detectionStatus.unknownCount}</div>
                    <div className="text-sm text-yellow-700 font-medium">{t("cvv.unknown")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 已消耗M币 - 用装饰条容器包裹，占1列 */}
            <div className="relative overflow-hidden border border-blue-200 bg-blue-50/80 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 col-span-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative p-4">
                <div className="text-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="text-2xl font-bold text-blue-600">
                    {detectionProgress?.totalConsumed?.toFixed(2) || "0.00"}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">{t("cvv.consumedMCoin")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 等待停止完成提示 */}
          {isWaitingForCancel && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-amber-800">
                <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white animate-pulse" />
                </div>
                <span className="text-sm font-medium">{t("cvv.waitingForCancel")}</span>
              </div>
            </div>
          )}

          {autoStopCount && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 text-amber-800">
                <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium">{t("cvv.autoStopSet")}</span>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
        </CardContent>
      </Card>
    </div>
  )
}
