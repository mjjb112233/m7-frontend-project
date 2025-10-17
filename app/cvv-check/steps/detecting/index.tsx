import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Square, TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCVVCheckAPI } from "@/lib/api"
import { DetectionStatus, ConnectionStatus, Channel } from "../../types"

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

  // 组件内部状态管理
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    currentCVV: "",
    processedCount: 0,
    totalCount: 100,
    validCount: 0,
    invalidCount: 0,
    unknownCount: 0,
    isRunning: true,
    detectingCVVs: []
  })
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    backend: "connected",
    frontend: "connected",
    lastHeartbeat: null
  })
  const [detectionProgress, setDetectionProgress] = useState<any>(null)
  const [checkData, setCheckData] = useState<any[]>([])
  const [isDetectingPageLoading, setIsDetectingPageLoading] = useState(true)
  const [isStoppingDetection, setIsStoppingDetection] = useState(false)
  const [stopButtonDisabled, setStopButtonDisabled] = useState(false)
  const [stopButtonCountdown, setStopButtonCountdown] = useState(0)
  const [stopAlertData, setStopAlertData] = useState<any>(null)
  const [showStopSuccessAlert, setShowStopSuccessAlert] = useState(false)
  const [showStopErrorAlert, setShowStopErrorAlert] = useState(false)
  
  // 控制定时器的状态 - 只有在这个页面时才轮询
  const [shouldPoll, setShouldPoll] = useState(true)
  
  // 用于动态显示检测时间的状态
  const [currentTime, setCurrentTime] = useState(Date.now())

  // 计算检测时间间隔的函数
  const calculateElapsedTime = (startTime: number) => {
    const elapsed = Math.floor((currentTime - startTime * 1000) / 1000) // 转换为秒
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // 停止检测逻辑
  const handleStopDetection = async () => {
    if (!localDetectionUuid) return

    try {
      setIsStoppingDetection(true)
      setStopButtonDisabled(true)
      
      console.log("[DetectingStep] 开始停止检测...")
      
      // 调用停止检测 API
      const result = await api.stopDetection(localDetectionUuid)
      
      if (result && (result as any).success === true) {
        console.log("[DetectingStep] Stop detection request successful, getting progress immediately")
        
        // 立即发送检测进度请求
        const progressResult = await api.fetchDetectionProgress(localDetectionUuid)
        
        if (progressResult) {
          console.log("[DetectingStep] 获取检测进度成功:", progressResult)
          
          // 根据检测进度响应控制跳转
          const status = (progressResult as any).status
          if (status === 'completed' || status === 'error') {
            console.log("[DetectingStep] Detection stopped, notifying parent component to jump to results page")
            setShouldPoll(false) // 停止轮询
            onDetectionComplete() // 通知父组件跳转到结果页面
          } else {
            console.log("[DetectingStep] 检测仍在进行中，显示错误提示")
            // 检测仍在进行，显示错误提示
            setStopAlertData({ message: "停止检测请求已发送，但检测仍在进行中" })
            setShowStopErrorAlert(true)
            startStopButtonCountdown()
          }
        } else {
          console.log("[DetectingStep] 获取检测进度失败，显示停止成功提示")
          setStopAlertData(result)
          setShowStopSuccessAlert(true)
        }
      } else {
        console.log("[DetectingStep] Stop detection failed, response:", result)
        setStopAlertData({ message: (result as any)?.message || "Stop detection failed" })
        setShowStopErrorAlert(true)
        startStopButtonCountdown()
      }
    } catch (error) {
      console.error("[DetectingStep] 停止检测错误:", error)
      setStopAlertData({ message: "网络错误，请稍后重试" })
      setShowStopErrorAlert(true)
      startStopButtonCountdown()
    } finally {
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
        setDetectionProgress(result)
        
        const status = (result as any).status
        
        // 更新检测状态
        setDetectionStatus(prev => ({
          ...prev,
          currentCVV: (result as any).currentCVV || "",
          processedCount: (result as any).completedCVVs || 0, // 使用 completedCVVs 而不是 processedCount
          totalCount: (result as any).totalCVVs || 100, // 使用 totalCVVs 而不是 totalCount
          validCount: (result as any).validCount || 0,
          invalidCount: (result as any).invalidCount || 0,
          unknownCount: (result as any).unknownCount || 0,
          isRunning: status === 'detecting',
          detectingCVVs: (result as any).detectingCVVs || []
        }))

        // 更新检测数据
        if ((result as any).checkData) {
          setCheckData((result as any).checkData)
        }

        // 更新连接状态
        if ((result as any).systemStatus) {
          setConnectionStatus({
            backend: (result as any).systemStatus.detectionService === 'online' ? 'connected' : 'disconnected',
            frontend: (result as any).systemStatus.channel === 'online' ? 'connected' : 'disconnected',
            lastHeartbeat: new Date()
          })
        }

        // 检查系统状态
        const systemStatus = (result as any).systemStatus
        if (systemStatus) {
          const detectionService = systemStatus.detectionService
          const channel = systemStatus.channel
          
          // 如果检测服务或通道停止，提示用户跳转到结果页面
          if (detectionService !== 'running' || channel !== 'active') {
            console.log("[DetectingStep] System status abnormal:", {
              detectionService,
              channel
            })
            setShouldPoll(false) // 停止轮询
            onDetectionComplete() // 通知父组件跳转到结果页面
            return
          }
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

    console.log("[DetectingStep] 启动定时器，开始轮询检测进度")
    const interval = setInterval(() => {
      if (shouldPoll) {
        fetchDetectionProgress()
      }
    }, 2000) // 每2秒获取一次进度

    return () => {
      console.log("[DetectingStep] 停止定时器")
      clearInterval(interval)
    }
  }, [localDetectionUuid, shouldPoll])

  // 定时更新当前时间，用于动态显示检测时间
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000) // 每秒更新一次

    return () => {
      clearInterval(timeInterval)
    }
  }, [])

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
            <div className="text-lg font-medium text-gray-700">正在获取检测进度...</div>
            <div className="text-sm text-gray-500">请稍候，正在加载检测数据</div>
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
              <CardDescription className="text-sm text-gray-600">
                {t("cvv.usingMode")}
              </CardDescription>
            </div>
            {detectionStatus.isRunning && (
              <Button
                onClick={handleStopDetection}
                {...({ variant: "destructive", size: "sm" } as any)}
                disabled={stopButtonDisabled || isStoppingDetection}
                className="ml-4 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Square className="h-4 w-4 mr-2" />
                {isStoppingDetection ? "停止中..." : 
                 stopButtonCountdown > 0 ? `重试 (${stopButtonCountdown}s)` : 
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
                <Badge {...({ variant: connectionStatus.backend === "connected" ? "default" : "destructive" } as any)}>
                  {connectionStatus.backend === "connected" ? t("cvv.statusOnline") : t("cvv.statusOffline")}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <span className="text-sm font-medium">{t("cvv.channelStatus")}</span>
                <Badge {...({ variant: selectedChannel?.status === "online" ? "default" : "secondary" } as any)}>
                  {selectedChannel?.status === "online" ? t("cvv.statusOnline") : t("cvv.statusBusy")}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <span className="text-sm font-medium">同时检测用户</span>
                <Badge {...({ variant: "default" } as any)}>{detectionProgress?.systemStatus?.concurrentUsers || 0} 人</Badge>
              </div>
            </div>
          </div>

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="text-2xl font-bold text-green-600">{detectionStatus.validCount}</div>
              <div className="text-sm text-green-700 font-medium">{t("cvv.valid")}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="text-2xl font-bold text-red-600">{detectionStatus.invalidCount}</div>
              <div className="text-sm text-red-700 font-medium">{t("cvv.invalid")}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="text-2xl font-bold text-yellow-600">{detectionStatus.unknownCount}</div>
              <div className="text-sm text-yellow-700 font-medium">{t("cvv.unknown")}</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="text-2xl font-bold text-blue-600">
                {detectionProgress?.consumedMCoins || "0.0"}
              </div>
              <div className="text-sm text-blue-700 font-medium">{t("cvv.consumedMCoin")}</div>
            </div>
          </div>

          {/* 检测数据展示 */}
          {checkData.length > 0 && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                正在检测的卡片
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {checkData
                  .sort((a: any, b: any) => {
                    // 按检测时间间隔从短到长排序
                    const timeA = currentTime - a.startTime * 1000
                    const timeB = currentTime - b.startTime * 1000
                    return timeA - timeB
                  })
                  .map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-blue-600">{item.cardNumber}</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div className="text-xs text-gray-500">Detecting</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      {calculateElapsedTime(item.startTime)}
                    </div>
                  </div>
                ))}
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
