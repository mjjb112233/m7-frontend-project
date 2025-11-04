"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, RefreshCw, Database, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function DataSourceInfo() {
  const { t } = useLanguage()
  
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -translate-y-10 translate-x-10"></div>
      
      <CardHeader className="relative bg-gradient-to-r from-green-600/10 to-emerald-600/10 pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
            <Database className="h-4 w-4 text-white" />
          </div>
          {t("bin.dataSourceTitle")}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4 p-4">
        {/* 数据来源 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{t("bin.dataSource")}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed pl-6">
            {t("bin.dataSourceDesc")}
          </p>
        </div>

        {/* 数据准确性 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{t("bin.dataAccuracy")}</span>
          </div>
          <div className="pl-6">
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              {t("bin.dataAccuracyDesc")}
            </p>
            <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold">
              99.9%
            </Badge>
          </div>
        </div>

        {/* 数据更新 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{t("bin.dataUpdate")}</span>
          </div>
          <div className="pl-6">
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              {t("bin.dataUpdateDesc")}
            </p>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {t("bin.realTimeUpdate")}
            </Badge>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
      </CardContent>
    </Card>
  )
}