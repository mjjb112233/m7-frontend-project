"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Shield, AlertTriangle, Info, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface StatusAlertProps {
  show: boolean
  type: "info" | "warning" | "success"
  message: string
  userDetectionStatus: "idle" | "detecting" | "completed"
  onView: () => void
  onDismiss: () => void
}

export function StatusAlert({
  show,
  type,
  message,
  userDetectionStatus,
  onView,
  onDismiss
}: StatusAlertProps) {
  const { t } = useLanguage()
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60"></div>
        <div className="relative text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            {type === 'success' ? (
              <CheckCircle className="h-6 w-6 text-white" />
            ) : type === 'warning' ? (
              <XCircle className="h-6 w-6 text-white" />
            ) : (
              <Shield className="h-6 w-6 text-white" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {type === 'success' ? t("cvv.detectionCompleted") : 
             type === 'warning' ? t("cvv.detectionInProgress") : t("cvv.statusAlert")}
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onDismiss}
              {...({ variant: "outline" } as any)}
              className="px-6 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t("cvv.cancel")}
            </Button>
            <Button
              onClick={onView}
              className="px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {userDetectionStatus === 'detecting' ? t("cvv.viewProgress") : t("cvv.viewResults")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ErrorAlertProps {
  show: boolean
  errorType: "insufficient_coins" | "service_down" | "server_error" | "other"
  errorMessage: string
  errorData: any
  onRecharge: () => void
  onRetry: () => void
  onDismiss: () => void
}

export function ErrorAlert({
  show,
  errorType,
  errorMessage,
  errorData,
  onRecharge,
  onRetry,
  onDismiss
}: ErrorAlertProps) {
  const { t } = useLanguage()
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-60"></div>
        <div className="relative text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <XCircle className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {errorType === 'insufficient_coins' ? t("cvv.insufficientMCoins") : 
             errorType === 'service_down' ? t("cvv.serviceUnavailable") : 
             errorType === 'server_error' ? t("cvv.serverError") : t("cvv.detectionFailed")}
          </h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          
          {/* 显示详细错误信息 */}
          {errorType === 'insufficient_coins' && errorData && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm">
              <p className="text-yellow-800">
                {t("cvv.required")}: {errorData.required} {t("cvv.mCoins")}<br/>
                {t("cvv.current")}: {errorData.current} {t("cvv.mCoins")}<br/>
                {t("cvv.shortage")}: {errorData.shortage} {t("cvv.mCoins")}
              </p>
            </div>
          )}
          
          <div className="flex gap-3 justify-center">
            {errorType === 'insufficient_coins' ? (
              <>
                <Button
                  onClick={onDismiss}
                  {...({ variant: "outline" } as any)}
                  className="px-6 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {t("cvv.back")}
                </Button>
                <Button
                  onClick={onRecharge}
                  className="px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {t("cvv.goToRecharge")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onDismiss}
                  {...({ variant: "outline" } as any)}
                  className="px-6 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {t("cvv.back")}
                </Button>
                <Button
                  onClick={onRetry}
                  className="px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {t("cvv.retry")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface SystemErrorAlertProps {
  show: boolean
  message: string
  onViewResults: () => void
  onDismiss: () => void
}

export function SystemErrorAlert({
  show,
  message,
  onViewResults,
  onDismiss
}: SystemErrorAlertProps) {
  const { t } = useLanguage()
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-60"></div>
        <div className="relative text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <XCircle className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("cvv.systemStatusAbnormal")}
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onDismiss}
              {...({ variant: "outline" } as any)}
              className="px-6 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t("cvv.back")}
            </Button>
            <Button
              onClick={onViewResults}
              className="px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t("cvv.viewResults")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StopSuccessAlertProps {
  show: boolean
  stopAlertData: any
  onViewResults: () => void
}

export function StopSuccessAlert({
  show,
  stopAlertData,
  onViewResults
}: StopSuccessAlertProps) {
  const { t } = useLanguage()
  if (!show || !stopAlertData) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-60"></div>
        <div className="relative text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("cvv.detectionStopped")}
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">{t("cvv.thisDetectionTask")}:</span>
                <span className="text-blue-900 font-semibold">{t("cvv.completed")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">{t("cvv.actualDetected")}:</span>
                <span className="text-blue-900 font-semibold">{stopAlertData.actualDetected || 0} {t("cvv.records")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">{t("cvv.totalCVVCount")}:</span>
                <span className="text-blue-900 font-semibold">{stopAlertData.totalCVVs || 0} {t("cvv.records")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">{t("cvv.totalConsumedMCoins")}:</span>
                <span className="text-blue-900 font-semibold">{stopAlertData.consumption?.toFixed(2) || '0.00'} {t("cvv.mCoins")}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={onViewResults}
              {...({ size: "lg" } as any)}
              className="px-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t("cvv.viewDetectionResults")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StopErrorAlertProps {
  show: boolean
  stopAlertData: any
  stopButtonDisabled: boolean
  stopButtonCountdown: number
  onRetry: () => void
  onDismiss: () => void
}

export function StopErrorAlert({
  show,
  stopAlertData,
  stopButtonDisabled,
  stopButtonCountdown,
  onRetry,
  onDismiss
}: StopErrorAlertProps) {
  const { t } = useLanguage()
  if (!show || !stopAlertData) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-60"></div>
        <div className="relative text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <XCircle className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("cvv.stopDetectionFailed")}
          </h3>
          <p className="text-gray-600 mb-6">{stopAlertData.message}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onDismiss}
              {...({ variant: "outline" } as any)}
              className="px-6 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {t("cvv.back")}
            </Button>
            <Button
              onClick={onRetry}
              disabled={stopButtonDisabled}
              className="px-6 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {stopButtonCountdown > 0 ? t("cvv.retryWithCountdown").replace("{count}", stopButtonCountdown.toString()) : t("cvv.retry")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface NotificationProps {
  show: boolean
  message: string
  type: "success" | "error" | "warning" | "info"
  onClose: () => void
}

export function Notification({
  show,
  message,
  type,
  onClose
}: NotificationProps) {
  if (!show) return null

  return (
    <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 max-w-md ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-blue-500 text-white'
    }`}>
      {type === 'success' && <CheckCircle className="h-5 w-5" />}
      {type === 'error' && <XCircle className="h-5 w-5" />}
      {type === 'warning' && <AlertTriangle className="h-5 w-5" />}
      {type === 'info' && <Info className="h-5 w-5" />}
      <span className="flex-1">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 hover:opacity-80"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface CopySuccessProps {
  show: boolean
  onClose: () => void
}

export function CopySuccess({
  show,
  onClose
}: CopySuccessProps) {
  const { t } = useLanguage()
  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 flex items-center gap-2">
      <CheckCircle className="h-3 w-3" />
      {t("cvv.success")}
    </div>
  )
}
