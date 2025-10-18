"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/layout/auth-guard"
import Header from "@/components/layout/header"
import { BinQueryFooter } from "./components/BinQueryFooter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, CreditCard, Building, Globe, Phone, ExternalLink, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useBINQuery, type BINQueryResult } from "@/lib/api/bin-query"
import BINUnifiedCard from "@/components/business/bin-unified-card"

export default function BINQueryPage() {
  return (
    <AuthGuard requiredLevel={1}>
      <BINQueryContent />
    </AuthGuard>
  )
}

function BINQueryContent() {
  const { token } = useAuth()
  const { isLoading, error, queryBIN } = useBINQuery()
  const [binInput, setBinInput] = useState("")
  const [queryResult, setQueryResult] = useState<BINQueryResult | null>(null)
  const [detailedResult, setDetailedResult] = useState<BINQueryResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleQuery = async () => {
    if (!token) {
      setErrorMessage("请先登录")
      setShowError(true)
      return
    }

    if (!binInput.trim()) {
      setErrorMessage("请输入BIN码")
      setShowError(true)
      return
    }

    // 验证BIN码格式（通常是6-8位数字）
    const binPattern = /^\d{6,8}$/
    if (!binPattern.test(binInput.trim())) {
      setErrorMessage("BIN码格式不正确，请输入6-8位数字")
      setShowError(true)
      return
    }

    try {
      setShowError(false)
      setShowResult(false)
      const result = await queryBIN(binInput.trim(), token)
      
      if (result.success && result.data) {
        setQueryResult(result.data)
        setDetailedResult(result.data) // 直接使用API返回的数据
        setShowResult(true)
      } else {
        setErrorMessage(result.message || "查询失败")
        setShowError(true)
        setQueryResult(null)
        setDetailedResult(null)
        setShowResult(false)
      }
    } catch (err) {
      console.error('BIN查询失败:', err)
      setErrorMessage("查询失败，请稍后重试")
      setShowError(true)
      setQueryResult(null)
      setDetailedResult(null)
      setShowResult(false)
    }
  }

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuery()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-4 pb-16">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
              <Search className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">BIN 查询系统</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">输入银行卡BIN码查询详细的卡片信息</p>
        </div>

        {/* 输入区域 */}
        <div className="max-w-lg mx-auto mb-8">
          <Card className="relative overflow-hidden border-0 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-60"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative bg-gradient-to-r from-green-600/10 to-emerald-600/10 pb-3">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Search className="h-4 w-4 text-white" />
                </div>
                BIN码查询
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4 p-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">输入BIN码</label>
                <div className="flex gap-2">
                  <Input
                    value={binInput}
                    onChange={(e) => setBinInput(e.target.value)}
                    onKeyPress={handleInputKeyPress}
                    placeholder="请输入6-8位BIN码，例如：412345"
                    className="font-mono text-sm border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                    maxLength={8}
                  />
                  <Button
                    onClick={handleQuery}
                    disabled={isLoading || !binInput.trim()}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg px-4"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        查询中
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        查询
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
                <p>• BIN码是银行识别码，通常是卡号前6-8位数字</p>
                <p>• 可以查询卡片类型、品牌、发卡行等详细信息</p>
                <p>• 支持Visa、MasterCard、American Express等主流卡片</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            </CardContent>
          </Card>

          {/* 错误提示 */}
          {showError && (
            <Card className="relative overflow-hidden border-0 shadow-xl mt-4">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-60"></div>
              <CardHeader className="relative bg-gradient-to-r from-red-600/10 to-pink-600/10 pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                  查询失败
                </CardTitle>
              </CardHeader>
              <CardContent className="relative p-4">
                <p className="text-red-800">{errorMessage}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
            </Card>
          )}
        </div>
        
        {/* 统一查询结果卡片 */}
        {showResult && queryResult && detailedResult && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">查询结果</h2>
              <p className="text-sm text-gray-600">完整的BIN查询信息</p>
            </div>
            <BINUnifiedCard 
              basicData={queryResult} 
              detailedData={detailedResult} 
            />
          </div>
        )}
      </div>
      
      <BinQueryFooter />
    </div>
  )
}