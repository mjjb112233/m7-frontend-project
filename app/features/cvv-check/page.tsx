"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  ArrowRight,
  CheckCircle,
  Lock,
  Zap,
  BarChart3,
  Clock,
  Globe,
  AlertTriangle,
  Settings
} from "lucide-react"
import Header from "@/components/layout/header"
import { CVVCheckFooter } from "@/components/layout/cvv-check-footer"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function CVVCheckPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600/10 to-green-600/10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">CVV批量检测</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              专业的CVV批量检测工具，支持多种检测模式和通道选择，提供高效、准确的信用卡验证服务。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cvv-check">
                <Button className="bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 rounded-full px-8 py-3 text-lg">
                  <Shield className="w-5 h-5 mr-2" />
                  立即检测
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
            <p className="text-xl text-gray-600">专业的CVV检测解决方案</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <CardTitle>多通道检测</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  支持多种检测通道，提供更高的成功率和稳定性。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>批量处理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  支持大批量CVV同时检测，自动分类有效和无效结果。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle>实时监控</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  实时显示检测进度和结果统计，随时掌握检测状态。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <CardTitle>智能停止</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  支持自动停止功能，达到指定有效数量时自动停止检测。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>高速检测</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  毫秒级响应速度，快速完成大批量CVV检测任务。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>安全保障</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  采用银行级安全标准，确保检测过程安全可靠。
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
            <p className="text-xl text-gray-600">专业可靠的检测服务</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-emerald-600">95%+</div>
              <div className="text-sm text-gray-600">检测准确率</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">500万+</div>
              <div className="text-sm text-gray-600">日检测量</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">0.1秒</div>
              <div className="text-sm text-gray-600">平均响应时间</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">全天候服务</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">检测流程</h2>
            <p className="text-xl text-gray-600">简单四步，高效检测</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">配置检测</h3>
              <p className="text-gray-600">
                选择检测模式和通道，配置自动停止条件
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">输入数据</h3>
              <p className="text-gray-600">
                批量输入待检测的银行卡信息
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">开始检测</h3>
              <p className="text-gray-600">
                系统自动进行CVV检测，实时显示进度
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">查看结果</h3>
              <p className="text-gray-600">
                获得详细的检测结果和统计数据
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">安全保障</h2>
            <p className="text-xl text-gray-600">银行级安全标准</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">数据加密</h3>
              <p className="text-gray-600">
                所有数据传输采用SSL加密，确保信息安全
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">隐私保护</h3>
              <p className="text-gray-600">
                严格遵守隐私政策，不存储用户敏感信息
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">合规认证</h3>
              <p className="text-gray-600">
                通过多项安全认证，符合行业标准
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">开始使用CVV批量检测</h2>
          <p className="text-xl mb-8 opacity-90">
            立即体验专业的CVV检测服务
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cvv-check">
              <Button className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full px-8 py-3 text-lg">
                <Shield className="w-5 h-5 mr-2" />
                立即开始
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3 text-lg bg-transparent">
              联系客服
            </Button>
          </div>
        </div>
      </section>

      <CVVCheckFooter />
    </div>
  )
}