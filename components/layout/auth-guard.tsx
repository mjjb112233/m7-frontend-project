"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"


interface AuthGuardProps {
  children: React.ReactNode
  requiredLevel?: number
  fallbackPath?: string
}

export function AuthGuard({ 
  children, 
  requiredLevel = 1, 
  fallbackPath = "/login" 
}: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // 直接跳转到登录页面
        router.push(fallbackPath)
        return
      } else if (user.level < requiredLevel) {
        // 用户等级不足，显示升级提示
        setShowLoginPrompt(true)
      }
    }
  }, [user, isLoading, requiredLevel, router, fallbackPath])

  // 加载中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  // 未登录时已经在useEffect中处理跳转
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在跳转到登录页面...</p>
        </div>
      </div>
    )
  }

  // 用户等级不足
  if (user.level < requiredLevel) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                权限不足
              </CardTitle>
              <CardDescription>
                此功能需要{requiredLevel}级权限，您当前为{user.level}级用户
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  升级您的账户以获得更多功能权限
                </AlertDescription>
              </Alert>

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => router.push("/recharge")}
                  className="w-full h-11 font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  升级账户
                </Button>
                
                <Button 
                  onClick={() => router.push("/")}
                  variant="ghost"
                  className="w-full h-11"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回首页
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // 用户已登录且权限足够
  return <>{children}</>
}
