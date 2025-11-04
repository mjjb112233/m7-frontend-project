import React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Average_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CustomerService } from "@/components/business/customer-service"
import { DynamicAnnouncement } from "@/components/business/dynamic-announcement"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"
import "./globals.css"

const averageSans = Average_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-logo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
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
            </Suspense>
          </LanguageProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}