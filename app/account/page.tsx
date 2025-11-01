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
  Edit,
  Camera,
  Save,
  Calendar,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Header from "@/components/layout/header"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"



export default function AccountPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  })
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState<string>(user?.avatarSeed || "Felix")
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<string>(user?.avatarStyle || "adventurer")

  // 检查URL参数，如果有edit=avatar则自动打开头像选择器
  useEffect(() => {
    if (searchParams.get('edit') === 'avatar') {
      setShowAvatarSelector(true)
    }
  }, [searchParams])

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">请先登录以查看账户信息</p>
        </div>
      </div>
    )
  }

  const handleSaveProfile = () => {
    // TODO: Implement profile update logic
    console.log("Saving profile:", editedUser)
    setIsEditing(false)
    setShowSuccessDialog(true)
    setEditedUser({ ...editedUser, password: "" })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t("account.status.completed")
      case "failed":
        return t("account.status.failed")
      case "pending":
        return t("account.status.pending")
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
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                    
                    <DialogHeader className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 pb-4 -mx-6 -mt-6 px-6 pt-6 mb-6">
                      <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                          <Camera className="h-4 w-4 text-white" />
                        </div>
                        选择头像
                      </DialogTitle>
                      <DialogDescription className="text-sm text-gray-600 mt-1">
                        从下面选择一个你喜欢的头像风格和变体
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 relative">
                      {/* 内容区域 - 参考CardInput的设计 */}
                      <div className="max-h-[400px] overflow-y-auto bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4">
                        <DiceBearSelector 
                          selectedSeed={selectedAvatarSeed}
                          selectedStyle={selectedAvatarStyle as any}
                          onSelect={(seed, style) => {
                            setSelectedAvatarSeed(seed)
                            setSelectedAvatarStyle(style)
                          }}
                          showCategories={true}
                          showStyles={true}
                        />
                      </div>
                      
                      {/* 操作按钮区域 */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          <span>当前选择: {selectedAvatarStyle}</span>
                          <span className="ml-4 text-blue-600">实时预览</span>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              // 重置为原来的头像
                              setSelectedAvatarSeed(user?.avatarSeed || "Felix")
                              setSelectedAvatarStyle(user?.avatarStyle || "adventurer")
                              setShowAvatarSelector(false)
                            }}
                            className="border-gray-200 hover:bg-gray-50 transition-all duration-200"
                          >
                            取消
                          </Button>
                          <Button 
                            onClick={() => {
                              // 这里需要调用API保存头像信息到后端
                              console.log('保存头像:', { seed: selectedAvatarSeed, style: selectedAvatarStyle })
                              setShowAvatarSelector(false)
                              setShowSuccessDialog(true)
                            }}
                            className="font-semibold py-2 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            保存头像
                          </Button>
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
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="w-4 h-4 mr-2" />
                    编辑资料
                  </Button>
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
                  <Badge variant="secondary">活跃用户</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              个人资料
            </TabsTrigger>
            <TabsTrigger value="recharge" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              充值记录
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>个人信息</CardTitle>
                <CardDescription>管理您的账户信息和偏好设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">用户名</Label>
                    <Input
                      id="name"
                      value={isEditing ? editedUser.name : (user.name || user.username || user.email)}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱地址</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? editedUser.email : user.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="password">修改密码</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="输入新密码（留空则不修改）"
                        value={editedUser.password}
                        onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="joined">注册时间</Label>
                    <Input id="joined" value="2024-01-01" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">账户状态</Label>
                    <Input id="status" value="正常" disabled />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      保存更改
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      取消
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>



          {/* Recharge Records Tab */}
          <TabsContent value="recharge">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>充值记录</CardTitle>
                    <CardDescription>查看您的所有充值交易历史</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      日期范围
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      导出
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日期</TableHead>
                      <TableHead>充值金额</TableHead>
                      <TableHead>支付金额</TableHead>
                      <TableHead>支付方式</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>交易哈希</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* TODO: 从API获取真实的充值记录数据 */}
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        暂无充值记录
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
              保存成功
            </AlertDialogTitle>
            <AlertDialogDescription>您的个人资料已成功更新。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
