"use client"

import { useState } from "react"
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnnouncementProps {
  type?: "info" | "warning" | "success" | "error"
  title?: string
  message: string
  dismissible?: boolean
  position?: "top" | "hero" | "floating"
  onDismiss?: () => void
}

export { AnnouncementBanner }
export default AnnouncementBanner

function AnnouncementBanner({
  type = "info",
  title,
  message,
  dismissible = true,
  position = "top",
  onDismiss,
}: AnnouncementProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    console.log("[v0] 公告横幅被关闭")
    setIsVisible(false)
    if (onDismiss) {
      onDismiss()
    }
  }

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      case "success":
        return <CheckCircle className="w-5 h-5 flex-shrink-0" />
      case "error":
        return <AlertCircle className="w-5 h-5 flex-shrink-0" />
      default:
        return <Info className="w-5 h-5 flex-shrink-0" />
    }
  }

  const getStyles = () => {
    const baseStyles = "flex items-center justify-between p-4 border-l-4 transition-all duration-200"

    switch (type) {
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800 hover:bg-yellow-100`
      case "success":
        return `${baseStyles} bg-green-50 border-green-400 text-green-800 hover:bg-green-100`
      case "error":
        return `${baseStyles} bg-red-50 border-red-400 text-red-800 hover:bg-red-100`
      default:
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800 hover:bg-blue-100`
    }
  }

  const getPositionStyles = () => {
    switch (position) {
      case "floating":
        return "fixed bottom-4 right-4 max-w-md z-50 rounded-lg shadow-lg animate-in slide-in-from-right-5"
      case "hero":
        return "mb-8 rounded-lg shadow-sm"
      default:
        return "animate-in slide-in-from-top-2"
    }
  }

  return (
    <div className={`${getStyles()} ${getPositionStyles()}`}>
      <div className="flex items-start space-x-3 flex-1 min-w-0">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {title && <div className="font-semibold text-sm mb-1 leading-tight">{title}</div>}
          <div className={`${title ? "text-sm" : ""} leading-relaxed break-words`}>{message}</div>
        </div>
      </div>

      {dismissible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-current hover:bg-black/10 p-1 ml-3 flex-shrink-0 transition-colors"
          aria-label="关闭公告"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
