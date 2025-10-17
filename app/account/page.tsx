"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  History,
  CreditCard,
  Edit,
  Camera,
  Save,
  Calendar,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Header from "@/components/layout/header"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"

// TODO: 移除模拟数据，使用真实的用户记录数据

export default function AccountPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  })

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
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {(user.name || user.username || user.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>更换头像</DialogTitle>
                      <DialogDescription>上传新的头像图片</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">点击上传头像</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" />
                        </label>
                      </div>
                      <Button className="w-full">保存头像</Button>
                    </div>
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
                  <Badge variant="secondary">活跃用户</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              个人资料
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              使用记录
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

          {/* Usage Records Tab */}
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>使用记录</CardTitle>
                    <CardDescription>查看您的所有操作历史和M币消费记录</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      筛选
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
                      <TableHead>操作类型</TableHead>
                      <TableHead>详情</TableHead>
                      <TableHead>M币消费</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* TODO: 从API获取真实的使用记录数据 */}
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        暂无使用记录
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
