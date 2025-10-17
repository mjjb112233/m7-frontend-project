"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Coins } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"

export function UserDropdown() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/") // 跳转到首页
  }

  const handleAccountInfo = () => {
    router.push("/account")
  }

  const handleSettings = () => {
    router.push("/account?tab=profile")
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 rounded-full border border-amber-200/50 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="p-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full">
          <Coins className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          {user.mCoins.toLocaleString()}
        </span>
        <span className="text-xs text-amber-600/80 font-medium">M币</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 ring-2 ring-transparent hover:ring-blue-200/50 transition-all duration-200 hover:shadow-lg"
          >
            <Avatar className="h-10 w-10 ring-2 ring-gradient-to-r ring-blue-200/30">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username || user.email} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                {(user.username || user.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* 在线状态指示器 */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 shadow-xl border-blue-200/50" align="end" forceMount>
          <div className="flex items-center justify-start gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username || user.email} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                {(user.username || user.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 leading-none">
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-gray-900">{user.username || user.email}</p>
                <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full font-medium">
                  Lv.{user.level}
                </span>
              </div>
              <p className="w-[180px] truncate text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-blue-200/30" />
          <DropdownMenuItem onClick={handleAccountInfo} className="hover:bg-blue-50 transition-colors duration-200">
            <User className="mr-3 h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{t("user.accountInfo") || "账户信息"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettings} className="hover:bg-blue-50 transition-colors duration-200">
            <Settings className="mr-3 h-4 w-4 text-blue-600" />
            <span className="text-gray-700">{t("user.settings") || "设置"}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-blue-200/30" />
          <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50 transition-colors duration-200">
            <LogOut className="mr-3 h-4 w-4 text-red-500" />
            <span className="text-red-600">{t("user.logout") || "退出登录"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
