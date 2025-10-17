import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { BarChart3, Search } from "lucide-react"

interface CardInputProps {
  cardInput: string
  setCardInput: (value: string) => void
  onQuery: () => void
  isProcessing: boolean
}

export function CardInput({ cardInput, setCardInput, onQuery, isProcessing }: CardInputProps) {
  const cardCount = cardInput.split("\n").filter((line) => line.trim()).length

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          卡号数据输入
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-4">
        <Textarea
          value={cardInput}
          onChange={(e) => setCardInput(e.target.value)}
          placeholder={
            "请输入卡号信息，每行一个：\n\n" +
            "支持格式：\n" +
            "1. 仅卡号：4111111111111111\n" +
            "2. 卡号+日期：4111111111111111|12|25\n" +
            "3. 卡号+日期+CVV：4111111111111111|12|25|123\n" +
            "4. 完整信息：4111111111111111|12|25|123|......\n\n" +
            "支持主流卡组织：Visa、Mastercard、Amex、Discover、JCB、UnionPay等"
          }
          className="min-h-[300px] font-mono text-sm resize-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
          rows={12}
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            <span>已输入 {cardCount} 条记录</span>
            {cardCount > 0 && <span className="ml-4 text-blue-600">支持批量处理</span>}
          </div>
          
          <Button
            onClick={onQuery}
            disabled={!cardInput.trim() || isProcessing}
            className="font-semibold py-2 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            size="sm"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                查询中...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                查询卡片信息
              </div>
            )}
          </Button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </CardContent>
    </Card>
  )
}