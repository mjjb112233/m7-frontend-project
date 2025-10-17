import React from "react"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Zap, CreditCard } from "lucide-react"

export function RechargeFooter() {
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
              <h3 className="font-bold text-gray-900">M币充值服务</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              安全便捷的USDT充值服务，多种套餐选择，享受专业功能和优惠折扣，支持兑换码快速充值。
            </p>
          </div>

          {/* 充值优势 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              充值优势
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                多种套餐选择
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                优惠折扣活动
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                即时到账服务
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                兑换码支持
              </li>
            </ul>
          </div>

          {/* 支付安全 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-600" />
              安全保障
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">支付方式</span>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3 text-orange-600" />
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                    USDT
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">到账时间</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  即时到账
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">安全等级</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  银行级
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent mb-6"></div>

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2025 M币充值系统. 安全可靠的数字货币充值服务.
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>SSL加密</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>即时处理</span>
            </div>
            <span>•</span>
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-xs">
              24/7服务
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}