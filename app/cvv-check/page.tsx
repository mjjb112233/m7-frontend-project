"use client"

import { useEffect } from "react"
import { AuthGuard } from "@/components/layout/auth-guard"
import Header from "@/components/layout/header"
import { CVVCheckFooter } from "@/components/layout/cvv-check-footer"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useCVVDetection } from "./hooks/useCVVDetection"
import { useCVVCheckAPI } from "@/lib/api"
import { getCVVCheckConfig } from "@/lib/config/index"
import { 
  InputStep,
  PrecheckStep,
  DetectingStep,
  ResultsStep,
  DetectingPrompt,
  CompletedPrompt
} from "./steps"
import { ConfigStepV2 } from "./steps/config/ConfigStepV2"
import { 
  StatusAlert,
  ErrorAlert,
  StepIndicator
} from "./shared"
import { CreditCard, CheckCircle, X } from "lucide-react"

export default function CVVCheckPage() {
  const { t } = useLanguage()

  return (
    <AuthGuard requiredLevel={1}>
      <CVVCheckContent />
    </AuthGuard>
  )
}

function CVVCheckContent() {
  const { t } = useLanguage()
  const { token } = useAuth()
  
  // 使用自定义hooks
  const detectionState = useCVVDetection()
  const api = useCVVCheckAPI()

  // 解构状态
  const {
    currentStep,
    setCurrentStep,
    userDetectionStatus,
    setUserDetectionStatus,
    selectedMode,
    setSelectedMode,
    selectedChannel,
    setSelectedChannel,
    inputText,
    setInputText,
    precheckResults,
    setPrecheckResults,
    detectionStatus,
    setDetectionStatus,
    connectionStatus,
    setConnectionStatus,
    localDetectionUuid,
    setLocalDetectionUuid,
    progressTimer,
    setProgressTimer,
    showStatusAlert,
    setShowStatusAlert,
    statusAlertMessage,
    setStatusAlertMessage,
    statusAlertType,
    setStatusAlertType,
    showErrorAlert,
    setShowErrorAlert,
    errorMessage,
    setErrorMessage,
    errorType,
    setErrorType,
    errorData,
    setErrorData,
    showSystemErrorAlert,
    setShowSystemErrorAlert,
    systemErrorMessage,
    setSystemErrorMessage,
    showStopSuccessAlert,
    setShowStopSuccessAlert,
    showStopErrorAlert,
    setShowStopErrorAlert,
    stopAlertData,
    setStopAlertData,
    isStoppingDetection,
    setIsStoppingDetection,
    stopButtonDisabled,
    setStopButtonDisabled,
    stopButtonCountdown,
    setStopButtonCountdown,
    detectionResults,
    setDetectionResults,
    isLoadingResults,
    setIsLoadingResults,
    showNotification,
    setShowNotification,
    notificationMessage,
    setNotificationMessage,
    notificationType,
    setNotificationType,
    copySuccess,
    setCopySuccess,
    autoStopEnabled,
    setAutoStopEnabled,
    validStopCount,
    setValidStopCount,
    autoStopCount,
    setAutoStopCount,
    isDetectingPageLoading,
    setIsDetectingPageLoading,
    isResultsPageLoading,
  } = detectionState

  // 页面初始化
  useEffect(() => {
    if (token) {
      console.log("[v0] 页面初始化，开始获取用户状态，token:", token.substring(0, 10) + "...")
      fetchUserDetectionStatus()
        .then(() => {
          console.log("[v0] 页面初始化完成")
        })
        .catch((error) => {
          console.error("[v0] 页面初始化失败:", error)
        })
    }
  }, [token])

  // 页面卸载时清理所有定时器
  useEffect(() => {
    return () => {
      console.log("[CVV] 页面卸载，清理所有定时器")
      if (progressTimer) {
        clearInterval(progressTimer)
        console.log("[CVV] 已清理 progressTimer")
      }
    }
  }, [progressTimer])


  /**
   * 获取用户检测状态
   * 这是页面初始化的核心函数，负责获取用户当前的检测状态并设置相应的页面状态
   * 根据不同的状态，页面会跳转到不同的步骤或提示页面
   */
  const fetchUserDetectionStatus = async () => {
    // 调用API获取用户检测状态
    const result = await api.fetchUserDetectionStatus()
    
    // 如果API调用成功，处理返回的状态数据
    if (result) {
      // 设置用户检测状态（未检测/检测中/已完成）
      setUserDetectionStatus(result.status)
      
      // 如果存在检测ID，保存到本地状态中
      // 这个ID用于后续的检测进度查询和结果获取
      if (result.detectionId) {
        setLocalDetectionUuid(result.detectionId)
      }
      
      // 根据用户状态设置页面显示内容
      if (result.status === 'detecting') {
        // 用户正在检测中，显示检测进度提示页面
        setCurrentStep("detecting-prompt")
        
        // 初始化检测状态数据，为显示检测进度做准备
        setDetectionStatus({
          currentCVV: "",           // 当前正在检测的CVV
          processedCount: 0,       // 已处理的CVV数量
          totalCount: 100,         // 总CVV数量（默认值，实际值从API获取）
          validCount: 0,           // 有效CVV数量
          invalidCount: 0,         // 无效CVV数量
          unknownCount: 0,         // 未知状态CVV数量
          isRunning: true,         // 标记检测正在运行
        })
      } else if (result.status === 'completed') {
        // 用户检测已完成，显示完成提示页面
        setCurrentStep("completed-prompt")
      } else if (result.status === 'idle') {
        // 用户未开始检测，直接进入配置步骤
        // 配置获取由 ConfigStepV2 组件自主处理
        setCurrentStep("config")
      }
    }
  }

  // 获取检测配置 - 已移除，由 ConfigStepV2 组件自主处理

  // 处理预检测结果
  const handlePrecheckResults = (precheckResults: { valid: string[]; invalid: string[] }) => {
    setPrecheckResults(precheckResults)
    setCurrentStep("precheck")
  }

  // 启动检测 - 现在由预检测组件处理
  const handleStartDetection = async () => {
    // 这个函数现在由预检测组件自己处理
    // 保留这个函数是为了向后兼容，但实际逻辑已移动到预检测组件
  }

  // 停止检测
  const stopDetection = async () => {
    if (!token || !localDetectionUuid) return

    try {
      setIsStoppingDetection(true)
      setStopButtonDisabled(true)
      
      // 获取配置
      const cvvConfig = getCVVCheckConfig()
      const cancelStatusPollInterval = cvvConfig.cancelStatusPollInterval * 1000 // 转换为毫秒
      
      // 调用停止检测 API
      const result = await api.stopDetection(localDetectionUuid)
      
      if (result) {
        console.log("[CVV] Stop detection request successful, starting to poll cancel-status")
        
        // 开始轮询 cancel-status 接口
        const maxPollAttempts = 60 // 最大轮询次数（60秒，每次3秒）
        let pollAttempts = 0
        
        const pollCancelStatus = async (): Promise<void> => {
          try {
            const cancelStatus = await api.fetchCancelStatus(localDetectionUuid)
            
            if (cancelStatus) {
              console.log("[CVV] Cancel status:", cancelStatus)
              
              if (cancelStatus.status === 'completed') {
                console.log("[CVV] 停止完成，跳转到结果页面")
                setCurrentStep("results")
                setIsStoppingDetection(false)
                return
              }
            }
            
            // 如果未完成，继续轮询
            pollAttempts++
            if (pollAttempts >= maxPollAttempts) {
              console.log("[CVV] 轮询超时，直接跳转到结果页面")
              setCurrentStep("results")
              setIsStoppingDetection(false)
              return
            }
            
            // 继续下一次轮询
            setTimeout(pollCancelStatus, cancelStatusPollInterval)
          } catch (error) {
            console.error("[CVV] 轮询 cancel-status 失败:", error)
            // 轮询出错时，也跳转到结果页面
            setCurrentStep("results")
            setIsStoppingDetection(false)
          }
        }
        
        // 开始第一次轮询（延迟一点，给后端处理时间）
        setTimeout(pollCancelStatus, cancelStatusPollInterval)
      } else {
        setStopAlertData({ message: "Failed to stop detection" })
        setShowStopErrorAlert(true)
        startStopButtonCountdown()
        setIsStoppingDetection(false)
      }
    } catch (error) {
      console.error("Error stopping detection:", error)
      setStopAlertData({ message: "Network error, please try again later" })
      setShowStopErrorAlert(true)
      startStopButtonCountdown()
      setIsStoppingDetection(false)
    }
  }

  // 启动停止按钮倒计时
  const startStopButtonCountdown = () => {
    setStopButtonCountdown(10)
    setStopButtonDisabled(true)
    
    const interval = setInterval(() => {
      setStopButtonCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setStopButtonDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 处理状态提示框
  const handleStatusAlert = (action: 'view' | 'dismiss') => {
    setShowStatusAlert(false)
    if (action === 'view') {
      if (userDetectionStatus === 'detecting') {
        setCurrentStep('detecting')
      } else if (userDetectionStatus === 'completed') {
        if (progressTimer) {
          clearInterval(progressTimer)
          setProgressTimer(null)
        }
        setCurrentStep('results')
      }
    }
  }

  // 处理错误提示框
  const handleErrorAlert = (action: 'recharge' | 'retry' | 'dismiss') => {
    setShowErrorAlert(false)
    if (action === 'recharge') {
      // 跳转到充值页面
    } else if (action === 'retry') {
      handleStartDetection()
    } else if (action === 'dismiss') {
      setCurrentStep('precheck')
    }
  }

  // 处理系统错误提示框
  const handleSystemErrorAlert = (action: 'view_results' | 'dismiss') => {
    setShowSystemErrorAlert(false)
    if (action === 'view_results') {
      if (progressTimer) {
        clearInterval(progressTimer)
        setProgressTimer(null)
      }
      setCurrentStep('results')
    } else if (action === 'dismiss') {
      setCurrentStep('precheck')
    }
  }

  // 处理停止检测成功提示框
  const handleStopSuccessAlert = (action: 'view_results' | 'dismiss') => {
    setShowStopSuccessAlert(false)
    if (action === 'view_results') {
      if (progressTimer) {
        clearInterval(progressTimer)
        setProgressTimer(null)
      }
      setCurrentStep('results')
    } else if (action === 'dismiss') {
      setCurrentStep('precheck')
    }
  }

  // 处理停止检测失败提示框
  const handleStopErrorAlert = (action: 'retry' | 'dismiss') => {
    setShowStopErrorAlert(false)
    if (action === 'retry') {
      stopDetection()
    } else if (action === 'dismiss') {
      setCurrentStep('detecting')
    }
  }

  // 显示通知函数
  const showNotificationMessage = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  // 从新的数据格式中获取分类结果
  const validResults = detectionResults?.validResults || []
  const invalidResults = detectionResults?.invalidResults || []
  const unknownResults = detectionResults?.unknownResults || []



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* 状态提示框 */}
      <StatusAlert
        show={showStatusAlert}
        type={statusAlertType}
        message={statusAlertMessage}
        onView={() => handleStatusAlert('view')}
        onDismiss={() => handleStatusAlert('dismiss')}
        userDetectionStatus={userDetectionStatus}
      />

      {/* 错误提示框 */}
      <ErrorAlert
        show={showErrorAlert}
        errorType={errorType}
        errorMessage={errorMessage}
        errorData={errorData}
        onRecharge={() => handleErrorAlert('recharge')}
        onRetry={() => handleErrorAlert('retry')}
        onDismiss={() => handleErrorAlert('dismiss')}
      />

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t("cvv.title")}</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">{t("cvv.subtitle")}</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        {/* 配置步骤 */}
        {userDetectionStatus === "idle" && currentStep === "config" && (
          <ConfigStepV2
            onNext={() => setCurrentStep("input")}
            onConfigSelected={(config) => {
              console.log("[CVV] 配置已选择:", config)
              // 保存选择的配置到页面状态
              setSelectedMode(config.mode)
              setSelectedChannel(config.channel)
            }}
          />
        )}

        {/* 输入步骤 */}
        {currentStep === "input" && (
          <InputStep
            inputText={inputText}
            setInputText={setInputText}
            selectedMode={selectedMode}
            selectedChannel={selectedChannel}
            onPrevious={() => setCurrentStep("config")}
            onNext={handlePrecheckResults}
          />
        )}

        {/* 预检测步骤 */}
        {currentStep === "precheck" && (
          <PrecheckStep
            precheckResults={precheckResults}
            selectedChannel={selectedChannel}
            autoStopCount={autoStopCount}
            setAutoStopCount={setAutoStopCount}
            validStopCount={validStopCount}
            setValidStopCount={setValidStopCount}
            autoStopEnabled={autoStopEnabled}
            setAutoStopEnabled={setAutoStopEnabled}
            selectedMode={selectedMode}
            setLocalDetectionUuid={setLocalDetectionUuid}
            setUserDetectionStatus={setUserDetectionStatus}
            onPrevious={() => {
              setPrecheckResults({ valid: [], invalid: [] })
              setCurrentStep("input")
            }}
            onNext={() => {
              setCurrentStep("detecting")
            }}
          />
        )}

        {/* 检测中步骤 */}
        {currentStep === "detecting" && (
          <DetectingStep
            localDetectionUuid={localDetectionUuid}
            selectedChannel={selectedChannel}
            autoStopCount={autoStopCount}
            onDetectionComplete={() => {
              console.log("[CVV] Detection completed, jumping to results page")
              setCurrentStep("results")
            }}
          />
        )}

        {/* 检测提示步骤 */}
        {currentStep === "detecting-prompt" && (
          <DetectingPrompt
            onViewProgress={() => setCurrentStep("detecting")}
            isLoadingProgress={false}
          />
        )}

        {/* 完成提示步骤 */}
        {currentStep === "completed-prompt" && (
          <CompletedPrompt
            onViewResults={() => setCurrentStep("results")}
            isLoadingResult={false}
          />
        )}

        {/* 结果步骤 */}
        {currentStep === "results" && (
          <ResultsStep
            detectionId={localDetectionUuid}
            onRetest={() => {
                  setCurrentStep("config")
                  setPrecheckResults({ valid: [], invalid: [] })
              setInputText("")

                  setUserDetectionStatus("idle")
                }}
            copySuccess={copySuccess}
            setCopySuccess={setCopySuccess}
          />
            )}
          </div>

      {/* 复制成功提示 */}
      {copySuccess && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="h-3 w-3" />
          {t("common.success")}
        </div>
      )}

      {/* 通用通知组件 */}
      {showNotification && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 max-w-md ${
          notificationType === 'success' ? 'bg-green-500 text-white' :
          notificationType === 'error' ? 'bg-red-500 text-white' :
          notificationType === 'warning' ? 'bg-yellow-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <span className="flex-1">{notificationMessage}</span>
          <button 
            onClick={() => setShowNotification(false)}
            className="ml-2 hover:opacity-80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <CVVCheckFooter />
    </div>
  )
}
