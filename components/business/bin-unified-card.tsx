/**
 * BIN统一信息卡片组件
 * 将基本信息和详细信息整合在一个卡片中显示
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
  Info,
  Phone,
  ExternalLink
} from "lucide-react"
import type { BINQueryResult } from "@/lib/api/bin-query"

interface BINUnifiedCardProps {
  basicData: BINQueryResult
  detailedData: BINQueryResult
  className?: string
}

export function BINUnifiedCard({ basicData, detailedData, className = "" }: BINUnifiedCardProps) {
  // 获取状态图标和颜色
  const getBooleanDisplay = (value: boolean) => ({
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
    <div className={`max-w-6xl mx-auto ${className}`}>
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16"></div>
        
        {/* 卡片标题 */}
        <CardHeader className="relative bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            BIN查询结果
          </CardTitle>
        </CardHeader>

        <CardContent className="relative p-8 space-y-8">
          {/* 基本信息区域 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">基本信息</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">BIN</span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">BIN长度</div>
                  <div className="font-medium text-gray-900">{basicData.bin_length} 位</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600">卡片品牌</div>
                  <div className="font-medium text-gray-900">{basicData.card_brand}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">卡片类型</div>
                  <Badge className={`text-xs ${cardTypeColor[basicData.type as keyof typeof cardTypeColor] || 'bg-gray-100 text-gray-800'}`}>
                    {basicData.type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Banknote className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600">资金来源</div>
                  <div className="font-medium text-gray-900">{basicData.funding_source}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">#</span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">卡号长度</div>
                  <div className="font-medium text-gray-900">{basicData.number_length} 位</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">卡段类型</div>
                  <div className="font-medium text-gray-900">{basicData.card_segment_type}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">★</span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">卡片等级</div>
                  <div className="font-medium text-gray-900">{basicData.card_segment_type}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">PAN/Token</div>
                  <div className="font-medium text-gray-900">{basicData.pan_or_token}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 银行信息区域 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Building className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">银行信息</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600">银行名称</div>
                  <div className="font-medium text-gray-900">{basicData.bank_name}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600">银行清洁名称</div>
                  <div className="font-medium text-gray-900">{basicData.bank_clean_name}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600">发卡国家</div>
                  <div className="font-medium text-gray-900">
                    {basicData.country_name} ({basicData.country_alpha2})
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">¤</span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">发行货币</div>
                  <div className="font-medium text-gray-900">{basicData.issuer_currency}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 产品信息区域 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                <Info className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">产品信息</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div>
                  <div className="text-xs text-gray-600">产品名称</div>
                  <div className="font-medium text-gray-900">{basicData.product_name}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-600">认证名称</div>
                  <div className="font-medium text-gray-900">{basicData.authentication_name}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 功能特性区域 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">功能特性</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {[
                { key: 'prepaid', label: '预付费卡', value: detailedData.prepaid },
                { key: 'auth_required', label: '需要认证', value: detailedData.auth_required },
                { key: 'domestic_only', label: '仅限国内', value: detailedData.domestic_only },
                { key: 'gambling_blocked', label: '阻止赌博', value: detailedData.gambling_blocked },
                { key: 'reloadable', label: '可重载', value: detailedData.reloadable },
                { key: 'account_updater', label: '账户更新器', value: detailedData.account_updater },
                { key: 'level2', label: 'Level2功能', value: detailedData.level2 },
                { key: 'level3', label: 'Level3功能', value: detailedData.level3 },
                { key: 'alm', label: 'ALM功能', value: detailedData.alm },
                { key: 'shared_bin', label: '共享BIN', value: detailedData.shared_bin }
              ].map(({ key, label, value }) => {
                const display = getBooleanDisplay(value)
                const Icon = display.icon
                
                return (
                  <div key={key} className={`flex items-center space-x-2 p-2 rounded-lg ${display.bgColor} border border-gray-100`}>
                    <Icon className={`h-4 w-4 ${display.color}`} />
                    <div>
                      <div className="text-xs font-medium text-gray-900">{label}</div>
                      <div className={`text-xs font-semibold ${display.color}`}>{display.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 联系信息区域 - 暂时隐藏，新的API响应中没有这些字段 */}
          {false && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">联系信息</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {basicData.website && (
                  <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                    <ExternalLink className="h-5 w-5 text-gray-500" />
                    <a 
                      href={basicData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      {basicData.website}
                    </a>
                  </div>
                )}
                {basicData.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg border border-gray-100 shadow-sm">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="font-mono font-medium text-gray-900">{basicData.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BINUnifiedCard