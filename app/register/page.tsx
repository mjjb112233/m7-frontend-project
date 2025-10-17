"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Check } from "lucide-react"
import { useState } from "react"
import Header from "@/components/layout/header"
import { useAuth } from "@/contexts/auth-context" // Added useAuth import
import { useRouter } from "next/navigation" // Added useRouter import
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const { register } = useAuth() // Added register function from auth context
  const router = useRouter() // Added router for navigation
  const [formData, setFormData] = useState({
    username: "", // Added username field
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 清除之前的错误状态
    setShowErrorAlert(false)
    setFieldErrors({})
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("密码不匹配")
      setShowErrorAlert(true)
      return
    }

    setIsLoading(true)
    try {
      const success = await register(formData.username, formData.email, formData.password)
      if (success) {
        // 显示成功提示
        setShowSuccessAlert(true)
        // 2秒后跳转到登录页面
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setErrorMessage("注册失败，请重试")
        setShowErrorAlert(true)
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      
      // 处理API返回的错误信息
      if (error.response) {
        const errorData = await error.response.json()
        if (errorData.errors) {
          setFieldErrors(errorData.errors)
        }
        setErrorMessage(errorData.message || "注册过程中发生错误")
      } else {
        setErrorMessage("注册过程中发生错误")
      }
      setShowErrorAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const passwordRequirements = [
    { text: "至少8个字符", met: formData.password.length >= 8 },
    { text: "包含大写字母", met: /[A-Z]/.test(formData.password) },
    { text: "包含小写字母", met: /[a-z]/.test(formData.password) },
    { text: "包含数字", met: /\d/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">创建账户</CardTitle>
              <CardDescription>注册新账户开始使用我们的服务</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 成功提示框 */}
              {showSuccessAlert && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    注册成功！正在跳转到登录页面...
                  </AlertDescription>
                </Alert>
              )}

              {/* 错误提示框 */}
              {showErrorAlert && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="space-y-2">
                      <p>{errorMessage}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowErrorAlert(false)
                          setFieldErrors({})
                          setErrorMessage("")
                        }}
                        className="text-red-700 border-red-300 hover:bg-red-100"
                      >
                        返回注册
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="输入您的用户名"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    required
                    className={`h-11 ${fieldErrors.username ? "border-red-500" : ""}`}
                  />
                  {fieldErrors.username && (
                    <p className="text-xs text-red-600">{fieldErrors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="输入您的邮箱"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className={`h-11 ${fieldErrors.email ? "border-red-500" : ""}`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="创建安全密码"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                      className={`h-11 pr-10 ${fieldErrors.password ? "border-red-500" : ""}`}
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

                  {/* Password requirements */}
                  {formData.password && (
                    <div className="space-y-1 text-xs">
                      {passwordRequirements.map((req, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 ${req.met ? "text-green-600" : "text-muted-foreground"}`}
                        >
                          <Check className={`w-3 h-3 ${req.met ? "text-green-600" : "text-muted-foreground"}`} />
                          <span>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {fieldErrors.password && (
                    <p className="text-xs text-red-600">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认密码</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="再次输入密码"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-destructive">密码不匹配</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    我同意{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      服务条款
                    </Link>{" "}
                    和{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      隐私政策
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-medium bg-black text-white hover:bg-gray-800"
                  disabled={!formData.agreeToTerms || formData.password !== formData.confirmPassword || isLoading}
                >
                  {isLoading ? "创建中..." : "创建账户"}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                已有账户？{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  立即登录
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
