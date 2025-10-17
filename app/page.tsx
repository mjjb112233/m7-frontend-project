"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  Shield,
  Zap,
  CheckCircle,
  Globe,
  ArrowRight,
  Star,
  Lock,
} from "lucide-react"
import Header from "@/components/layout/header"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()


  useEffect(() => {
    setIsVisible(true)
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          {/* New Badge */}
          <div
            className={`inline-flex items-center bg-black text-white text-sm px-4 py-2 rounded-full mb-8 transition-all duration-700 ${isVisible ? "animate-slide-up" : "opacity-0"}`}
          >
            <Badge className="bg-white text-black text-xs px-2 py-1 rounded-full mr-3">New</Badge>
            {t("home.newBadge")}
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>

          <h1
            className={`text-6xl md:text-7xl font-bold text-gray-900 mb-6 text-balance transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-up" : "opacity-0"}`}
          >
            {t("home.title")}
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("home.titleHighlight")}
            </span>
          </h1>

          <p
            className={`text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-pretty transition-all duration-1000 delay-400 ${isVisible ? "animate-slide-up" : "opacity-0"}`}
          >
            {t("home.subtitle")}
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center mb-16 transition-all duration-1000 delay-600 ${isVisible ? "animate-slide-up" : "opacity-0"}`}
          >
            <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-4 text-lg animate-pulse-glow">
              <Shield className="w-5 h-5 mr-2" />
              {t("home.startDetection")}
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-4 text-lg bg-white/80 backdrop-blur-sm">
              <CreditCard className="w-5 h-5 mr-2" />
              {t("home.learnMore")}
            </Button>
          </div>


          {/* Floating Card Animation */}
          <div className="relative max-w-md mx-auto">
            <div className="animate-float">
              <Card className="card-gradient shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                    <Badge className="bg-green-100 text-green-800">{t("home.cardValid")}</Badge>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-mono font-bold mb-2">4532 **** **** 1234</div>
                    <div className="text-sm text-gray-600 mb-1">
                      VISA • {t("language.chinese") === "中文" ? "美国" : "USA"}
                    </div>
                    <div className="text-sm text-gray-500">{t("home.detectionTime")}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">{t("home.stats.accuracy")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">50万+</div>
              <div className="text-sm text-gray-600">{t("home.stats.dailyChecks")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">0.1秒</div>
              <div className="text-sm text-gray-600">{t("home.stats.responseTime")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">{t("home.stats.service")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.coreFeatures")}</h2>
            <p className="text-xl text-gray-600">{t("home.featuresSubtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-60"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="relative p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("home.binClassify")}</h3>
                <p className="text-gray-600 mb-4">{t("home.binClassifyDesc")}</p>
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                  <span>{t("home.learnMoreLink")}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-60"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="relative p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("home.cvvCheck")}</h3>
                <p className="text-gray-600 mb-4">{t("home.cvvCheckDesc")}</p>
                <div className="flex items-center text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
                  <span>{t("home.learnMoreLink")}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-60"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="relative p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("home.binQuery")}</h3>
                <p className="text-gray-600 mb-4">{t("home.binQueryDesc")}</p>
                <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                  <span>{t("home.learnMoreLink")}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">{t("home.whyChoose")}</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("home.fastDetection")}</h3>
              <p className="text-gray-600">{t("home.fastDetectionDesc")}</p>
            </div>

            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("home.highAccuracy")}</h3>
              <p className="text-gray-600">{t("home.highAccuracyDesc")}</p>
            </div>

            <div className="space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("home.globalCoverage")}</h3>
              <p className="text-gray-600">{t("home.globalCoverageDesc")}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-4">"{t("home.testimonial")}"</p>
            <p className="text-sm text-gray-500">{t("home.testimonialAuthor")}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t("home.ctaTitle")}</h2>
          <p className="text-xl text-gray-300 mb-8">{t("home.ctaSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-4 text-lg">
              <CreditCard className="w-5 h-5 mr-2" />
              {t("home.freeTrial")}
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black rounded-full px-8 py-4 text-lg bg-transparent"
            >
              {t("home.contactSupport")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
