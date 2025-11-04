import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DetectionMode, Channel } from "../../types"
import { useCardValidation } from "@/hooks/use-card-validation"

interface InputStepProps {
  inputText: string
  setInputText: (text: string) => void
  selectedMode: DetectionMode
  selectedChannel: Channel | null
  onPrevious: () => void
  onNext: (precheckResults: { valid: string[]; invalid: string[] }) => void
}

export function InputStep({
  inputText,
  setInputText,
  selectedMode,
  selectedChannel,
  onPrevious,
  onNext
}: InputStepProps) {
  const { t } = useLanguage()
  const cardValidation = useCardValidation()
  const [isPrechecking, setIsPrechecking] = useState(false)

  // 预检测CVV函数
  const handlePrecheck = async () => {
    if (!inputText.trim()) return

    setIsPrechecking(true)
    cardValidation.clearResults()

    const lines = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (lines.length === 0) {
      setIsPrechecking(false)
      return
    }

    try {
      // 调用Web Worker进行卡验证
      const validationResults = await cardValidation.validateCards(lines, {
        maxYears: 15,
        chunkSize: 1000,
        timeout: 30000
      })
      
      const validCards: string[] = []
      const invalidCards: string[] = []
      
      validationResults.forEach((result) => {
        if (result.valid) {
          // 保存原始数据，而不是掩码后的显示信息
          validCards.push(result.originalLine)
        } else {
          // 对于无效的卡，也保存原始数据
          invalidCards.push(result.originalLine)
        }
      })

      // 调用父组件的onNext，传递预检测结果
      onNext({ valid: validCards, invalid: invalidCards })
    } catch (error) {
      console.error('Card validation error:', error)
      // 回退到简单验证
      const lines = inputText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)

      const validCards: string[] = []
      const invalidCards: string[] = []

      lines.forEach((line) => {
        const parts = line.split('|')
        if (parts.length >= 4) {
          const [number, month, year, cvv] = parts
          const normalizedNumber = number.replace(/[\s-]/g, '')
          
          const masked = normalizedNumber.length > 4 
            ? normalizedNumber.substring(0, 4) + '*'.repeat(Math.max(0, normalizedNumber.length - 8)) + normalizedNumber.substring(normalizedNumber.length - 4)
            : normalizedNumber
          
          let cardType = 'Unknown'
          if (/^4/.test(normalizedNumber)) cardType = 'Visa'
          else if (/^5[1-5]/.test(normalizedNumber)) cardType = 'MasterCard'
          else if (/^3[47]/.test(normalizedNumber)) cardType = 'Amex'
          
          const bin = normalizedNumber.substring(0, Math.min(6, normalizedNumber.length))
          const cardInfo = `${masked}  ${cardType}  BIN: ${bin}`
          
          if (/^\d{3,4}$/.test(cvv)) {
            validCards.push(cardInfo)
          } else {
            invalidCards.push(cardInfo + ` (${t("cvv.invalidLabel")})`)
          }
        } else {
          invalidCards.push(`${t("cvv.formatError")}: ${line}`)
        }
      })

      onNext({ valid: validCards, invalid: invalidCards })
    } finally {
      setIsPrechecking(false)
    }
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl max-w-3xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="relative bg-gradient-to-r from-green-600/10 to-blue-600/10 pb-3">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
            <CreditCard className="h-3 w-3 text-white" />
          </div>
          {t("cvv.inputTitle")}
        </CardTitle>
        <CardDescription className="text-xs text-gray-600">
          {t("cvv.currentConfig")}: {selectedMode} {t("cvv.mode")} - {selectedChannel?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4 p-6">
        <div className="space-y-2">
          <label htmlFor="cvv-input" className="text-xs font-medium text-gray-900">
            {t("cvv.cvvList")}
          </label>
          <Textarea
            id="cvv-input"
            placeholder={t("cvv.inputPlaceholder")}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-48 font-mono resize-none border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white text-sm overflow-hidden"
          />
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            size="sm"
            className="transition-all duration-300 hover:scale-105 bg-white hover:shadow-md overflow-hidden"
          >
            {t("cvv.previousStep")}
          </Button>
          <Button
            onClick={handlePrecheck}
            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-all duration-300 hover:scale-105 shadow-lg"
            disabled={!inputText.trim() || isPrechecking || cardValidation.isProcessing}
            size="sm"
          >
            {(isPrechecking || cardValidation.isProcessing) ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {cardValidation.isProcessing ? `${t("cvv.cardValidating")}...` : `${t("cvv.prechecking")}...`}
              </div>
            ) : (
              t("cvv.startPrecheck")
            )}
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
      </CardContent>
    </Card>
  )
}
