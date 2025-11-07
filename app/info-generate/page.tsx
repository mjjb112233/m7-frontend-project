"use client"

import { useState, useContext, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, Download, MapPin, User, CreditCard, Phone, Mail, AlertCircle, Sparkles, CheckCircle, XCircle } from "lucide-react"
import Header from "@/components/layout/header"
import { InfoGenerateFooter } from "@/components/layout/info-generate-footer"
import { AuthGuard } from "@/components/layout/auth-guard"
import { AuthContext } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { getBrandingConfig } from "@/lib/config"

interface GeneratedInfo {
  cardNumber: string
  month: string
  year: string
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

// 获取生成价格响应接口
interface GetGeneratePriceResponse {
  success: boolean
  message: string
  data: {
    price: number
  }
}

// 生成信息响应接口
interface GenerateInfoResponse {
  success: boolean
  message: string
  data: {
    successCount: number
    failedCount: number
    totalCost: number
    successData: GeneratedInfo[]
    failedCardNumbers: string[]
    generateTime: string
  }
}

export default function InfoGeneratePage() {
  return (
    <AuthGuard requiredLevel={2}>
      <InfoGenerateContent />
    </AuthGuard>
  )
}

function InfoGenerateContent() {
  const { t } = useLanguage()
  const authContext = useContext(AuthContext)
  const token = authContext?.token
  const updateMCoins = authContext?.updateMCoins
  const refreshUserInfo = authContext?.refreshUserInfo
  const [cardNumbers, setCardNumbers] = useState("")
  const [generatedData, setGeneratedData] = useState<GeneratedInfo[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [pricePerCard, setPricePerCard] = useState(2.0)
  const [priceLoading, setPriceLoading] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [generateResult, setGenerateResult] = useState<GenerateInfoResponse['data'] | null>(null)
  const [failedCardNumbers, setFailedCardNumbers] = useState<string[]>([])

  // 提示相关状态
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  // 显示提示
  const showToastMessage = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // 获取生成价格
  const fetchGeneratePrice = async () => {
    if (!token) return

    setPriceLoading(true)
    try {
      // 使用封装的 authenticatedRequest 函数
      const { authenticatedRequest } = await import('@/lib/api')
      const data = await authenticatedRequest('/info-generate/price', token, {
        method: 'GET'
      })

      if (data.success && data.data) {
        const priceData = data.data as any
        console.log('🔍 获取到价格信息:', priceData)
        setPricePerCard(priceData.price)
      } else {
        console.error('获取生成价格失败:', data.message)
      }
    } catch (error) {
      console.error('获取生成价格错误:', error)
    } finally {
      setPriceLoading(false)
    }
  }

  // 生成信息
  const handleGenerate = async () => {
    if (!token) {
      alert(t("info.loginRequired"))
      return
    }

    if (!cardNumbers.trim()) {
      alert(t("info.enterCardNumber"))
      return
    }

    const cardNumberList = cardNumbers
      .split('\n')
      .map(card => card.trim())
      .filter(card => card.length > 0)

    if (cardNumberList.length === 0) {
      alert(t("info.enterValidCard"))
      return
    }

    setIsGenerating(true)

    try {
      // 使用封装的 authenticatedRequest 函数
      const { authenticatedRequest } = await import('@/lib/api')
      const data = await authenticatedRequest('/info-generate/generate', token, {
        method: 'POST',
        body: JSON.stringify({
          cardNumbers: cardNumberList,
          pricePerCard: pricePerCard
        })
      })

      if (data.success && data.data) {
        const generateData = data.data as any
        setGenerateResult(generateData)
        setGeneratedData(generateData.successData)
        setFailedCardNumbers(generateData.failedCardNumbers)
        setShowResultDialog(true)
        
        // 刷新用户信息以获取最新的M币余额
        await refreshUserInfo?.()
      } else {
        alert(t("info.generateFailed") + ': ' + data.message)
      }
    } catch (error) {
      console.error('生成信息错误:', error)
      alert(t("info.generateError"))
    } finally {
      setIsGenerating(false)
    }
  }

  // 页面加载时获取价格
  useEffect(() => {
    if (token) {
      fetchGeneratePrice()
    }
  }, [token])

  // 复制到剪贴板
  const copyToClipboard = (info: GeneratedInfo) => {
    let websiteName = "cc-m7.com"
    try {
      const brandingConfig = getBrandingConfig()
      websiteName = brandingConfig?.copyWebsiteName || "cc-m7.com"
    } catch (error) {
      console.error("Failed to get copy website name from config:", error)
    }
    const text = `${t("info.cardNumber")}: ${info.cardNumber}  ---->${websiteName}\n${t("info.expiry")}: ${info.month}/${info.year}  ---->${websiteName}\n${t("info.name")}: ${info.fullName}  ---->${websiteName}\n${t("info.phone")}: ${info.phone}  ---->${websiteName}\n${t("info.email")}: ${info.email}  ---->${websiteName}\n${t("info.address")}: ${info.address}  ---->${websiteName}\n${t("info.city")}: ${info.city}  ---->${websiteName}\n${t("info.province")}: ${info.state}  ---->${websiteName}\n${t("info.zipCode")}: ${info.zipCode}  ---->${websiteName}\n${t("info.country")}: ${info.country}  ---->${websiteName}`
    
    navigator.clipboard.writeText(text).then(() => {
      showToastMessage(t("info.copied"), "success")
    }).catch(() => {
      showToastMessage(t("info.copyFailed"), "error")
    })
  }

  // 复制所有失败卡号
  const copyAllFailedCards = () => {
    let websiteName = "cc-m7.com"
    try {
      const brandingConfig = getBrandingConfig()
      websiteName = brandingConfig?.copyWebsiteName || "cc-m7.com"
    } catch (error) {
      console.error("Failed to get copy website name from config:", error)
    }
    const allFailedCards = failedCardNumbers.map(cardNumber => `${cardNumber}  ---->${websiteName}`).join('\n')
    navigator.clipboard.writeText(allFailedCards).then(() => {
      showToastMessage(t("info.failedCardsCopied"), "success")
    }).catch(() => {
      showToastMessage(t("info.copyFailed"), "error")
    })
  }

  const locations = [
    {
      country: "美国",
      state: "加利福尼亚州",
      cities: [
        {
          name: "洛杉矶",
          streets: ["Sunset Blvd", "Hollywood Blvd", "Melrose Ave"],
          zipCodes: ["90210", "90028", "90046"],
        },
        { name: "旧金山", streets: ["Market St", "Mission St", "Castro St"], zipCodes: ["94102", "94103", "94114"] },
      ],
    },
    {
      country: "英国",
      state: "英格兰",
      cities: [
        {
          name: "伦敦",
          streets: ["Oxford Street", "Baker Street", "Abbey Road"],
          zipCodes: ["SW1A 1AA", "W1U 8ED", "NW8 9AY"],
        },
        {
          name: "曼彻斯特",
          streets: ["Deansgate", "King Street", "Market Street"],
          zipCodes: ["M1 1AA", "M2 4WU", "M4 3AQ"],
        },
      ],
    },
    {
      country: "加拿大",
      state: "安大略省",
      cities: [
        {
          name: "多伦多",
          streets: ["Yonge Street", "Queen Street", "King Street"],
          zipCodes: ["M5H 2N2", "M5V 3A8", "M5C 1T4"],
        },
        {
          name: "渥太华",
          streets: ["Sparks Street", "Bank Street", "Rideau Street"],
          zipCodes: ["K1P 5E7", "K1S 3W7", "K1N 5Y8"],
        },
      ],
    },
  ]

  const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "James", "Anna", "Robert", "Maria"]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]

  const generateRandomInfo = (cardNumber: string): GeneratedInfo => {
    const location = locations[Math.floor(Math.random() * locations.length)]
    const city = location.cities[Math.floor(Math.random() * location.cities.length)]
    const street = city.streets[Math.floor(Math.random() * city.streets.length)]
    const zipCode = city.zipCodes[Math.floor(Math.random() * city.zipCodes.length)]

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    const phoneFormats = [
      `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      `+44-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 900000 + 100000)}`,
      `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    ]

    // 生成邮箱
    const emailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
    const emailProvider = emailProviders[Math.floor(Math.random() * emailProviders.length)]
    const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999 + 1)}`
    const email = `${emailPrefix}@${emailProvider}`

    return {
      cardNumber,
      month: "06",
      year: "2028",
      fullName: `${firstName} ${lastName}`,
      phone: phoneFormats[Math.floor(Math.random() * phoneFormats.length)],
      email,
      address: `${Math.floor(Math.random() * 9999 + 1)} ${street}`,
      city: city.name,
      state: location.state,
      zipCode,
      country: location.country,
    }
  }



  const exportData = () => {
    if (!generatedData || generatedData.length === 0) return

    const csvContent =
      "data:text/csv;charset=utf-8," +
      `${t("info.cardNumber")},${t("info.expiry")},${t("info.name")},${t("info.phone")},${t("info.email")},${t("info.address")},${t("info.city")},${t("info.province")},${t("info.zipCode")},${t("info.country")}\n` +
      generatedData
        .map(
          (info) =>
            `${info.cardNumber},${info.month}/${info.year},${info.fullName},${info.phone},${info.email},${info.address},${info.city},${info.state},${info.zipCode},${info.country}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "generated_info.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  const getCardCount = () => {
    return cardNumbers
      .trim()
      .split("\n")
      .filter((card) => card.trim()).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <User className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t("info.systemTitle")}</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">{t("info.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-60"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <CardHeader className="relative bg-gradient-to-r from-cyan-600/10 to-blue-600/10 pb-3">
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  {t("info.inputCardTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">{t("info.inputLabel")}</label>
                  <Textarea
                    value={cardNumbers}
                    onChange={(e) => setCardNumbers(e.target.value)}
                    placeholder={t("info.inputPlaceholder")}
                    className="min-h-[200px] font-mono text-sm border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {cardNumbers.trim() && (
                  <Card className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-sm">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full -translate-y-8 translate-x-8"></div>
                    <CardContent className="relative p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                          <AlertCircle className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-orange-900">{t("info.costPreview")}</div>
                          <div className="text-sm text-orange-700">
                            {t("info.detectedCards", { count: getCardCount(), cost: getCardCount() * pricePerCard })}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200 shadow-sm"
                        >
                          -{getCardCount() * pricePerCard} {t("recharge.coins")}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !cardNumbers.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {t("info.generating")}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t("info.generateButton")}
                      </div>
                    )}
                  </Button>

                </div>

                <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
                  <p>• {t("info.costPerCard", { price: pricePerCard })}</p>
                  <p>• {t("info.usingRealData")}</p>
                  <p>• {t("info.supportBatch")}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              </CardContent>
            </Card>

            {/* 失败卡号显示区域 */}
            {failedCardNumbers && failedCardNumbers.length > 0 && (
              <Card className="relative overflow-hidden border-0 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-60"></div>
                <CardHeader className="relative bg-gradient-to-r from-red-600/10 to-pink-600/10 pb-3">
                  <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                      <XCircle className="h-4 w-4 text-white" />
                    </div>
                    {t("info.failedCardsTitle")}
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAllFailedCards}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 flex items-center gap-1"
                      >
                        <Copy className="h-4 w-4" />
                        {t("info.copyAll")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFailedCardNumbers([])}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        ×
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative p-4">
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {failedCardNumbers.map((cardNumber, index) => (
                      <div key={index} className="bg-white rounded border border-red-200 p-2 shadow-sm">
                        <code className="text-sm text-red-800 font-mono">{cardNumber}</code>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {generatedData && generatedData.length > 0 
                  ? t("info.resultsCount", { count: generatedData.length })
                  : t("info.results")}
              </h2>
              {generatedData && generatedData.length > 0 && (
                <Button
                  variant="outline"
                  onClick={exportData}
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300"
                >
                  <Download className="h-4 w-4" />
                  <span>{t("info.exportCSV")}</span>
                </Button>
              )}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {!generatedData || generatedData.length === 0 ? (
                <Card className="relative overflow-hidden border-0 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50 opacity-60"></div>
                  <CardContent className="relative p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">{t("info.noData")}</p>
                    <p className="text-sm text-gray-400 mt-1">{t("info.noDataHint")}</p>
                  </CardContent>
                </Card>
              ) : (
                generatedData.map((info, index) => {
                  const cardColors = [
                    { from: "emerald-50", to: "green-50", border: "emerald-200", accent: "emerald-500" },
                    { from: "purple-50", to: "violet-50", border: "purple-200", accent: "purple-500" },
                    { from: "rose-50", to: "pink-50", border: "rose-200", accent: "rose-500" },
                    { from: "amber-50", to: "orange-50", border: "amber-200", accent: "amber-500" },
                    { from: "indigo-50", to: "blue-50", border: "indigo-200", accent: "indigo-500" },
                  ]
                  const colorTheme = cardColors[index % cardColors.length]

                  return (
                    <Card
                      key={index}
                      className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-${colorTheme.from} to-${colorTheme.to} opacity-60`}
                      ></div>
                      <div
                        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-${colorTheme.accent}/20 to-${colorTheme.accent}/10 rounded-full -translate-y-12 translate-x-12`}
                      ></div>
                      <CardContent className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-5 h-5 bg-gradient-to-br from-${colorTheme.accent} to-${colorTheme.accent} rounded-lg flex items-center justify-center shadow-lg`}
                            >
                              <CreditCard className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-mono text-sm font-medium text-gray-900">{info.cardNumber}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(info)}
                            className={`text-gray-500 hover:text-${colorTheme.accent.split("-")[0]}-600 hover:bg-${colorTheme.accent.split("-")[0]}-50 transition-all duration-300`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                              <User className="h-2 w-2 text-white" />
                            </div>
                            <span className="text-gray-600">{t("info.name")}:</span>
                            <span className="font-medium text-gray-900">{info.fullName}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
                              <CreditCard className="h-2 w-2 text-white" />
                            </div>
                            <span className="text-gray-600">{t("info.expiry")}:</span>
                            <span className="font-medium text-gray-900">{info.month}/{info.year}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-sm">
                              <Phone className="h-2 w-2 text-white" />
                            </div>
                            <span className="text-gray-600">{t("info.phone")}:</span>
                            <span className="font-medium font-mono text-gray-900">{info.phone}</span>
                          </div>

                          <div className="col-span-2 flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                              <Mail className="h-2 w-2 text-white" />
                            </div>
                            <span className="text-gray-600">{t("info.email")}:</span>
                            <span className="font-medium font-mono text-gray-900 text-xs">{info.email}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-sm">
                              <MapPin className="h-2 w-2 text-white" />
                            </div>
                            <span className="text-gray-600">{t("info.country")}:</span>
                            <span className="font-medium text-gray-900">{info.country}</span>
                          </div>

                          <div className="col-span-2 space-y-2">
                            <div className="flex items-start space-x-2">
                              <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mt-0.5 shadow-sm">
                                <MapPin className="h-2 w-2 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-gray-600 text-xs">{t("info.address")}:</div>
                                <div className="font-medium text-gray-900">
                                  {info.address}<br />
                                  {info.city}, {info.state} {info.zipCode}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${colorTheme.accent} to-${colorTheme.accent}`}
                        ></div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 生成结果对话框 */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-2xl bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              {t("info.generateComplete")}
            </DialogTitle>
            <DialogDescription className="text-gray-600">{t("info.resultStats")}</DialogDescription>
          </DialogHeader>

          {generateResult && (
            <div className="space-y-6">
              {/* 统计信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-green-900">{t("info.successCount")}</div>
                      <div className="text-2xl font-bold text-green-600">{generateResult.successCount}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="text-sm font-medium text-red-900">{t("info.failedCount")}</div>
                      <div className="text-2xl font-bold text-red-600">{generateResult.failedCount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 消耗信息 */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-900">{t("info.actualCost")}</div>
                    <div className="text-lg font-bold text-blue-600">{generateResult.totalCost} {t("recharge.coins")}</div>
                  </div>
                </div>
              </div>

              {/* 失败卡号列表 */}
              {generateResult.failedCardNumbers && generateResult.failedCardNumbers.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div className="text-sm font-medium text-red-900">{t("info.failedCards")}</div>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {generateResult.failedCardNumbers.map((cardNumber, index) => (
                      <div key={index} className="bg-white rounded border border-red-200 p-2">
                        <code className="text-sm text-red-800 font-mono">{cardNumber}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowResultDialog(false)}
                >
                  {t("info.close")}
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
                  onClick={() => setShowResultDialog(false)}
                >
                  {t("info.viewResults")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 左下角提示 */}
      {showToast && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-left-2 duration-300 ${
            toastType === "success" 
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
              : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
          }`}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
      
      <InfoGenerateFooter />
    </div>
  )
}

