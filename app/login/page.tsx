"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import Header from "@/components/layout/header"

import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { t } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 开始登录处理，邮箱:", email, "密码:", password)
    
    // 清除之前的状态
    setShowErrorAlert(false)
    setShowSuccessAlert(false)
    setErrorMessage("")
    
    setIsLoading(true)
    try {
      console.log("📡 调用login函数...")
      const success = await login(email, password)
      console.log("📡 login函数返回:", success)
      
      if (success) {
        console.log("✅ 登录成功，显示成功提示")
        // 显示成功提示
        setShowSuccessAlert(true)
        // 2秒后跳转到首页
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        console.log("❌ 登录失败，显示错误提示")
        setErrorMessage("登录失败，请检查账号密码")
        setShowErrorAlert(true)
      }
    } catch (error: any) {
      console.error("❌ Login error:", error)
      
      // 处理API返回的错误信息
      if (error.message) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("登录过程中发生错误")
      }
      setShowErrorAlert(true)
    } finally {
      console.log("🏁 登录处理完成，设置loading为false")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex items-center justify-center p-4 py-16 relative">


        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">{t("login.welcome")}</CardTitle>
              <CardDescription>{t("login.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 成功提示框 */}
              {showSuccessAlert && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    登录成功！正在跳转到首页...
                  </AlertDescription>
                </Alert>
              )}

              {/* 错误提示框 */}
              {showErrorAlert && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("login.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("login.password")}</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      {t("login.forgotPassword")}
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.passwordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-medium bg-black text-white hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? t("login.loggingIn") || "Logging in..." : t("login.loginButton")}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                {t("login.noAccount")}{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  {t("login.register")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
