"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Lock,
  Zap,
  CheckCircle,
  Globe,
  ArrowRight,
  Database,
  Building,
  Search,
  TrendingUp,
  Home,
  Shield,
} from "lucide-react"
import Header from "@/components/layout/header"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function BINQueryFeaturePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-violet-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              {t("binQueryFeature.hero.title")}
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {t("binQueryFeature.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("binQueryFeature.features.title")}</h2>
            <p className="text-xl text-gray-600">{t("binQueryFeature.features.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-60"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="relative p-8 pb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("binQueryFeature.features.fast.title")}</h3>
                <p className="text-gray-600">{t("binQueryFeature.features.fast.desc")}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-60"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="relative p-8 pb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("binQueryFeature.features.details.title")}</h3>
                <p className="text-gray-600">{t("binQueryFeature.features.details.desc")}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-60"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="relative p-8 pb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("binQueryFeature.features.bank.title")}</h3>
                <p className="text-gray-600">{t("binQueryFeature.features.bank.desc")}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-60"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full -translate-y-16 translate-x-16"></div>
              <CardContent className="relative p-8 pb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("binQueryFeature.features.accuracy.title")}</h3>
                <p className="text-gray-600">{t("binQueryFeature.features.accuracy.desc")}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("binQueryFeature.useCases.title")}</h2>
            <p className="text-xl text-gray-600">{t("binQueryFeature.useCases.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-60"></div>
              <CardContent className="relative p-8 pb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("binQueryFeature.useCases.verification.title")}</h3>
                <p className="text-gray-600">{t("binQueryFeature.useCases.verification.desc")}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-60"></div>
              <CardContent className="relative p-8 pb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("binQueryFeature.useCases.analysis.title")}</h3>
                <p className="text-gray-600">{t("binQueryFeature.useCases.analysis.desc")}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-60"></div>
              <CardContent className="relative p-8 pb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t("binQueryFeature.useCases.integration.title")}</h3>
                <p className="text-gray-600">{t("binQueryFeature.useCases.integration.desc")}</p>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-violet-500"></div>
            </Card>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("binQueryFeature.advantages.title")}</h2>
            <p className="text-xl text-gray-600">{t("binQueryFeature.advantages.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("binQueryFeature.advantages.speed.title")}</h3>
              <p className="text-gray-600">{t("binQueryFeature.advantages.speed.desc")}</p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("binQueryFeature.advantages.accuracy.title")}</h3>
              <p className="text-gray-600">{t("binQueryFeature.advantages.accuracy.desc")}</p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{t("binQueryFeature.advantages.coverage.title")}</h3>
              <p className="text-gray-600">{t("binQueryFeature.advantages.coverage.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("binQueryFeature.cta.title")}</h2>
          <p className="text-xl text-gray-600 mb-8">{t("binQueryFeature.cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/bin-query">
              <Button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 rounded-full px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Search className="w-5 h-5 mr-2" />
                {t("binQueryFeature.cta.startButton")}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="rounded-full px-8 py-4 text-lg bg-white/80 backdrop-blur-sm hover:bg-white">
                <Home className="w-5 h-5 mr-2" />
                {t("binQueryFeature.cta.backButton")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

