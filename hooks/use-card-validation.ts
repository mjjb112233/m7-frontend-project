import { useState, useCallback, useRef } from 'react'
import { CardValidationService, ValidationResult, ValidationOptions, ValidationProgress } from '@/lib/card-validation-service'

export interface UseCardValidationReturn {
  results: ValidationResult[]
  isProcessing: boolean
  progress: ValidationProgress | null
  error: string | null
  validateCards: (lines: string[], options?: ValidationOptions) => Promise<ValidationResult[]>
  clearResults: () => void
  cancelValidation: () => void
}

export function useCardValidation(): UseCardValidationReturn {
  const [results, setResults] = useState<ValidationResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<ValidationProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const serviceRef = useRef<CardValidationService | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const validateCards = useCallback(async (lines: string[], options: ValidationOptions = {}): Promise<ValidationResult[]> => {
    if (isProcessing) {
      console.warn('Validation already in progress')
      return []
    }

    setIsProcessing(true)
    setError(null)
    setProgress(null)
    setResults([])

    try {
      // 创建新的服务实例
      const service = new CardValidationService()
      serviceRef.current = service

      // 创建AbortController用于取消操作
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      const results = await service.validateBatch(
        lines,
        options,
        (progress) => {
          if (!abortController.signal.aborted) {
            setProgress(progress)
          }
        }
      )

      if (!abortController.signal.aborted) {
        setResults(results)
        setProgress({ done: results.length, total: results.length })
        return results // 返回验证结果
      }
      return []
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        const errorMessage = err instanceof Error ? err.message : 'Validation failed'
        setError(errorMessage)
        console.error('Card validation error:', err)
      }
      throw err // 重新抛出错误
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsProcessing(false)
      }
      
      // 清理服务
      if (serviceRef.current) {
        serviceRef.current.destroy()
        serviceRef.current = null
      }
      abortControllerRef.current = null
    }
  }, [isProcessing])

  const clearResults = useCallback(() => {
    setResults([])
    setProgress(null)
    setError(null)
  }, [])

  const cancelValidation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    if (serviceRef.current) {
      serviceRef.current.destroy()
      serviceRef.current = null
    }
    
    setIsProcessing(false)
    setProgress(null)
  }, [])

  return {
    results,
    isProcessing,
    progress,
    error,
    validateCards,
    clearResults,
    cancelValidation
  }
}
