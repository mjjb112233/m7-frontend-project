import React from "react"
import { Badge } from "@/components/ui/badge"
import { User, Sparkles, Globe, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function InfoGenerateFooter() {
  const { t } = useLanguage()
  
  return (
    <footer className="border-t border-cyan-200/50 mt-16">
      <div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* 品牌信息 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <User className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{t("info.footer.brandTitle")}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t("info.footer.brandDesc")}
              </p>
            </div>

            {/* 核心特性 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-600" />
                {t("info.footer.coreFeatures")}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  {t("info.footer.realPersonalInfo")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  {t("info.footer.realLocation")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  {t("info.footer.completeIdentity")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  {t("info.footer.batchProcessing")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  {t("info.footer.csvExport")}
                </li>
              </ul>
            </div>

            {/* 支持信息 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="h-4 w-4 text-cyan-600" />
                {t("info.footer.supportedRegions")}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs">
                  {t("info.footer.country.usa")}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  {t("info.footer.country.uk")}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  {t("info.footer.country.canada")}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  {t("info.footer.country.australia")}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                  {t("info.footer.country.germany")}
                </Badge>
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-xs">
                  {t("info.footer.country.france")}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t("info.footer.regionsDesc")}
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent mb-6"></div>

          {/* 底部信息 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              {t("info.footer.copyright")}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>{t("info.footer.dataSource")}</span>
              <span>•</span>
              <span>{t("info.footer.generationSpeed")}</span>
              <span>•</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {t("info.footer.safeReliable")}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}