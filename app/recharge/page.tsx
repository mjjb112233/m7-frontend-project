"use client"
import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/layout/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Coins,
  Gift,
  QrCode,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Gem,
  Trophy,
  Shield,
  Rocket,
} from "lucide-react"
import Header from "@/components/layout/header"
import { RechargeFooter } from "@/components/layout/recharge-footer"
import { generateQRCodeFromURL } from "@/lib/qr-code-utils"

// 充值套餐接口（后端API返回的数据结构）
interface RechargePackage {
  id: string
  name: string
  m_coin_amount: number
  discount: number
  original_price: number
  description?: string
  is_popular: boolean
}

// 页面使用的套餐接口（包含计算后的字段）
interface DisplayPackage {
  id: string
  mCoins: number
  usdt: number
  discount: number
  originalPrice: number
  discountedPrice: number  // 折扣后价格
  savedAmount: number      // 节省的价格
  popular: boolean
  title: string
  description: string
  features: string[]
  icon: any
  theme: any
}

// 获取充值套餐响应接口
interface GetRechargePackagesResponse {
  success: boolean
  message: string
  data: {
    packages: RechargePackage[]
    total: number
  }
}

// 充值支付信息接口
interface RechargePaymentInfo {
  paymentId: string
  usdtAmount: number
  walletAddress: string
  wallet_connect_url: string
  paymentInstructions: string | string[] // 支持字符串或字符串数组
  validUntil: number // 时间戳
  packageInfo?: {
    mCoinAmount: number
    discount?: number
  }
}

// 充值回调响应接口
interface RechargeCallbackResponse {
  success: boolean
  message: string
  data: {
    paymentId: string
    paymentStatus: "success" | "failed"
    transactionId: string
    confirmTime: string
    mCoinAmount?: number
    newBalance?: number
  }
}


export default function RechargePage() {
  return (
    <AuthGuard requiredLevel={1}>
      <RechargeContent />
    </AuthGuard>
  )
}

function RechargeContent() {
  const { token, updateMCoins, refreshUserInfo, user } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<DisplayPackage | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [exchangeCode, setExchangeCode] = useState("")
  const [isProcessingCode, setIsProcessingCode] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [resultType, setResultType] = useState<"success" | "failed">("success")
  const [resultMessage, setResultMessage] = useState("")
  const [resultAmount, setResultAmount] = useState(0)
  const [rechargePackages, setRechargePackages] = useState<DisplayPackage[]>([])
  const [packagesLoading, setPackagesLoading] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<RechargePaymentInfo | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed" | null>(null)
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("")
  const [timeLeft, setTimeLeft] = useState<number>(0) // 倒计时剩余时间（秒）

  const [activeTab, setActiveTab] = useState<string>("packages") // 当前激活的tab

  const usdtWalletAddress = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"

  // 计算倒计时剩余时间
  const calculateTimeLeft = (validUntil: number): number => {
    const now = new Date().getTime()
    const diff = Math.max(0, Math.floor((validUntil - now) / 1000))
    return diff
  }

  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // 倒计时效果
  useEffect(() => {
    if (!paymentInfo?.validUntil) return

    const initialTimeLeft = calculateTimeLeft(paymentInfo.validUntil)
    setTimeLeft(initialTimeLeft)

    const timer = setInterval(() => {
      const currentTimeLeft = calculateTimeLeft(paymentInfo.validUntil)
      setTimeLeft(currentTimeLeft)
      
      if (currentTimeLeft <= 0) {
        clearInterval(timer)
        // 时间到期，自动关闭支付对话框
        setShowPaymentDialog(false)
        setPaymentStatus("failed")
        setResultType("failed")
        setResultMessage("支付时间已过期，请重新选择套餐")
        setResultAmount(0)
        setShowResultDialog(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [paymentInfo?.validUntil])



  // 获取充值套餐 - 直接使用 authenticatedRequest
  const fetchRechargePackages = async () => {
    if (!token) {
      return
    }

    setPackagesLoading(true)
    try {
      // 直接使用 authenticatedRequest 调用后端API
      const { authenticatedRequest } = await import('@/lib/api')
      const data = await authenticatedRequest('/recharge/packages', token, {
        method: 'GET'
      })

      if (data.success && data.data) {
        // 将API返回的套餐数据转换为页面需要的格式
        const sortedPackages = (data.data as any).packages
          .sort((a: RechargePackage, b: RechargePackage) => {
            // 按ID大小排列，0为第一个
            const idA = parseInt(a.id) || 0
            const idB = parseInt(b.id) || 0
            return idA - idB
          })
        
        const convertedPackages = sortedPackages.map((pkg: RechargePackage, index: number) => {
          // 计算折扣后的价格和节省的价格
          const discountedPrice = pkg.original_price * (1 - pkg.discount / 100)
          const savedAmount = pkg.original_price - discountedPrice
          
          return {
            id: pkg.id,
            mCoins: pkg.m_coin_amount,
            usdt: discountedPrice, // 使用计算出的折扣后价格
            discount: pkg.discount,
            originalPrice: pkg.original_price,
            discountedPrice: discountedPrice, // 折扣后价格
            savedAmount: savedAmount, // 节省的价格
            popular: pkg.is_popular,
            title: pkg.name,
            description: pkg.description || "",
            features: generateFeatures(pkg.m_coin_amount),
            icon: getIconForPackage(index),
            theme: getThemeForPackage(index)
          } as DisplayPackage
        })
        
        setRechargePackages(convertedPackages)
      } else {
        // API失败时不显示任何套餐
        setRechargePackages([])
      }
    } catch (error) {
      // 网络错误时不显示任何套餐
      setRechargePackages([])
    } finally {
      setPackagesLoading(false)
    }
  }

  // 根据M币数量生成功能特性
  const generateFeatures = (mCoins: number) => {
    const features = []
    if (mCoins >= 10) features.push(`CVV检测 ${Math.floor(mCoins / 3)}-${Math.floor(mCoins / 2.5)}次`)
    if (mCoins >= 20) features.push("BIN分类功能")
    if (mCoins >= 50) features.push("信息生成功能")
    if (mCoins >= 100) features.push("批量处理功能")
    if (mCoins >= 500) features.push("API接口访问")
    if (mCoins >= 1000) features.push("专属客服支持")
    return features
  }

  // 根据索引获取图标（8个不同的图标）
  const getIconForPackage = (index: number) => {
    const icons = [Coins, Gift, Zap, Crown, Sparkles, Gem, Trophy, Rocket]
    return icons[index] || icons[0] // 如果超出范围，使用第一个图标
  }



  // 根据索引获取主题
  const getThemeForPackage = (index: number) => {
    const themes = [
      {
        gradient: "from-emerald-50 via-white to-teal-50",
        iconBg: "from-emerald-100 to-teal-100",
        iconColor: "text-emerald-600",
        priceBg: "from-emerald-50 to-teal-25",
        priceBorder: "border-emerald-100",
        ring: "ring-emerald-500",
        bottomBar: "from-emerald-500 to-teal-500",
      },
      {
        gradient: "from-orange-50 via-white to-amber-50",
        iconBg: "from-orange-100 to-amber-100",
        iconColor: "text-orange-600",
        priceBg: "from-orange-50 to-amber-25",
        priceBorder: "border-orange-100",
        ring: "ring-orange-500",
        bottomBar: "from-orange-500 to-amber-500",
      },
      {
        gradient: "from-blue-50 via-white to-purple-50",
        iconBg: "from-blue-100 to-purple-100",
        iconColor: "text-blue-600",
        priceBg: "from-blue-50 to-purple-50",
        priceBorder: "border-blue-100",
        ring: "ring-blue-500",
        bottomBar: "from-blue-500 to-purple-500",
      },
      {
        gradient: "from-violet-50 via-white to-indigo-50",
        iconBg: "from-violet-100 to-indigo-100",
        iconColor: "text-violet-600",
        priceBg: "from-violet-50 to-indigo-25",
        priceBorder: "border-violet-100",
        ring: "ring-violet-500",
        bottomBar: "from-violet-500 to-indigo-500",
      },
      {
        gradient: "from-rose-50 via-white to-pink-50",
        iconBg: "from-rose-100 to-pink-100",
        iconColor: "text-rose-600",
        priceBg: "from-rose-50 to-pink-25",
        priceBorder: "border-rose-100",
        ring: "ring-rose-500",
        bottomBar: "from-rose-500 to-pink-500",
      },
      {
        gradient: "from-slate-50 via-white to-gray-50",
        iconBg: "from-slate-100 to-gray-100",
        iconColor: "text-slate-600",
        priceBg: "from-slate-50 to-gray-25",
        priceBorder: "border-slate-100",
        ring: "ring-slate-500",
        bottomBar: "from-slate-500 to-gray-500",
      },
      {
        gradient: "from-cyan-50 via-white to-sky-50",
        iconBg: "from-cyan-100 to-sky-100",
        iconColor: "text-cyan-600",
        priceBg: "from-cyan-50 to-sky-25",
        priceBorder: "border-cyan-100",
        ring: "ring-cyan-500",
        bottomBar: "from-cyan-500 to-sky-500",
      },
      {
        gradient: "from-yellow-50 via-white to-orange-50",
        iconBg: "from-yellow-100 to-orange-100",
        iconColor: "text-yellow-600",
        priceBg: "from-yellow-50 to-orange-25",
        priceBorder: "border-yellow-100",
        ring: "ring-yellow-500",
        bottomBar: "from-yellow-500 to-orange-500",
      }
    ]
    return themes[index % themes.length]
  }

  // 页面加载时获取充值套餐
  useEffect(() => {
    if (token) {
      fetchRechargePackages()
    }
  }, [token])



  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval)
      }
    }
  }, [statusCheckInterval])

  const handlePackageSelect = async (pkg: DisplayPackage) => {
    if (!token) {
      alert("请先登录")
      return
    }

    setSelectedPackage(pkg)
    
    try {
      // 直接使用 authenticatedRequest 创建支付订单
      const { authenticatedRequest } = await import('@/lib/api')
      const data = await authenticatedRequest('/recharge/payment', token, {
        method: 'POST',
        body: JSON.stringify({
          packageId: pkg.id // 只传递套餐ID
        })
      })

      if (data.success && data.data) {
        // 保存支付信息
        const paymentData = data.data as any
        setPaymentInfo({
          paymentId: paymentData.paymentId,
          usdtAmount: paymentData.usdtAmount,
          walletAddress: paymentData.walletAddress,
          wallet_connect_url: paymentData.wallet_connect_url,
          paymentInstructions: paymentData.paymentInstructions,
          validUntil: paymentData.validUntil, // 现在是时间戳
          packageInfo: {
            mCoinAmount: pkg.mCoins,
            discount: pkg.discount
          }
        })
        
        // 使用 wallet_connect_url 生成二维码
        try {
          const qrCode = await generateQRCodeFromURL(paymentData.wallet_connect_url)
          setQrCodeDataURL(qrCode)
        } catch (error) {
          // 如果生成失败，使用默认图片
          setQrCodeDataURL("")
        }
        
        setShowPaymentDialog(true)
      } else {
        alert('创建支付订单失败: ' + data.message)
      }
    } catch (error) {
      alert('创建支付订单失败，请稍后重试')
    }
  }

  const handleCopyAddress = async () => {
    try {
      const address = paymentInfo?.walletAddress || usdtWalletAddress
      await navigator.clipboard.writeText(address)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      // 复制失败，静默处理
    }
  }

  // 检查充值状态
  const checkPaymentStatus = async () => {
    if (!paymentInfo || !token) return

    try {
      // 使用 GET 请求检查支付状态
      const { authenticatedRequest } = await import('@/lib/api')
      const data = await authenticatedRequest(`/recharge/result/${paymentInfo.paymentId}`, token, {
        method: 'GET'
      })

      if (data.success && data.data) {
        const statusData = data.data as any
        if (statusData.paymentStatus === "success") {
          setPaymentStatus("success")
          setResultType("success")
          setResultMessage("充值成功！M币已到账")
          setResultAmount(statusData.mCoinAmount || 0)
          setShowPaymentDialog(false)
          setShowResultDialog(true)
          
          // 刷新用户信息以获取最新的M币余额
          await refreshUserInfo?.()
          
          // 停止状态检查
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval)
            setStatusCheckInterval(null)
          }
        } else if (statusData.paymentStatus === "failed") {
          setPaymentStatus("failed")
          setResultType("failed")
          setResultMessage("充值失败，请检查支付信息或联系客服")
          setResultAmount(0)
          setShowPaymentDialog(false)
          setShowResultDialog(true)
          
          // 停止状态检查
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval)
            setStatusCheckInterval(null)
          }
        }
      }
    } catch (error) {
      // 检查状态失败，静默处理
    }
  }

  // 开始状态检查
  const startStatusCheck = () => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval)
    }
    
    const interval = setInterval(checkPaymentStatus, 5000) // 每5秒检查一次
    setStatusCheckInterval(interval)
  }

  // 停止状态检查
  const stopStatusCheck = () => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval)
      setStatusCheckInterval(null)
    }
  }

  // 修改为真实的API请求支付逻辑
  const handlePaymentComplete = async () => {
    if (!paymentInfo || !token) {
      setResultType("failed")
      setResultMessage("支付信息不完整，请重试")
      setResultAmount(0)
      setShowResultDialog(true)
      return
    }

    setShowPaymentDialog(false)
    setPaymentStatus("pending")

    try {
      console.log("🔍 检查支付状态")
      // 使用 GET 请求检查支付结果
      const { authenticatedRequest } = await import('@/lib/api')
      const data = await authenticatedRequest(`/recharge/result/${paymentInfo.paymentId}`, token, {
        method: 'GET'
      })

      if (data.success && data.data) {
        const resultData = data.data as any
        if (resultData.paymentStatus === "success") {
          // 支付成功
          setPaymentStatus("success")
          setResultType("success")
          setResultMessage("充值成功！M币已到账")
          setResultAmount(resultData.mCoinAmount || 0)
          setShowResultDialog(true)
          
          // 更新用户信息 - 获取最新的用户信息来更新导航栏
          try {
            const { authenticatedRequest } = await import('@/lib/api')
            const userData = await authenticatedRequest('/auth/user', token, {
              method: 'GET'
            })
            
            if (userData.success && userData.data) {
              const userInfo = userData.data as any
              console.log('🔍 获取到最新用户信息:', userInfo)
              // 更新导航栏的M币数量 - 设置为总余额，不是叠加
              // 由于updateMCoins是叠加操作，我们需要计算差值
              const currentBalance = user?.mCoins || 0
              const newBalance = userInfo.mCoins || 0
              const difference = newBalance - currentBalance
              if (difference !== 0) {
                updateMCoins?.(difference)
              }
            }
          } catch (error) {
            console.error('获取用户信息失败:', error)
            // 如果获取用户信息失败，使用回调返回的M币数量作为备选
            if (resultData.mCoinAmount !== undefined) {
              updateMCoins?.(resultData.mCoinAmount)
            }
          }
        } else if (resultData.paymentStatus === "pending") {
          // 后端还在验证中
          setPaymentStatus("pending")
          setResultType("failed")
          setResultMessage("支付验证中，请稍后...")
          setResultAmount(0)
          setShowResultDialog(true)
        } else {
          // 后端验证支付失败
          setPaymentStatus("failed")
          setResultType("failed")
          setResultMessage("支付验证失败，请检查支付信息或联系客服")
          setResultAmount(0)
          setShowResultDialog(true)
        }
      } else {
        setPaymentStatus("failed")
        setResultType("failed")
        setResultMessage(data.message || "支付验证失败，请联系客服")
        setResultAmount(0)
        setShowResultDialog(true)
      }
    } catch (error) {
      console.error('充值回调错误:', error)
      setPaymentStatus("failed")
      setResultType("failed")
      setResultMessage("充值失败，请稍后重试")
      setResultAmount(0)
      setShowResultDialog(true)
    }
  }


  // 重试充值
  const handleRetryPayment = () => {
    setPaymentStatus(null)
    setShowResultDialog(false)
    if (selectedPackage) {
      setShowPaymentDialog(true)
    }
  }


  const handleExchangeCode = async () => {
    if (!exchangeCode.trim() || !token) return

    setIsProcessingCode(true)

    try {
      // 直接使用 authenticatedRequest 处理兑换码
      const { authenticatedRequest } = await import('@/lib/api')
      const data = await authenticatedRequest('/recharge/exchange-code', token, {
        method: 'POST',
        body: JSON.stringify({
          exchangeCode: exchangeCode.trim()
        })
      })

      if (data.success && data.data) {
        const exchangeData = data.data as any
        setResultType("success")
        setResultMessage(exchangeData.message || "兑换成功！M币已到账")
        setResultAmount(exchangeData.mCoinsReward || 0)
        
        // 更新用户信息
        if (exchangeData.mCoinsReward > 0) {
          updateMCoins?.(exchangeData.mCoinsReward)
        }
      } else {
        setResultType("failed")
        setResultMessage(data.message || "兑换码使用失败，请稍后重试")
        setResultAmount(0)
      }

      setExchangeCode("")
      setShowResultDialog(true)
    } catch (error) {
      console.error('使用兑换码错误:', error)
      setResultType("failed")
      setResultMessage("兑换码使用失败，请稍后重试")
      setResultAmount(0)
      setExchangeCode("")
      setShowResultDialog(true)
    } finally {
      setIsProcessingCode(false)
    }
  }

  const handleCloseResult = () => {
    setShowResultDialog(false)
    setSelectedPackage(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-4 pb-16">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
              <Coins className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">充值</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">使用USDT购买M币，享受更多功能和优惠折扣</p>
        </div>

        <div className="space-y-6 mb-8">
          <Tabs defaultValue="packages" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                套餐充值
              </TabsTrigger>
              <TabsTrigger value="exchange" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                兑换码
              </TabsTrigger>
            </TabsList>

            <TabsContent value="packages">
              {packagesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">正在加载充值套餐...</p>
                  </div>
                </div>
              ) : rechargePackages.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="text-gray-400 mb-4">
                      <Coins className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">无法加载充值套餐</h3>
                    <p className="text-gray-600 mb-4">服务器连接失败或暂无可用套餐</p>
                    <button 
                      onClick={fetchRechargePackages}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      重新加载
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 max-w-7xl">
                    {rechargePackages.map((pkg, index) => {
                      const IconComponent = pkg.icon
                      return (
                      <Card
                        key={index}
                        className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group bg-white border-0 rounded-xl ${
                          pkg.popular 
                            ? "ring-2 ring-orange-500 shadow-lg overflow-visible" 
                            : "shadow-md hover:shadow-lg overflow-hidden"
                        }`}
                        onClick={() => handlePackageSelect(pkg)}
                      >
                        {/* Background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${pkg.theme.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
                        
                        {/* Popular Badge */}
                        {pkg.popular && (
                          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg z-20 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span>热门</span>
                          </div>
                        )}

                        {/* Discount Badge */}
                        {pkg.discount > 0 && (
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md z-10">
                            -{pkg.discount}%
                          </div>
                        )}

                        <CardContent className="relative p-5 text-center">
                          {/* Icon */}
                          <div className={`w-14 h-14 mx-auto mb-3 bg-gradient-to-br ${pkg.theme.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className={`w-7 h-7 ${pkg.theme.iconColor}`} />
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.title}</h3>
                          <p className="text-xs text-gray-600 mb-4 leading-relaxed">{pkg.description}</p>

                          {/* Price */}
                          <div className="mb-4">
                            <div className="text-2xl font-bold text-gray-900 mb-1">{pkg.mCoins}</div>
                            <div className="text-xs text-gray-500 mb-2">M币</div>
                            
                            {/* 显示折扣价格 */}
                            <div className="flex items-center justify-center gap-2 mb-1">
                              {pkg.discount > 0 && pkg.originalPrice && (
                                <div className="text-sm text-gray-400 line-through">
                                  ${pkg.originalPrice.toFixed(1)}
                                </div>
                              )}
                              <div className="text-lg font-bold text-orange-600">${pkg.usdt}</div>
                            </div>
                            <div className="text-xs text-gray-500 mb-2">USDT</div>
                            
                            {/* 显示节省金额 */}
                            {pkg.discount > 0 && pkg.savedAmount && pkg.savedAmount > 0 && (
                              <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                节省 ${pkg.savedAmount.toFixed(1)}
                              </div>
                            )}
                          </div>
                          
                          {/* Action button */}
                          <button 
                            onClick={() => handlePackageSelect(pkg)}
                            className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 transform group-hover:scale-105 ${
                              pkg.popular
                                ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-lg"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
                            }`}
                          >
                            选择套餐
                          </button>
                          
                          {/* Bottom accent */}
                          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${pkg.theme.bottomBar}`}></div>
                        </CardContent>


                      </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="exchange">
              <div className="max-w-lg mx-auto">
                <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-60"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                  
                  <CardHeader className="relative bg-gradient-to-r from-green-600/10 to-emerald-600/10 pb-3">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Gift className="h-4 w-4 text-white" />
                      </div>
                      兑换码充值
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative space-y-4 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">兑换码</span>
                      </div>
                      <Input
                        id="exchange-code"
                        placeholder="请输入您的兑换码"
                        value={exchangeCode}
                        onChange={(e) => setExchangeCode(e.target.value)}
                        className="h-10 text-center font-mono"
                      />
                    </div>



                    <Button
                      onClick={handleExchangeCode}
                      disabled={!exchangeCode.trim() || isProcessingCode}
                      className="w-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                      size="sm"
                    >
                      {isProcessingCode ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          处理中...
                        </div>
                      ) : (
                        "使用兑换码"
                      )}
                    </Button>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">使用说明</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed pl-6">
                        兑换码通常由活动或推广获得，每个兑换码只能使用一次，兑换成功后M币将立即到账。
                      </p>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <QrCode className="w-5 h-5 text-orange-600" />
                USDT支付
              </DialogTitle>
              <DialogDescription className="text-gray-600">请使用USDT钱包扫描二维码或转账到指定地址</DialogDescription>
            </DialogHeader>

            {paymentInfo && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">购买数量:</span>
                    <span className="text-sm font-medium text-gray-900">{paymentInfo.packageInfo?.mCoinAmount || 0} M币</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">支付金额:</span>
                    <span className="text-sm font-bold text-gray-900">{paymentInfo.usdtAmount} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">剩余时间:</span>
                    <span className={`text-sm font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-orange-600'}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  {paymentInfo.packageInfo?.discount && paymentInfo.packageInfo.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">折扣:</span>
                      <span className="text-sm">-{paymentInfo.packageInfo.discount}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>订单号:</span>
                    <span className="font-mono">{paymentInfo.paymentId}</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-block p-3 bg-white rounded-lg border">
                    {qrCodeDataURL ? (
                      <img
                        src={qrCodeDataURL}
                        alt="USDT Payment QR Code"
                        className="w-40 h-40 mx-auto"
                      />
                    ) : (
                      <div className="w-40 h-40 flex flex-col items-center justify-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mb-2"></div>
                        <span className="text-sm">生成二维码中...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">使用USDT钱包扫描二维码支付</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-900">USDT钱包地址 (TRC20)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input value={paymentInfo.walletAddress} readOnly className="font-mono text-sm" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyAddress}
                      className="flex-shrink-0 bg-transparent"
                    >
                      {copySuccess ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  {copySuccess && <p className="text-xs text-green-600 mt-1">地址已复制到剪贴板</p>}
                </div>

                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <h4 className="text-sm font-medium text-orange-900 mb-2">支付说明:</h4>
                  <ul className="text-xs text-orange-800 space-y-1">
                    {Array.isArray(paymentInfo.paymentInstructions) ? (
                      // 如果API返回的是数组格式
                      paymentInfo.paymentInstructions.map((instruction, index) => (
                        <li key={index}>• {instruction}</li>
                      ))
                    ) : (
                      // 如果API返回的是字符串格式，按行分割
                      paymentInfo.paymentInstructions.split('\n').map((instruction, index) => (
                        <li key={index}>• {instruction}</li>
                      ))
                    )}
                  </ul>
                </div>

                {paymentStatus === "pending" && (
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                      <span className="text-sm text-yellow-800 font-medium">正在检查支付状态...</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowPaymentDialog(false)
                      stopStatusCheck()
                    }}
                  >
                    取消
                  </Button>
                  {paymentStatus === "pending" ? (
                    <Button 
                      className="flex-1 bg-yellow-600 text-white hover:bg-yellow-700" 
                      onClick={stopStatusCheck}
                    >
                      停止检查
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1 bg-gray-900 text-white hover:bg-gray-800" 
                      onClick={handlePaymentComplete}
                    >
                      我已完成支付
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent className="max-w-md text-center">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                {resultType === "success" ? (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                )}
              </div>
              <DialogTitle
                className={`text-lg font-bold ${resultType === "success" ? "text-green-600" : "text-red-600"}`}
              >
                {resultType === "success" ? "操作成功" : "操作失败"}
              </DialogTitle>
              <DialogDescription className="text-sm mt-2 text-gray-600">{resultMessage}</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {resultType === "success" && resultAmount > 0 && (
                <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                  <div className="text-xl font-bold text-green-600">+{resultAmount} M币</div>
                  <div className="text-xs text-green-600/80 mt-1">已添加到您的账户</div>
                </div>
              )}

              {resultType === "failed" && (
                <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-200">
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">请重试或联系客服</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleCloseResult}>
                关闭
              </Button>
              {resultType === "success" && (
                <Button className="flex-1 bg-gray-900 text-white hover:bg-gray-800" onClick={handleCloseResult}>
                  继续充值
                </Button>
              )}
              {resultType === "failed" && (
                <Button
                  className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
                  onClick={handleRetryPayment}
                >
                  重试
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <RechargeFooter />
    </div>
  )
}
