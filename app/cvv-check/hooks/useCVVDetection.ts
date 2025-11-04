import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { authenticatedRequest } from "@/lib/api"
import { 
  CVVStep, 
  UserDetectionStatus, 
  DetectionStatus, 
  ConnectionStatus,
  DetectionProgressData,
  DetectionResultData,
  Channel,
  DetectionModeType,
  ErrorType,
  StatusAlertType,
  NotificationType,

} from "../types"

export function useCVVDetection() {
  const { token } = useAuth()
  
  // 主要状态
  const [currentStep, setCurrentStep] = useState<CVVStep>("config")
  const [userDetectionStatus, setUserDetectionStatus] = useState<UserDetectionStatus>("idle")
  // detectionConfig 已移除，由 ConfigStepV2 组件自主管理
  const [detectionProgressData, setDetectionProgressData] = useState<DetectionProgressData | null>(null)
  const [detectionResultData, setDetectionResultData] = useState<DetectionResultData | null>(null)
  
  // 加载状态
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  // isLoadingConfig 已移除，由 ConfigStepV2 组件自主管理
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)
  const [isLoadingResult, setIsLoadingResult] = useState(false)
  
  // 检测状态
  const [detectionStatus, setDetectionStatus] = useState<DetectionStatus>({
    currentCVV: "",
    processedCount: 0,
    totalCount: 0,
    validCount: 0,
    invalidCount: 0,
    unknownCount: 0,
    isRunning: false,
  })
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    backend: "disconnected",
    frontend: "connected",
    lastHeartbeat: null,
  })
  
  // 输入状态
  const [inputText, setInputText] = useState("")
  const [selectedMode, setSelectedMode] = useState<DetectionModeType>("charge_test")
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  
  // 预检测结果
  const [precheckResults, setPrecheckResults] = useState<{ valid: string[]; invalid: string[] }>({
    valid: [],
    invalid: [],
  })
  
  // 定时器状态
  const [progressTimer, setProgressTimer] = useState<NodeJS.Timeout | null>(null)
  const [localDetectionUuid, setLocalDetectionUuid] = useState("")
  
  // 错误和提示状态
  const [showStatusAlert, setShowStatusAlert] = useState(false)
  const [statusAlertMessage, setStatusAlertMessage] = useState("")
  const [statusAlertType, setStatusAlertType] = useState<StatusAlertType>("info")
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [errorType, setErrorType] = useState<ErrorType>("other")
  const [errorData, setErrorData] = useState<any>(null)
  const [showSystemErrorAlert, setShowSystemErrorAlert] = useState(false)
  const [systemErrorMessage, setSystemErrorMessage] = useState("")
  
  // 停止检测相关状态
  const [showStopSuccessAlert, setShowStopSuccessAlert] = useState(false)
  const [showStopErrorAlert, setShowStopErrorAlert] = useState(false)
  const [stopAlertData, setStopAlertData] = useState<any>(null)
  const [isStoppingDetection, setIsStoppingDetection] = useState(false)
  const [stopButtonDisabled, setStopButtonDisabled] = useState(false)
  const [stopButtonCountdown, setStopButtonCountdown] = useState(0)
  
  // 检测结果状态
  const [detectionResults, setDetectionResults] = useState<any>(null)
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  

  

  


  
  
  // 通知状态
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<NotificationType>("info")
  
  // 其他状态
  const [copySuccess, setCopySuccess] = useState(false)
  const [autoStopEnabled, setAutoStopEnabled] = useState<boolean>(false)
  const [validStopCount, setValidStopCount] = useState<number>(0)
  const [autoStopCount, setAutoStopCount] = useState<string>("")
  
  // 页面加载状态
  const [isDetectingPageLoading, setIsDetectingPageLoading] = useState(false)
  const [isResultsPageLoading, setIsResultsPageLoading] = useState(false)
  
  return useMemo(() => ({
    // 主要状态
    currentStep,
    setCurrentStep,
    userDetectionStatus,
    setUserDetectionStatus,
    detectionProgressData,
    setDetectionProgressData,
    detectionResultData,
    setDetectionResultData,
    
    // 加载状态
    isLoadingStatus,
    setIsLoadingStatus,
    isLoadingProgress,
    setIsLoadingProgress,
    isLoadingResult,
    setIsLoadingResult,
    
    // 检测状态
    detectionStatus,
    setDetectionStatus,
    connectionStatus,
    setConnectionStatus,
    
    // 输入状态
    inputText,
    setInputText,
    selectedMode,
    setSelectedMode,
    selectedChannel,
    setSelectedChannel,
    precheckResults,
    setPrecheckResults,
    
    // 定时器状态
    progressTimer,
    setProgressTimer,
    localDetectionUuid,
    setLocalDetectionUuid,
    
    // 错误和提示状态
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
    
    // 停止检测相关状态
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
    
    // 检测结果状态
    detectionResults,
    setDetectionResults,
    isLoadingResults,
    setIsLoadingResults,
    

    // 通知状态
    showNotification,
    setShowNotification,
    notificationMessage,
    setNotificationMessage,
    notificationType,
    setNotificationType,
    
    // 其他状态
    copySuccess,
    setCopySuccess,
    autoStopEnabled,
    setAutoStopEnabled,
    validStopCount,
    setValidStopCount,
    autoStopCount,
    setAutoStopCount,
    
    // 页面加载状态
    isDetectingPageLoading,
    setIsDetectingPageLoading,
    isResultsPageLoading,
    setIsResultsPageLoading,
  }), [
    // 依赖项：只有这些状态变化时才重新创建对象
    currentStep,
    userDetectionStatus,
    selectedMode,
    selectedChannel,
    inputText,
    precheckResults,
    detectionStatus,
    connectionStatus,
    localDetectionUuid,
    progressTimer,
    detectionResultData,
    showStatusAlert,
    statusAlertMessage,
    statusAlertType,
    showErrorAlert,
    errorMessage,
    errorType,
    errorData,
    showSystemErrorAlert,
    systemErrorMessage,
    showStopSuccessAlert,
    showStopErrorAlert,
    stopAlertData,
    isStoppingDetection,
    stopButtonDisabled,
    stopButtonCountdown,
    isLoadingStatus,
    isLoadingProgress,
    isLoadingResult,

    showNotification,
    notificationMessage,
    notificationType,
    copySuccess,
    autoStopEnabled,
    validStopCount,
    autoStopCount,
    isDetectingPageLoading,
    isResultsPageLoading,
  ])
}
