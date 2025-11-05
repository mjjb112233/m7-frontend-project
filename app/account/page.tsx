"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DiceBearAvatar, DiceBearSelector } from "@/components/ui/avatar-dicebear"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  User,
  Coins,
  CreditCard,
  Camera,
  Save,
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react"
import Header from "@/components/layout/header"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { authenticatedRequest } from "@/lib/api"



export default function AccountPage() {
  const { user, token, refreshUserInfo, logout } = useAuth()
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  // 修改密码相关状态
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string>("")
  // 密码显示/隐藏状态
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState<string>(user?.avatarSeed || "Felix")
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<string>(user?.avatarStyle || "adventurer")
  const [isSavingAvatar, setIsSavingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string>("")
  const [rechargeHistory, setRechargeHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historyError, setHistoryError] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("profile")

  // 检查URL参数，如果有edit=avatar则自动打开头像选择器
  useEffect(() => {
    if (searchParams.get('edit') === 'avatar') {
      setShowAvatarSelector(true)
    }
  }, [searchParams])

  // 当用户信息更新时，同步头像选择状态
  useEffect(() => {
    if (user) {
      setSelectedAvatarSeed(user.avatarSeed || "Felix")
      setSelectedAvatarStyle(user.avatarStyle || "adventurer")
    }
  }, [user])

  // 获取充值历史
  const fetchRechargeHistory = async () => {
    if (!token) {
      setHistoryError("请先登录")
      return
    }

    setLoadingHistory(true)
    setHistoryError("")
    try {
      const response = await authenticatedRequest('/recharge/history', token, {
        method: 'GET'
      })

      if (response.success && response.data) {
        // API 返回格式: { success: true, data: [...], pagination: {...} }
        const historyData = Array.isArray(response.data) ? response.data : []
        setRechargeHistory(historyData)
      } else {
        setHistoryError(response.message || "获取充值历史失败")
      }
    } catch (error: any) {
      console.error('获取充值历史错误:', error)
      setHistoryError(error.message || "获取充值历史失败，请稍后重试")
    } finally {
      setLoadingHistory(false)
    }
  }

  // 当切换到充值记录 tab 时获取数据
  useEffect(() => {
    if (activeTab === "recharge" && token) {
      fetchRechargeHistory()
    }
  }, [activeTab, token])

  // 保存头像到后端
  const handleSaveAvatar = async () => {
    if (!token) {
      setAvatarError(t("account.loginRequired") || "请先登录")
      return
    }

    setIsSavingAvatar(true)
    setAvatarError("")

    try {
      const response = await authenticatedRequest('/auth/avatar', token, {
        method: 'PUT',
        body: JSON.stringify({
          avatarSeed: selectedAvatarSeed,
          avatarStyle: selectedAvatarStyle
        })
      })

      if (response.success) {
        // 刷新用户信息以获取最新的头像数据
        await refreshUserInfo?.()
        setShowAvatarSelector(false)
        setShowSuccessDialog(true)
      } else {
        setAvatarError(response.message || "保存头像失败")
      }
    } catch (error: any) {
      console.error('保存头像失败:', error)
      setAvatarError(error.message || "保存头像失败，请稍后重试")
    } finally {
      setIsSavingAvatar(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">{t("account.loginRequired")}</p>
        </div>
      </div>
    )
  }

  // 修改密码处理函数
  const handleChangePassword = async () => {
    if (!token) {
      setPasswordError("请先登录")
      return
    }

    // 验证输入
    if (!passwordData.oldPassword || passwordData.oldPassword.trim() === '') {
      setPasswordError("请输入旧密码")
      return
    }

    if (!passwordData.newPassword || passwordData.newPassword.trim() === '') {
      setPasswordError("请输入新密码")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("新密码至少需要6个字符")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("新密码和确认密码不匹配")
      return
    }

    setIsChangingPassword(true)
    setPasswordError("")

    try {
      console.log("[账户] 修改密码")

      const response = await authenticatedRequest('/auth/change-password', token, {
        method: 'POST',
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        })
      })

      if (response.success) {
        console.log("[账户] 密码修改成功")
        // 清空密码表单
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        // 重置密码显示状态
        setPasswordVisibility({
          oldPassword: false,
          newPassword: false,
          confirmPassword: false,
        })
        // 退出登录
        logout()
        // 跳转到登录页面
        router.push("/login")
      } else {
        console.error("[账户] 修改密码失败:", response.message)
        setPasswordError(response.message || "修改密码失败，请稍后重试")
      }
    } catch (error: any) {
      console.error("[账户] 修改密码异常:", error)
      setPasswordError(error.message || "修改密码失败，请稍后重试")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <CreditCard className="w-4 h-4 text-blue-500" />
      case "processing":
        return <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
      case "timeout":
      case "expired":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t("account.status.completed")
      case "pending":
        return t("account.status.pending")
      case "processing":
        return t("account.status.processing")
      case "timeout":
      case "expired":
        return t("account.status.timeout")
      case "failed":
        return t("account.status.failed")
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* User Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Dialog open={showAvatarSelector} onOpenChange={setShowAvatarSelector}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer">
                      <DiceBearAvatar 
                        seed={selectedAvatarSeed}
                        style={selectedAvatarStyle as any}
                        size={128}
                        showBorder={true}
                        animated={true}
                        className="hover:scale-105 transition-all duration-300"
                      />
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden border-0 shadow-xl">
                    {/* 参考bin分类页面的设计风格 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-30"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                    
                    <DialogHeader className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 pb-4 -mx-6 -mt-6 px-6 pt-6 mb-6">
                      <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                          <Camera className="h-4 w-4 text-white" />
                        </div>
                        {t("account.selectAvatar")}
                      </DialogTitle>
                      <DialogDescription className="text-sm text-gray-600 mt-1">
                        {t("account.selectAvatarDesc")}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 relative">
                      {/* 内容区域 - 参考CardInput的设计 */}
                      <div className="max-h-[400px] overflow-y-auto bg-white/80 border border-gray-200 rounded-lg p-4">
                        <DiceBearSelector 
                          selectedSeed={selectedAvatarSeed}
                          selectedStyle={selectedAvatarStyle as any}
                          onSelect={(seed, style) => {
                            setSelectedAvatarSeed(seed)
                            setSelectedAvatarStyle(style)
                            setAvatarError("") // 选择新头像时清除错误信息
                          }}
                          showCategories={true}
                          showStyles={true}
                        />
                      </div>
                      
                      {/* 操作按钮区域 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          <span>{t("account.currentSelection")}: {selectedAvatarStyle}</span>
                          <span className="ml-4 text-blue-600">{t("account.realTimePreview")}</span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          {avatarError && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center gap-2">
                              <XCircle className="w-4 h-4" />
                              {avatarError}
                            </div>
                          )}
                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                // 重置为原来的头像
                                setSelectedAvatarSeed(user?.avatarSeed || "Felix")
                                setSelectedAvatarStyle(user?.avatarStyle || "adventurer")
                                setShowAvatarSelector(false)
                                setAvatarError("")
                              }}
                              disabled={isSavingAvatar}
                              className="border-gray-200 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                            >
                              {t("account.cancel")}
                            </Button>
                            <Button 
                              onClick={handleSaveAvatar}
                              disabled={isSavingAvatar}
                              className="font-semibold py-2 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSavingAvatar ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                  {t("account.saving")}
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  {t("account.saveAvatar")}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 底部装饰条 - 参考CardInput */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{user.name || user.username || user.email}</h1>
                </div>
                <p className="text-muted-foreground mb-4">{user.email}</p>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
                    <Coins className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-700">{user.mCoins.toLocaleString()} M币</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-700">Lv.{user.level}</span>
                  </div>
                  <Badge variant="secondary">{t("account.activeUser")}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t("account.profile")}
            </TabsTrigger>
            <TabsTrigger value="recharge" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              {t("account.rechargeRecords")}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t("account.personalInfo")}</CardTitle>
                <CardDescription>{t("account.manageAccount")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("account.username")}</Label>
                    <Input
                      id="name"
                      value={user.name || user.username || user.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("account.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joined">{t("account.joinDate")}</Label>
                    <Input 
                      id="joined" 
                      value={user.createdAt 
                        ? new Date(user.createdAt * 1000).toLocaleDateString(
                            language === "en" ? "en-US" : "zh-CN",
                            {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }
                          )
                        : "-"
                      } 
                      disabled 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">{t("account.accountStatus")}</Label>
                    <Input id="status" value={t("account.normal")} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 修改密码卡片 */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("account.changePassword")}</CardTitle>
                <CardDescription>{t("account.changePasswordDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">{t("account.oldPassword")}</Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={passwordVisibility.oldPassword ? "text" : "password"}
                        placeholder={t("account.oldPasswordPlaceholder")}
                        value={passwordData.oldPassword}
                        onChange={(e) => {
                          setPasswordData({ ...passwordData, oldPassword: e.target.value })
                          setPasswordError("")
                        }}
                        disabled={isChangingPassword}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisibility({
                          ...passwordVisibility,
                          oldPassword: !passwordVisibility.oldPassword
                        })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        disabled={isChangingPassword}
                      >
                        {passwordVisibility.oldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t("account.newPassword")}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={passwordVisibility.newPassword ? "text" : "password"}
                        placeholder={t("account.newPasswordPlaceholder2")}
                        value={passwordData.newPassword}
                        onChange={(e) => {
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                          setPasswordError("")
                        }}
                        disabled={isChangingPassword}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisibility({
                          ...passwordVisibility,
                          newPassword: !passwordVisibility.newPassword
                        })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        disabled={isChangingPassword}
                      >
                        {passwordVisibility.newPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirmPassword">{t("account.confirmNewPassword")}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={passwordVisibility.confirmPassword ? "text" : "password"}
                        placeholder={t("account.confirmPasswordPlaceholder")}
                        value={passwordData.confirmPassword}
                        onChange={(e) => {
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          setPasswordError("")
                        }}
                        disabled={isChangingPassword}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisibility({
                          ...passwordVisibility,
                          confirmPassword: !passwordVisibility.confirmPassword
                        })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        disabled={isChangingPassword}
                      >
                        {passwordVisibility.confirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {passwordError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    {passwordError}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("account.changingPassword")}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {t("account.changePassword")}
                      </>
                    )}
                  </Button>
                  {!isChangingPassword && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setPasswordData({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                        setPasswordError("")
                      }}
                    >
                      {t("account.cancel")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Recharge Records Tab */}
          <TabsContent value="recharge">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("account.rechargeRecords")}</CardTitle>
                    <CardDescription>{t("account.viewRechargeHistory")}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {t("account.dateRange")}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      {t("account.export")}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                      <p className="text-gray-600">{t("account.loading") || "加载中..."}</p>
                    </div>
                  </div>
                ) : historyError ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600">{historyError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={fetchRechargeHistory}
                      >
                        {t("account.retry") || "重试"}
                      </Button>
                    </div>
                  </div>
                ) : rechargeHistory.length === 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("account.date")}</TableHead>
                        <TableHead>{t("account.orderNumber")}</TableHead>
                        <TableHead>{t("account.rechargeAmount")}</TableHead>
                        <TableHead>{t("account.paymentAmount")}</TableHead>
                        <TableHead>{t("account.paymentMethod")}</TableHead>
                        <TableHead>{t("account.status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          {t("account.noRechargeRecords")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("account.date")}</TableHead>
                        <TableHead>{t("account.orderNumber")}</TableHead>
                        <TableHead>{t("account.rechargeAmount")}</TableHead>
                        <TableHead>{t("account.paymentAmount")}</TableHead>
                        <TableHead>{t("account.paymentMethod")}</TableHead>
                        <TableHead>{t("account.status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rechargeHistory.map((record) => {
                        // 格式化日期：从 Unix 时间戳转换为可读格式
                        const formatDate = (timestamp: number) => {
                          if (!timestamp) return "-"
                          const date = new Date(timestamp * 1000)
                          return date.toLocaleString("zh-CN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        }

                        return (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.createdAt)}</TableCell>
                            <TableCell>
                              <span className="font-mono text-xs">
                                {record.orderId || record.id}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold text-yellow-600">
                                {record.mCoins} {t("recharge.coins")}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">${record.amount} USDT</span>
                            </TableCell>
                            <TableCell>USDT</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(record.status)}
                                <span>{getStatusText(record.status)}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              {t("account.saveSuccess")}
            </AlertDialogTitle>
            <AlertDialogDescription>{t("account.profileUpdated")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>{t("account.confirm")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
