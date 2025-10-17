/**
 * BIN详细信息卡片组件
 * 用于显示BIN查询的详细结果信息
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Building, 
  Globe, 
  Shield, 
  Banknote,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from "lucide-react"
import type { DetailedBINQueryResult } from "@/lib/api/bin-query"

interface BINDetailCardProps {
  data: DetailedBINQueryResult
  className?: string
}

export function BINDetailCard({ data, className = "" }: BINDetailCardProps) {
  // 获取状态图标和颜色
  const getBooleanDisplay = (value: boolean, label: string) => ({
    icon: value ? CheckCircle : XCircle,
    color: value ? "text-green-600" : "text-red-600",
    bgColor: value ? "bg-green-50" : "bg-red-50",
    label: value ? "是" : "否"
  })

  const cardTypeColor = {
    'Credit': 'bg-blue-100 text-blue-800',
    'Debit': 'bg-green-100 text-green-800',
    'Prepaid': 'bg-purple-100 text-purple-800'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 基本信息卡片 */}
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60"></div>
        <CardHeader className="relative bg-gradient-to-r from-blue-600/10 to-indigo-600/10">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">BIN</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">BIN长度</div>
                <div className="font-medium text-gray-900">{data.bin_length} 位</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">卡片品牌</div>
                <div className="font-medium text-gray-900">{data.card_brand}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">卡片类型</div>
                <Badge className={`${cardTypeColor[data.type as keyof typeof cardTypeColor] || 'bg-gray-100 text-gray-800'}`}>
                  {data.type}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Banknote className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">资金来源</div>
                <div className="font-medium text-gray-900">{data.funding_source}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">#</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">卡号长度</div>
                <div className="font-medium text-gray-900">{data.number_length} 位</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">卡段类型</div>
                <div className="font-medium text-gray-900">{data.card_segment_type}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 银行信息卡片 */}
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-60"></div>
        <CardHeader className="relative bg-gradient-to-r from-green-600/10 to-emerald-600/10">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
              <Building className="h-4 w-4 text-white" />
            </div>
            银行信息
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Building className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">银行名称</div>
                <div className="font-medium text-gray-900">{data.bank_name}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Building className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">银行清洁名称</div>
                <div className="font-medium text-gray-900">{data.bank_clean_name}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">¤</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">发行货币</div>
                <div className="font-medium text-gray-900">{data.issuer_currency}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">发卡国家</div>
                <div className="font-medium text-gray-900">
                  {data.country_name} ({data.country_alpha2})
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 产品信息卡片 */}
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-60"></div>
        <CardHeader className="relative bg-gradient-to-r from-purple-600/10 to-violet-600/10">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
              <Info className="h-4 w-4 text-white" />
            </div>
            产品信息
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">产品名称</div>
                <div className="font-medium text-gray-900">{data.product_name}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600">认证名称</div>
                <div className="font-medium text-gray-900">{data.authentication_name}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 功能特性卡片 */}
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-60"></div>
        <CardHeader className="relative bg-gradient-to-r from-orange-600/10 to-red-600/10">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            功能特性
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { key: 'prepaid', label: '预付费卡', value: data.prepaid },
              { key: 'auth_required', label: '需要认证', value: data.auth_required },
              { key: 'domestic_only', label: '仅限国内', value: data.domestic_only },
              { key: 'gambling_blocked', label: '阻止赌博', value: data.gambling_blocked },
              { key: 'reloadable', label: '可重载', value: data.reloadable },
              { key: 'account_updater', label: '账户更新器', value: data.account_updater },
              { key: 'level2', label: 'Level2功能', value: data.level2 },
              { key: 'level3', label: 'Level3功能', value: data.level3 },
              { key: 'alm', label: 'ALM功能', value: data.alm },
              { key: 'shared_bin', label: '共享BIN', value: data.shared_bin }
            ].map(({ key, label, value }) => {
              const display = getBooleanDisplay(value, label)
              const Icon = display.icon
              
              return (
                <div key={key} className={`flex items-center space-x-3 p-3 rounded-lg ${display.bgColor}`}>
                  <Icon className={`h-5 w-5 ${display.color}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{label}</div>
                    <div className={`text-sm font-semibold ${display.color}`}>{display.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BINDetailCard