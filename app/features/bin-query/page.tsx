"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lock,
  ArrowRight,
  CheckCircle,
  Search,
  Zap,
  Database,
  Clock,
  Globe,
  BarChart3,
  Shield
} from "lucide-react"
import Header from "@/components/layout/header"
import { BinQueryFooter } from "../../bin-query/components/BinQueryFooter"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function BinQueryPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600/10 to-violet-600/10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">BIN信息查询</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              快速查询银行卡BIN码信息，获取详细的卡片和银行数据，支持实时查询和历史记录。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/bin-query">
                <Button className="bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600 rounded-full px-8 py-3 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  立即查询
                </Button>
              </Link>
              <Button variant="outline" className="rounded-full px-8 py-3 text-lg">
                查看演示
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能特性</h2>
            <p className="text-xl text-gray-600">专业的BIN查询解决方案</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle>实时查询</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  基于最新BIN数据库，提供实时准确的银行卡信息查询服务。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <CardTitle>丰富数据</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  提供详细的银行信息、卡片类型、国家地区等全面数据。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>快速响应</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  毫秒级查询响应，即输即查，无需等待。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>历史记录</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  自动保存查询历史，方便回顾和管理查询记录。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle>全球覆盖</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  支持全球主要银行和卡组织的BIN码查询服务。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle>数据分析</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  提供查询统计和数据分析功能，帮助了解查询模式。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">服务数据</h2>
            <p className="text-xl text-gray-600">可靠的查询服务</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-gray-600">查询准确率</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">100万+</div>
              <div className="text-sm text-gray-600">日查询量</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-emerald-600">0.02秒</div>
              <div className="text-sm text-gray-600">平均响应时间</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-600">500万+</div>
              <div className="text-sm text-gray-600">BIN数据库</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">如何使用</h2>
            <p className="text-xl text-gray-600">简单两步，快速查询</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">输入BIN码</h3>
                  <p className="text-gray-600">
                    在查询框中输入6-8位的银行卡BIN码，系统自动识别格式
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">获取详细信息</h3>
                  <p className="text-gray-600">
                    系统立即返回详细的银行信息、卡片类型、发卡国家等数据
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-200/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">BIN查询示例</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">输入BIN码</div>
                    <div className="font-mono text-lg font-bold text-gray-900">453210</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm space-y-2">
                    <div className="text-sm text-gray-500">查询结果</div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">银行名称:</span>
                        <span className="font-medium">中国工商银行</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">卡片类型:</span>
                        <span className="font-medium">VISA信用卡</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">发卡国家:</span>
                        <span className="font-medium">中国</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Coverage */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">数据覆盖</h2>
            <p className="text-xl text-gray-600">全球主要银行和卡组织</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">VISA</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">VISA</h3>
              <p className="text-sm text-gray-600">全球最大的支付网络</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">MC</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Mastercard</h3>
              <p className="text-sm text-gray-600">国际主要支付品牌</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">银联</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">UnionPay</h3>
              <p className="text-sm text-gray-600">中国银联支付网络</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">其他</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">其他卡组织</h3>
              <p className="text-sm text-gray-600">Amex、JCB、Discover等</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-violet-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">开始使用BIN信息查询</h2>
          <p className="text-xl mb-8 opacity-90">
            立即体验快速准确的BIN查询服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bin-query">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-3 text-lg">
                <Search className="w-5 h-5 mr-2" />
                立即查询
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3 text-lg bg-transparent">
              联系客服
            </Button>
          </div>
        </div>
      </section>

      <BinQueryFooter />
    </div>
  )
}