import React from 'react'
import { ValidationResult } from '@/lib/card-validation-service'
import { CheckCircle, XCircle, AlertCircle, CreditCard, Calendar, Shield } from 'lucide-react'

interface CardValidationResultsProps {
  results: ValidationResult[]
  isProcessing: boolean
  progress: { done: number; total: number } | null
}

export function CardValidationResults({ results, isProcessing, progress }: CardValidationResultsProps) {
  if (isProcessing && progress) {
    const percentage = Math.round((progress.done / progress.total) * 100)
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-800">正在验证银行卡...</div>
            <div className="text-xs text-blue-600 mt-1">
              进度: {progress.done} / {progress.total} ({percentage}%)
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  const validCount = results.filter(r => r.valid).length
  const invalidCount = results.length - validCount

  return (
    <div className="space-y-4">
      {/* 统计信息 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">验证结果</h3>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>有效: {validCount}</span>
            </div>
            <div className="flex items-center space-x-1 text-red-600">
              <XCircle className="h-4 w-4" />
              <span>无效: {invalidCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 结果列表 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((result, index) => (
          <CardResultItem key={index} result={result} />
        ))}
      </div>
    </div>
  )
}

function CardResultItem({ result }: { result: ValidationResult }) {
  const getReasonText = (reason: string) => {
    const reasonMap: Record<string, string> = {
      'length_invalid': '卡号长度无效',
      'luhn_invalid': 'Luhn校验失败',
      'expired': '已过期',
      'expiry_too_far': '有效期过远',
      'month_invalid': '月份无效',
      'cvv_missing': '缺少CVV',
      'cvv_not_numeric': 'CVV非数字',
      'cvv_length_amex': 'Amex卡CVV长度错误',
      'cvv_length_visa': 'Visa卡CVV长度错误',
      'cvv_length_mastercard': 'MasterCard卡CVV长度错误',
      'insufficient_parts': '输入格式错误',
      'parse_error': '解析错误'
    }
    return reasonMap[reason] || reason
  }

  return (
    <div className={`border rounded-lg p-3 ${
      result.valid 
        ? 'border-green-200 bg-green-50' 
        : 'border-red-200 bg-red-50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {result.valid ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className="font-mono text-sm font-medium">{result.masked}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
              {result.cardType}
            </span>
            {result.bin && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                BIN: {result.bin}
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-600 mb-2">
            原始: {result.originalLine}
          </div>
          
          {result.expiry && (
            <div className="flex items-center space-x-1 text-xs text-gray-600 mb-2">
              <Calendar className="h-3 w-3" />
              <span>有效期: {result.expiry.month.toString().padStart(2, '0')}/{result.expiry.year}</span>
            </div>
          )}
          
          {result.reasons.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                <span>错误原因:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {result.reasons.map((reason, index) => (
                  <span 
                    key={index}
                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded"
                  >
                    {getReasonText(reason)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
