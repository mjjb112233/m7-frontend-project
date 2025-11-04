import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, CheckCircle, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface DetectingPromptProps {
  onViewProgress: () => void
  isLoadingProgress: boolean
}

export function DetectingPrompt({ onViewProgress, isLoadingProgress }: DetectingPromptProps) {
  const { t } = useLanguage()
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="relative bg-gradient-to-r from-orange-600/10 to-red-600/10 pb-3">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            {t("cvv.detectionInProgress")}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {t("cvv.detectionInProgressDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={onViewProgress}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105 shadow-lg"
              size="lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              {t("cvv.viewProgress")}
            </Button>
            {isLoadingProgress && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("cvv.loadingProgress")}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
        </CardContent>
      </Card>
    </div>
  )
}

interface CompletedPromptProps {
  onViewResults: () => void
  isLoadingResult: boolean
}

export function CompletedPrompt({ onViewResults, isLoadingResult }: CompletedPromptProps) {
  const { t } = useLanguage()
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Card className="relative overflow-hidden border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="relative bg-gradient-to-r from-green-600/10 to-blue-600/10 pb-3">
          <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            {t("cvv.detectionCompleted")}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {t("cvv.detectionCompletedDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative p-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={onViewResults}
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-all duration-300 hover:scale-105 shadow-lg"
              size="lg"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {t("cvv.viewResults")}
            </Button>
            {isLoadingResult && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("cvv.loadingResults")}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
        </CardContent>
      </Card>
    </div>
  )
}
