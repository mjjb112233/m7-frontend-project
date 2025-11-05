import React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Average_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CustomerService } from "@/components/business/customer-service"
import { DynamicAnnouncement } from "@/components/business/dynamic-announcement"
import { MaintenanceDialog } from "@/components/business/maintenance-dialog"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"
import configData from "../config/app.config.json"
import type { AppConfigData } from "@/lib/config/types"
import "./globals.css"

const averageSans = Average_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-logo",
  display: "swap",
})

// 从配置文件直接读取logo网站名字（避免在服务端调用函数）
const config = configData as AppConfigData
const brandingConfig = config?.branding
const appConfig = config?.app

// 获取网站标题：优先使用tabTitle，其次使用logoName，再次使用copyWebsiteName，最后使用默认值
const websiteTitle = brandingConfig?.tabTitle || brandingConfig?.logoName || brandingConfig?.copyWebsiteName || "M7 Platform"
const websiteDescription = appConfig?.name || "M7 金融科技平台"

export const metadata: Metadata = {
  title: websiteTitle,
  description: websiteDescription,
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${averageSans.variable}`}>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <Suspense fallback={null}>
              <DynamicAnnouncement />
              {children}
              <CustomerService />
              <MaintenanceDialog />
            </Suspense>
          </LanguageProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}