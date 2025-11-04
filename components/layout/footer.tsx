"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* 品牌信息 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="h-3 w-3 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">{t("bin.footer.brandTitle")}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t("bin.footer.brandDesc")}
            </p>
          </div>

          {/* 核心特性 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              {t("bin.footer.coreFeatures")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                {t("bin.footer.multiDimensionClassification")}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                {t("bin.footer.realTimeBINQuery")}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                {t("bin.footer.batchDataProcessing")}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                {t("bin.footer.accuracyRate")}
              </li>
            </ul>
          </div>

          {/* 支持信息 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-600" />
              {t("bin.footer.globalSupport")}
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                Visa
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                Mastercard
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                UnionPay
              </Badge>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                Amex
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                JCB
              </Badge>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                Discover
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t("bin.footer.globalSupportDesc")}
            </p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-6"></div>

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            {t("bin.footer.copyright")}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{t("bin.footer.dataUpdate")}</span>
            <span>•</span>
            <span>{t("bin.footer.serviceStatus")}</span>
            <span>•</span>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
              {t("bin.footer.online")}
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}