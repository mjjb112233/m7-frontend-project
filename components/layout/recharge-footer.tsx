"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Zap, CreditCard } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function RechargeFooter() {
  const { t } = useLanguage()
  return (
    <footer className="border-t border-orange-200/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* 充值服务特色 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Coins className="h-3 w-3 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">{t("recharge.footer.serviceTitle")}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t("recharge.footer.serviceDesc")}
            </p>
          </div>

          {/* 充值优势 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              {t("recharge.footer.advantages")}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                {t("recharge.footer.packageOptions")}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                {t("recharge.footer.discounts")}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                {t("recharge.footer.instantCredit")}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                {t("recharge.footer.exchangeCode")}
              </li>
            </ul>
          </div>

          {/* 支付安全 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-600" />
              {t("recharge.footer.security")}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t("recharge.footer.paymentMethod")}</span>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3 text-orange-600" />
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                    USDT
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t("recharge.footer.creditTime")}</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  {t("recharge.footer.instant")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{t("recharge.footer.securityLevel")}</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  {t("recharge.footer.bankLevel")}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent mb-6"></div>

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            {t("recharge.footer.copyright")}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>{t("recharge.footer.ssl")}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>{t("recharge.footer.instantProcessing")}</span>
            </div>
            <span>•</span>
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-xs">
              {t("recharge.footer.service247")}
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}