"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CustomerService() {
  const [isOpen, setIsOpen] = useState(false)

  const handleTelegramContact = () => {
    // 这里可以替换为实际的Telegram客服链接
    window.open("https://t.me/your_customer_service_bot", "_blank")
  }

  return (
    <>
      {/* 浮动按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* 客服面板 */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80">
          <Card className="shadow-2xl border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">联系客服</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>需要帮助？我们的客服团队随时为您服务！</p>
              </div>

              {/* Telegram客服 */}
              <div className="space-y-3">
                <Button onClick={handleTelegramContact} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Telegram 客服
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  <p>工作时间：24小时在线服务</p>
                  <p>平均响应时间：5分钟内</p>
                </div>
              </div>

              {/* 常见问题快捷入口 */}
              <div className="border-t pt-3">
                <p className="text-sm font-medium mb-2">常见问题</p>
                <div className="space-y-1">
                  <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                    • 如何充值M币？
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                    • 卡片分类如何使用？
                  </button>
                  <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1">
                    • CVV验证说明
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
