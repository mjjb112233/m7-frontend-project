import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, TrendingUp, X, AlertCircle, Copy } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCVVCheckAPI } from "@/lib/api"
import { getBrandingConfig } from "@/lib/config/index"
import { Channel, UserDetectionStatus } from "../../types"
import { Toast } from "@/components/shared/toast"

interface PrecheckStepProps {
  precheckResults: { valid: string[]; invalid: string[] }
  selectedChannel: Channel | null
  autoStopCount: string
  setAutoStopCount: (count: string) => void
  validStopCount: number
  setValidStopCount: (count: number) => void
  autoStopEnabled: boolean
  setAutoStopEnabled: (enabled: boolean) => void
  onPrevious: () => void
  onNext: () => void
  // 新增参数用于启动检测
  selectedMode: string
  setLocalDetectionUuid: (id: string) => void
  setUserDetectionStatus: (status: UserDetectionStatus) => void
  // isChecking 状态现在由组件内部管理，不再需要从外部传入
}

export function PrecheckStep({
  precheckResults,
  selectedChannel,
  autoStopCount,
  setAutoStopCount,
  validStopCount,
  setValidStopCount,
  autoStopEnabled,
  setAutoStopEnabled,
  onPrevious,
  onNext,
  selectedMode,
  setLocalDetectionUuid,
  setUserDetectionStatus
}: PrecheckStepProps) {
  const { t } = useLanguage()
  const api = useCVVCheckAPI()
  
  // 组件内部管理 isChecking 状态
  const [isChecking, setIsChecking] = useState(false)
  
  // 余额不足对话框状态
  const [showInsufficientBalanceDialog, setShowInsufficientBalanceDialog] = useState(false)
  const [insufficientBalanceMessage, setInsufficientBalanceMessage] = useState("")
  
  // 通用错误对话框状态
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  
  // Toast提示状态
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // 将原始数据转换为掩码显示格式
  const formatCardForDisplay = (originalLine: string): string => {
    const parts = originalLine.split('|')
    if (parts.length >= 4) {
      const [number, month, year, cvv] = parts
      const maskedNumber = number.replace(/(\d{6})\d{6}(\d{4})/, '$1****$2')
      return `${maskedNumber}  ${month}/${year}  CVV: ${cvv}`
    }
    return originalLine
  }

  // 批量复制有效卡片
  const copyAllValidCards = () => {
    if (precheckResults.valid.length === 0) return
    
    let websiteName = "cc-m7.com"
    try {
      const brandingConfig = getBrandingConfig()
      websiteName = brandingConfig?.copyWebsiteName || "cc-m7.com"
    } catch (error) {
      console.error("Failed to get copy website name from config:", error)
    }
    // 将格式从 卡号|月份|年份|CVV 转换为 卡号|月份/年份|CVV，并添加后缀
    const formattedCards = precheckResults.valid.map((originalLine: string) => {
      const parts = originalLine.split('|')
      if (parts.length >= 4) {
        const [number, month, year, cvv] = parts
        return `${number}|${month}/${year}|${cvv}  ---->${websiteName}`
      }
      return `${originalLine}  ---->${websiteName}`
    }).join('\n')
    
    navigator.clipboard.writeText(formattedCards).then(() => {
      setToastMessage(t("cvv.copiedValidCards").replace("{count}", precheckResults.valid.length.toString()))
      setShowToast(true)
    }).catch(() => {
      setToastMessage(t("cvv.copyFailed"))
      setShowToast(true)
    })
  }

  // 批量复制无效卡片
  const copyAllInvalidCards = () => {
    if (precheckResults.invalid.length === 0) return
    
    let websiteName = "cc-m7.com"
    try {
      const brandingConfig = getBrandingConfig()
      websiteName = brandingConfig?.copyWebsiteName || "cc-m7.com"
    } catch (error) {
      console.error("Failed to get copy website name from config:", error)
    }
    // 将格式从 卡号|月份|年份|CVV 转换为 卡号|月份/年份|CVV，并添加后缀
    const formattedCards = precheckResults.invalid.map((originalLine: string) => {
      const parts = originalLine.split('|')
      if (parts.length >= 4) {
        const [number, month, year, cvv] = parts
        return `${number}|${month}/${year}|${cvv}  ---->${websiteName}`
      }
      return `${originalLine}  ---->${websiteName}`
    }).join('\n')
    
    navigator.clipboard.writeText(formattedCards).then(() => {
      setToastMessage(t("cvv.copiedInvalidCards").replace("{count}", precheckResults.invalid.length.toString()))
      setShowToast(true)
    }).catch(() => {
      setToastMessage(t("cvv.copyFailed"))
      setShowToast(true)
    })
  }

  // 启动检测处理函数
  const handleStartDetection = async () => {
    if (!selectedChannel || precheckResults.valid.length === 0) {
      return
    }

    const cardDataList: string[] = []
    // 直接使用原始数据
    precheckResults.valid.forEach((originalLine: string) => {
      cardDataList.push(originalLine)
    })

    // 将DetectionModeType转换为对应的mode-id
    const getModeId = (mode: string): number => {
      switch (mode) {
        case "charge_test": return 1
        case "no_cvv": return 2
        case "with_cvv": return 3
        default: return 1
      }
    }

    const requestData = {
      cardDataList: cardDataList,
      "mode-id": getModeId(selectedMode),
      channelId: selectedChannel.id,
      autoStopCount: autoStopEnabled ? validStopCount : 0,
      consumption: Number.parseFloat(selectedChannel.consumption || selectedChannel.rate || "0")
    }

    try {
      setIsChecking(true)
      const result = await api.startDetection(requestData)
      
      if (result) {
        const response = result as any
        
        // 检查API响应
        if (response.success === false) {
          // 检查是否是余额不足错误
          if (response.message && response.message.includes(t("cvv.insufficientBalance"))) {
            setInsufficientBalanceMessage(response.message || t("cvv.insufficientBalanceRetry"))
            setShowInsufficientBalanceDialog(true)
            setIsChecking(false)
            return
          } else {
            // 其他错误，显示通用错误对话框
            setErrorMessage(response.message || t("cvv.detectionStartFailedRetry"))
            setShowErrorDialog(true)
            setIsChecking(false)
            return
          }
        }
        
        // success为true或没有success字段（旧格式兼容），正常进入下一步
        if (response.detectionId) {
          setLocalDetectionUuid(response.detectionId)
        }
        setUserDetectionStatus("detecting")
        setIsChecking(false)
        onNext()
      } else {
        // result为null的情况
        setErrorMessage(t("cvv.detectionStartFailedRetry"))
        setShowErrorDialog(true)
        setIsChecking(false)
      }
    } catch (error) {
      console.error("启动检测失败:", error)
      setErrorMessage(error instanceof Error ? error.message : t("cvv.detectionStartFailedRetry"))
      setShowErrorDialog(true)
      setIsChecking(false)
    }
  }

  return (
    <>
    <Card className="relative overflow-hidden border-0 shadow-xl max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="relative bg-gradient-to-r from-purple-600/10 to-blue-600/10 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
            {t("cvv.precheckResultsTitle")}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">{t("cvv.validCount")}: {precheckResults.valid.length}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">{t("cvv.invalidCount")}: {precheckResults.invalid.length}</span>
            </div>
          </div>
        </div>
        <CardDescription className="text-xs text-gray-600">
          {t("cvv.formatVerificationComplete")}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4 p-6">
        <Card className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-10 translate-x-10"></div>
          <CardContent className="relative p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-900 text-sm flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                {t("cvv.budget")}
              </h4>
              <div className="text-xs text-blue-700">
                {t("cvv.estimatedConsumption")}:{" "}
                <span className="font-bold text-base">
                  {(
                    precheckResults.valid.length *
                    Number.parseFloat(selectedChannel?.consumption || selectedChannel?.rate || "0")
                  ).toFixed(1)}
                </span>{" "}
                {t("cvv.mCoins")}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <label htmlFor="auto-stop" className="text-xs font-medium text-blue-900 whitespace-nowrap">
                  {t("cvv.autoStopOptional")}
                </label>
                <Input
                  id="auto-stop"
                  type="number"
                  min="1"
                  placeholder={t("cvv.autoStopPlaceholder")}
                  value={autoStopCount}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || Number.parseInt(value) > 0) {
                      setAutoStopCount(value)
                      setValidStopCount(Number.parseInt(value))
                      setAutoStopEnabled(true)
                    } else {
                      setAutoStopEnabled(false)
                    }
                  }}
                  className="max-w-xs border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white text-sm overflow-hidden"
                />
              </div>
              <p className="text-xs text-blue-600">{t("cvv.autoStopDescription")}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden border-green-200 bg-green-50/80 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="relative pb-2">
              <CardTitle className="text-sm text-green-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  {t("cvv.precheckSuccess")}
                </div>
                {precheckResults.valid.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAllValidCards}
                    className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-700 transition-colors"
                    title={t("cvv.copyAllValidCards")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pt-0">
              {precheckResults.valid.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-xs">{t("cvv.noValidCVVs")}</div>
              ) : (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {precheckResults.valid.map((originalLine, index) => (
                    <div
                      key={index}
                      className="p-2 bg-white rounded-lg border border-green-200 font-mono text-xs shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      {formatCardForDisplay(originalLine)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          </Card>

          <Card className="relative overflow-hidden border-red-200 bg-red-50/80 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="relative pb-2">
              <CardTitle className="text-sm text-red-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                    <XCircle className="h-3 w-3 text-white" />
                  </div>
                  {t("cvv.precheckFailed")}
                </div>
                {precheckResults.invalid.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAllInvalidCards}
                    className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-700 transition-colors"
                    title={t("cvv.copyAllInvalidCards")}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pt-0">
              {precheckResults.invalid.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-xs">{t("cvv.allCVVsFormatCorrect")}</div>
              ) : (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {precheckResults.invalid.map((originalLine, index) => (
                    <div
                      key={index}
                      className="p-2 bg-white rounded-lg border border-red-200 font-mono text-xs shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      {formatCardForDisplay(originalLine)} ({t("cvv.invalidLabel")})
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button
            {...({ variant: "outline", size: "sm" } as any)}
            onClick={onPrevious}
            className="transition-all duration-300 bg-white hover:shadow-md overflow-hidden"
          >
            {t("cvv.returnToModify")}
          </Button>
          <Button
            onClick={handleStartDetection}
            {...({ size: "sm" } as any)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg"
            disabled={precheckResults.valid.length === 0 || isChecking}
          >
            {isChecking ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("cvv.formalChecking")}...
              </div>
            ) : (
              `${t("cvv.startFormalCheck")}${autoStopCount ? ` - ${t("cvv.maxValid")}` : ""}`
            )}
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </CardContent>
    </Card>

    {/* 余额不足对话框 */}
    {showInsufficientBalanceDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t("cvv.insufficientBalanceTitle")}</h3>
              <p className="text-sm text-gray-600">{t("cvv.cannotStartDetection")}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">{insufficientBalanceMessage}</p>
            <p className="text-sm text-gray-500">{t("cvv.pleaseRechargeFirst")}</p>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowInsufficientBalanceDialog(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t("cvv.cancel")}
            </button>
            <button
              onClick={() => {
                setShowInsufficientBalanceDialog(false)
                // 跳转到充值页面
                window.location.href = '/recharge'
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
            >
              {t("cvv.goToRecharge")}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* 通用错误对话框 */}
    {showErrorDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-60"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t("cvv.detectionStartFailed")}</h3>
                <p className="text-sm text-gray-600">{t("cvv.cannotStartDetectionTask")}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{errorMessage}</p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowErrorDialog(false)}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:scale-105"
              >
                {t("cvv.confirm")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    
    {/* Toast提示 */}
    <Toast
      message={toastMessage}
      type="success"
      isVisible={showToast}
      onClose={() => setShowToast(false)}
      duration={2000}
    />
  </>
  )
}
