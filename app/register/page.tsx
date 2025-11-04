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
import { useLanguage } from "@/contexts/language-context"

export default function RegisterPage() {
  const { t } = useLanguage()
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
  // 移除了 fieldErrors，因为新的响应结构不包含字段级错误

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 清除之前的错误状态
    setShowErrorAlert(false)
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t("register.passwordMismatch"))
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
        setErrorMessage(t("register.registerFailed"))
        setShowErrorAlert(true)
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      
      // 处理API返回的错误信息
      if (error.isApiError && error.apiMessage) {
        setErrorMessage(error.apiMessage)
      } else {
        setErrorMessage(t("register.registerError"))
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
    { text: t("register.passwordReq8Chars"), met: formData.password.length >= 8 },
    { text: t("register.passwordReqUppercase"), met: /[A-Z]/.test(formData.password) },
    { text: t("register.passwordReqLowercase"), met: /[a-z]/.test(formData.password) },
    { text: t("register.passwordReqNumber"), met: /\d/.test(formData.password) },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">{t("register.title")}</CardTitle>
              <CardDescription>{t("register.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 成功提示框 */}
              {showSuccessAlert && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {t("register.registerSuccess")}
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
                          setErrorMessage("")
                        }}
                        className="text-red-700 border-red-300 hover:bg-red-100"
                      >
                        {t("register.backToRegister")}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t("register.username")}</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("register.usernamePlaceholder")}
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    required
                    className="h-11"
                  />

                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("register.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("register.emailPlaceholder")}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="h-11"
                  />

                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("register.password")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("register.passwordPlaceholder")}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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

                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("register.confirmPasswordPlaceholder")}
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
                    <p className="text-xs text-destructive">{t("register.passwordMismatch")}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    {t("register.agreeTerms")}{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      {t("register.termsOfService")}
                    </Link>{" "}
                    {t("register.and")}{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      {t("register.privacyPolicy")}
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-medium bg-black text-white hover:bg-gray-800"
                  disabled={!formData.agreeToTerms || formData.password !== formData.confirmPassword || isLoading}
                >
                  {isLoading ? t("register.creating") : t("register.registerButton")}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                {t("register.hasAccount")}{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  {t("register.login")}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
