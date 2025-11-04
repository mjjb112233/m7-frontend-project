"use client"

import React from "react"
import { ScanLine } from "lucide-react"
import { getBrandingConfig } from "@/lib/config"

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className = "", width = 157, height = 48 }: LogoProps) {
  // 安全获取Logo名称，如果配置加载失败则使用默认值
  let logoName = "cc-m7"
  try {
    const brandingConfig = getBrandingConfig()
    logoName = brandingConfig?.logoName || "cc-m7"
  } catch (error) {
    console.error("Failed to get logo name from config:", error)
  }
  
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* 图标 - 使用 ScanLine 图标，更符合检测验证主题 */}
      <ScanLine className="h-8 w-8 text-current flex-shrink-0" />
      
      {/* 文字部分 */}
      <div className="flex flex-col justify-center">
        {/* 主标题: 从配置读取Logo名称 - 几何风格 */}
        <div
          className="font-logo text-[28px] font-normal leading-[0.95] text-current whitespace-nowrap"
          style={{
            letterSpacing: "0.3px",
            fontWeight: 700,
          }}
        >
          {logoName}
        </div>
        
        {/* 副标题: BANK CARD VERIFICATION - 常规字重、无倾斜 */}
        <div
          className="font-logo text-[8px] font-normal uppercase leading-[1.3] text-current mt-0.5"
          style={{
            letterSpacing: "1px",
            fontWeight: 500,
          }}
        >
          BANK CARD VERIFICATION
        </div>
      </div>
    </div>
  )
}