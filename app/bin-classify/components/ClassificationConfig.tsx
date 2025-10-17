import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Sparkles, Search } from "lucide-react"

interface ClassificationConfigProps {
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  onQuery: () => void
  onClassify: () => void
  isProcessing: boolean
  hasQueryResults: boolean
  cardInput: string
}

export function ClassificationConfig({ 
  selectedCategory, 
  setSelectedCategory, 
  onQuery,
  onClassify,
  isProcessing, 
  hasQueryResults,
  cardInput 
}: ClassificationConfigProps) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-12 translate-x-12"></div>
      <CardHeader className="relative bg-gradient-to-r from-green-600/10 to-blue-600/10 pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
            {hasQueryResults ? <Sparkles className="h-4 w-4 text-white" /> : <Search className="h-4 w-4 text-white" />}
          </div>
          {hasQueryResults ? "分类设置" : "卡片查询"}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4 p-6">
        {!hasQueryResults ? (
          // 第一阶段：查询卡片信息
          <Button
            onClick={onQuery}
            disabled={!cardInput.trim() || isProcessing}
            className="w-full font-semibold py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
            size="lg"
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
        ) : (
          // 第二阶段：选择分类方式
          <>
            <div>
              <label className="block text-sm font-medium mb-3">选择分类维度</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">卡片品牌</SelectItem>
                  <SelectItem value="type">卡片种类</SelectItem>
                  <SelectItem value="level">卡片等级</SelectItem>
                  <SelectItem value="bank">发卡行</SelectItem>
                  <SelectItem value="country">发卡国家</SelectItem>
                  <SelectItem value="currency">国家货币</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={onClassify}
              className="w-full font-semibold py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                开始智能分类
              </div>
            </Button>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
      </CardContent>
    </Card>
  )
}