"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { maintenanceManager } from "@/lib/maintenance-manager"
import { formatMaintenanceTime } from "@/lib/utils/format"

export function MaintenanceDialog() {
  const { t, language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [announcement, setAnnouncement] = useState<string | undefined>()
  const [endTime, setEndTime] = useState<number | undefined>()

  useEffect(() => {
    // 订阅维护状态变化
    const unsubscribe = maintenanceManager.subscribe((state) => {
      setIsOpen(state.isOpen)
      setAnnouncement(state.announcement)
      setEndTime(state.endTime)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const handleClose = () => {
    maintenanceManager.closeMaintenanceDialog()
  }

  // 获取显示的维护公告
  const displayAnnouncement = announcement || t("maintenance.message")

  // 格式化结束时间
  const formattedEndTime = endTime ? formatMaintenanceTime(endTime, language) : null
  const isExpired = endTime ? new Date(endTime * 1000).getTime() < Date.now() : false

  if (!isOpen) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose()
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <div className="relative overflow-hidden border-0 shadow-lg">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-60"></div>
          
          <div className="relative p-6">
            {/* 图标 */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Wrench className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* 标题 */}
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold text-gray-900 mb-2">
                {t("maintenance.title")}
              </DialogTitle>
            </DialogHeader>

            {/* 维护公告 */}
            <DialogDescription className="text-center text-gray-700 mb-4">
              {displayAnnouncement}
            </DialogDescription>

            {/* 维护结束时间 */}
            {endTime && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="text-sm text-orange-800">
                  <span className="font-semibold">{t("maintenance.endTime")}: </span>
                  <span className={isExpired ? "line-through opacity-60" : ""}>
                    {formattedEndTime}
                  </span>
                  {isExpired && (
                    <span className="ml-2 text-orange-600 font-semibold">
                      ({t("maintenance.completed")})
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 关闭按钮 */}
            <div className="flex justify-center">
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("maintenance.close")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

