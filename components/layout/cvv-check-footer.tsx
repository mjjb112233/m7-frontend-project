import React from "react"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Zap, Globe, Lock } from "lucide-react"

export function CVVCheckFooter() {
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
                <h3 className="font-bold text-gray-900">CVV智能检测</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                专业的CVV验证系统，采用多通道检测技术，提供高效、准确的信用卡验证服务，支持实时检测和批量处理。
              </p>
            </div>

            {/* 核心特性 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                核心特性
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  多通道智能检测
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  实时验证反馈
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  批量数据处理
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  自动停止控制
                </li>
              </ul>
            </div>

            {/* 安全保障 */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                安全保障
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  SSL加密
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  数据保护
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  隐私安全
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                  实时监控
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                  风险控制
                </Badge>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                  合规检测
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                采用银行级安全标准，确保检测过程安全可靠
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mb-6"></div>

          {/* 底部信息 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2025 CVV智能检测系统. 保留所有权利.
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>检测速度: 毫秒级响应</span>
              <span>•</span>
              <span>准确率: 99.9%+</span>
              <span>•</span>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 text-xs flex items-center gap-1">
                <Lock className="h-3 w-3" />
                安全认证
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}