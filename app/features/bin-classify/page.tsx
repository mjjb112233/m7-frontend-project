"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
  Zap,
  BarChart3,
  Database,
  Clock,
  Star
} from "lucide-react"
import Header from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function BinClassifyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 to-cyan-600/10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">BIN智能分类</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              精确识别银行卡BIN码，提供详细的发卡行、卡片类型、国家等信息分类，支持批量处理和实时查询。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/bin-classify">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-full px-8 py-3 text-lg">
                  <CreditCard className="w-5 h-5 mr-2" />
                  立即使用
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
            <p className="text-xl text-gray-600">全面的BIN分类解决方案</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <CardTitle>精准BIN识别</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  基于全球最新BIN数据库，准确识别银行卡类型、发卡行、国家等详细信息。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>批量处理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  支持大批量银行卡号同时分类，提高工作效率，节省处理时间。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle>详细分析</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  提供详细的分类统计和分析报告，帮助您更好地了解数据分布。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>实时处理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  毫秒级响应速度，实时返回分类结果，无需等待。
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
                  支持全球主要银行和卡组织，覆盖200+国家和地区。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>安全可靠</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  采用银行级安全标准，确保数据处理过程安全可靠。
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
            <p className="text-xl text-gray-600">值得信赖的专业服务</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm text-gray-600">识别准确率</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">1000万+</div>
              <div className="text-sm text-gray-600">日处理量</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">0.05秒</div>
              <div className="text-sm text-gray-600">平均响应时间</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-600">200+</div>
              <div className="text-sm text-gray-600">支持国家</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">如何使用</h2>
            <p className="text-xl text-gray-600">简单三步，快速分类</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">输入银行卡号</h3>
              <p className="text-gray-600">
                支持单个或批量输入银行卡号，系统自动识别格式
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">智能分析处理</h3>
              <p className="text-gray-600">
                系统基于BIN数据库进行智能分析，识别卡片详细信息
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">获取分类结果</h3>
              <p className="text-gray-600">
                获得详细的分类结果和统计报告，支持导出功能
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">开始使用BIN智能分类</h2>
          <p className="text-xl mb-8 opacity-90">
            立即体验专业的银行卡BIN分类服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bin-classify">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-3 text-lg">
                <CreditCard className="w-5 h-5 mr-2" />
                立即开始
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3 text-lg bg-transparent">
              联系客服
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}