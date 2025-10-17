import React from "react"
import { Shield, CreditCard, CheckCircle, Zap, TrendingUp } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { CVVStep } from "../types"

interface StepIndicatorProps {
  currentStep: CVVStep
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useLanguage()

  const steps = [
    { key: "config", step: 1, label: t("cvv.stepConfig"), icon: Shield, color: "blue" },
    { key: "input", step: 2, label: t("cvv.stepInput"), icon: CreditCard, color: "emerald" },
    { key: "precheck", step: 3, label: t("cvv.stepPrecheck"), icon: CheckCircle, color: "purple" },
    { key: "detecting", step: 4, label: t("cvv.stepDetecting"), icon: Zap, color: "orange" },
    { key: "results", step: 5, label: t("cvv.stepResults"), icon: TrendingUp, color: "indigo" },
  ]

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-3">
        {steps.map((item, index) => {
          const Icon = item.icon
          const isActive = currentStep === item.key
          const isCompleted =
            ["config", "input", "precheck", "detecting"].indexOf(currentStep) >
            ["config", "input", "precheck", "detecting"].indexOf(item.key)

          return (
            <div key={item.key} className="flex items-center">
              <div
                className={`flex items-center transition-all duration-300 ${
                  isActive ? "text-gray-900" : isCompleted ? "text-green-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 hover:scale-105 shadow-lg ${
                    isActive
                      ? `bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white`
                      : isCompleted
                        ? "bg-gradient-to-br from-emerald-500 to-green-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                </div>
                <span className="ml-2 text-xs font-medium hidden md:block">{item.label}</span>
              </div>
              {index < 4 && <div className="w-8 h-px bg-gray-200 mx-2 hidden md:block"></div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
