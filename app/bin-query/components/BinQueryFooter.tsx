import React from "react"
import { Badge } from "@/components/ui/badge"
import { Search, Database, Shield, Clock } from "lucide-react"

export function BinQueryFooter() {
  return (
    <footer className="border-t border-green-200/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* BIN查询特色 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Search className="h-3 w-3 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">BIN码查询</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              专业的银行识别码查询工具，提供准确的卡片基础信息和详细属性，支持实时查询和批量处理。
            </p>
          </div>

          {/* 查询能力 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Database className="h-4 w-4 text-green-600" />
              查询能力
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                卡片品牌识别
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                发卡行信息
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                卡片类型判断
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                国家地区识别
              </li>
            </ul>
          </div>

          {/* 技术特性 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              技术保障
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">查询速度</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  &lt; 100ms
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">数据准确率</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  99.8%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">支持BIN范围</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  6-8位
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mb-6"></div>

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2025 BIN查询系统. 专业银行识别码查询服务.
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>响应时间: 实时</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span>数据库: 最新</span>
            </div>
            <span>•</span>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
              服务正常
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}