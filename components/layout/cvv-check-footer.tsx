import React from "react"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Zap, Globe, Lock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function CVVCheckFooter() {
  const { t } = useLanguage()
  return (
    <footer className="border-t border-blue-200/50 mt-16">
      <div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* 品牌信息 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                  <CreditCard className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{t("cvv.footer.title")}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t("cvv.footer.description")}
              </p>
            </div>

            {/* 核心特性 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                {t("cvv.footer.coreFeatures")}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {t("cvv.footer.multiChannelDetection")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {t("cvv.footer.realTimeFeedback")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {t("cvv.footer.batchProcessing")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {t("cvv.footer.autoStopControl")}
                </li>
              </ul>
            </div>

            {/* 安全保障 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                {t("cvv.footer.security")}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  {t("cvv.footer.sslEncryption")}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  {t("cvv.footer.dataProtection")}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  {t("cvv.footer.privacySecurity")}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                  {t("cvv.footer.realTimeMonitoring")}
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                  {t("cvv.footer.riskControl")}
                </Badge>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                  {t("cvv.footer.complianceDetection")}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t("cvv.footer.securityStandard")}
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mb-6"></div>

          {/* 底部信息 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              {t("cvv.footer.copyright")}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{t("cvv.footer.detectionSpeed")}</span>
              <span>•</span>
              <span>{t("cvv.footer.accuracy")}</span>
              <span>•</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs flex items-center gap-1">
                <Lock className="h-3 w-3" />
                {t("cvv.footer.securityCertification")}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}