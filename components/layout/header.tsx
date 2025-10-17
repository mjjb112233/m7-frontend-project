/**
 * 导航栏组件
 * 
 * 功能说明：
 * 1. 显示网站Logo和导航菜单
 * 2. 根据用户登录状态显示不同的菜单项
 * 3. 根据用户等级控制页面访问权限
 * 4. 显示用户信息和M币余额
 * 5. 提供用户操作菜单（登录、注册、个人中心等）
 * 
 * 权限控制：
 * - 未登录用户：显示CVV检测、BIN分类、充值页面
 * - 1级用户：显示CVV检测、BIN分类、BIN查询、充值页面
 * - 2级用户：显示1级功能 + 信息生成页面
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/layout/language-selector"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { UserDropdown } from "@/components/business/user-dropdown"
import { CreditCard, Shield, Lock, Zap, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const pathname = usePathname()  // 获取当前路径，用于高亮当前页面
  const { t } = useLanguage()     // 获取多语言翻译函数
  const { user } = useAuth()      // 获取用户认证信息
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)  // 移动端菜单展开状态

  /**
   * 获取导航菜单项
   * 根据用户登录状态和等级返回不同的菜单项
   * @returns {Array} 导航菜单项数组
   */
  const getNavItems = () => {
    const defaultItems = [
      { href: "/", label: t("nav.home"), icon: CreditCard },  // 首页（所有用户都显示）
    ]

    if (!user) {
      // 未登录用户：显示CVV检测、BIN分类、充值页面
      defaultItems.push(
        { href: "/cvv-check", label: t("nav.cvvCheck"), icon: Shield },
        { href: "/bin-classify", label: t("nav.binClassify"), icon: CreditCard },
        { href: "/recharge", label: t("nav.recharge"), icon: Zap }
      )
      return defaultItems
    }

    const userLevel = user.level || 0  // 获取用户等级，默认为0

    // 1级用户：显示基础功能（CVV检测、BIN分类、卡信息提取、充值）
    if (userLevel >= 1) {
      defaultItems.push(
        { href: "/cvv-check", label: t("nav.cvvCheck"), icon: Shield },
        { href: "/bin-classify", label: t("nav.binClassify"), icon: CreditCard },
        { href: "/bin-query", label: t("nav.binQuery"), icon: Lock },
        { href: "/recharge", label: t("nav.recharge"), icon: Zap }
      )
    }

    // 2级用户：在1级基础上添加信息生成页面
    if (userLevel >= 2) {
      defaultItems.push({ href: "/info-generate", label: t("nav.infoGenerate"), icon: Zap })
    }



    return defaultItems
  }

  const navItems = getNavItems()

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">FinTech Pro</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                  </Link>
                )
              })}
            </nav>

            <div className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                <LanguageSelector />
                {user ? (
                  <UserDropdown />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        {t("nav.login")}
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">{t("nav.register")}</Button>
                    </Link>
                  </div>
                )}

                {/* 移动端菜单按钮 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] z-40 bg-background border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
