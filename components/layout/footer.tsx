import React from "react"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Globe } from "lucide-react"

export function Footer() {
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
              <h3 className="font-bold text-gray-900">智能卡片分析</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              基于BIN码的高效银行卡分类工具，支持多维度智能分析，为您提供准确可靠的卡片信息识别服务。
            </p>
          </div>

          {/* 核心特性 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              核心特性
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                多维度智能分类
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                实时BIN信息查询
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                批量数据处理
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                99.9%识别准确率
              </li>
            </ul>
          </div>

          {/* 支持信息 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-600" />
              全球支持
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
              支持全球主流卡组织，覆盖200+国家和地区
            </p>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-6"></div>

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2025 智能卡片分析系统. 保留所有权利.
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>数据更新: 实时同步</span>
            <span>•</span>
            <span>服务状态: 正常运行</span>
            <span>•</span>
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs">
              在线
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}