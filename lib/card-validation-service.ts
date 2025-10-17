// 银行卡批量验证服务
// 主线程接口，管理Web Worker通信

export interface ValidationResult {
  index: number
  originalLine: string
  masked: string
  valid: boolean
  reasons: string[]
  bin: string
  cardType: string
  expiry: { month: number; year: number } | null
}

export interface ValidationOptions {
  maxYears?: number
  chunkSize?: number
  timeout?: number
}

export interface ValidationProgress {
  done: number
  total: number
}

export class CardValidationService {
  private worker: Worker | null = null
  private currentTaskId: string | null = null
  private timeoutId: NodeJS.Timeout | null = null

  constructor() {
    this.initializeWorker()
  }

  private initializeWorker() {
    if (typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker('/card-validation-worker.js')
        this.worker.onerror = (error) => {
          console.error('Worker error:', error)
        }
      } catch (error) {
        console.warn('Web Worker not supported, falling back to main thread')
        this.worker = null
      }
    }
  }

  // 生成唯一任务ID
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 主线程验证实现（备用方案）
  private validateInMainThread(lines: string[], options: ValidationOptions = {}): ValidationResult[] {
    const results: ValidationResult[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      try {
        const parts = line.split('|')
        if (parts.length < 4) {
          results.push({
            index: i,
            originalLine: line,
            masked: 'INVALID',
            valid: false,
            reasons: ['insufficient_parts'],
            bin: '',
            cardType: 'Unknown',
            expiry: null
          })
          continue
        }
        
        const [number, month, year, cvv, ...other] = parts
        const normalizedNumber = number.replace(/[\s-]/g, '')
        const otherText = other.join('|')
        
        const reasons: string[] = []
        
        // 长度检查
        if (normalizedNumber.length < 13 || normalizedNumber.length > 19) {
          reasons.push('length_invalid')
        }
        
        // 简单的Luhn检查
        const luhnValid = this.luhnCheck(normalizedNumber)
        if (!luhnValid) {
          reasons.push('luhn_invalid')
        }
        
        // 有效期检查
        const monthNum = parseInt(month, 10)
        const yearNum = parseInt(year, 10)
        const fullYear = yearNum < 100 ? 2000 + yearNum : yearNum
        
        if (monthNum < 1 || monthNum > 12) {
          reasons.push('month_invalid')
        } else {
          const now = new Date()
          const currentYear = now.getFullYear()
          const currentMonth = now.getMonth() + 1
          
          if (fullYear < currentYear || (fullYear === currentYear && monthNum < currentMonth)) {
            reasons.push('expired')
          }
          
          const maxYears = options.maxYears || 15
          if (fullYear > currentYear + maxYears) {
            reasons.push('expiry_too_far')
          }
        }
        
        // CVV检查
        if (!cvv) {
          reasons.push('cvv_missing')
        } else if (!/^\d+$/.test(cvv)) {
          reasons.push('cvv_not_numeric')
        }
        
        const masked = normalizedNumber.length > 4 
          ? normalizedNumber.substring(0, 4) + '*'.repeat(Math.max(0, normalizedNumber.length - 8)) + normalizedNumber.substring(normalizedNumber.length - 4)
          : normalizedNumber
        
        results.push({
          index: i,
          originalLine: line,
          masked,
          valid: reasons.length === 0,
          reasons,
          bin: normalizedNumber.substring(0, Math.min(6, normalizedNumber.length)),
          cardType: this.detectCardType(normalizedNumber),
          expiry: reasons.includes('month_invalid') || reasons.includes('expired') || reasons.includes('expiry_too_far') 
            ? null 
            : { month: monthNum, year: fullYear }
        })
      } catch (error) {
        results.push({
          index: i,
          originalLine: line,
          masked: 'ERROR',
          valid: false,
          reasons: ['parse_error'],
          bin: '',
          cardType: 'Unknown',
          expiry: null
        })
      }
    }
    
    return results
  }

  // Luhn算法实现
  private luhnCheck(number: string): boolean {
    const digits = number.replace(/\D/g, '').split('').map(Number)
    let sum = 0
    let isEven = false

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i]
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }

  // 检测卡类型
  private detectCardType(number: string): string {
    if (/^4/.test(number)) return 'Visa'
    if (/^5[1-5]/.test(number)) return 'MasterCard'
    if (/^3[47]/.test(number)) return 'Amex'
    if (/^6(?:011|5)/.test(number)) return 'Discover'
    if (/^(?:2131|1800|35)/.test(number)) return 'JCB'
    if (/^62/.test(number)) return 'UnionPay'
    if (/^3[0689]/.test(number)) return 'Diners'
    return 'Unknown'
  }

  // 验证银行卡批次
  async validateBatch(
    lines: string[], 
    options: ValidationOptions = {},
    onProgress?: (progress: ValidationProgress) => void
  ): Promise<ValidationResult[]> {
    const taskId = this.generateTaskId()
    this.currentTaskId = taskId
    
    const {
      maxYears = 15,
      chunkSize = 10000,
      timeout = 20000
    } = options

    // 设置超时保护
    this.timeoutId = setTimeout(() => {
      this.cleanup()
      throw new Error('Validation timeout')
    }, timeout)

    try {
      // 如果Worker不可用，使用主线程实现
      if (!this.worker) {
        console.log('Using main thread validation')
        return this.validateInMainThread(lines, options)
      }

      return new Promise((resolve, reject) => {
        const handleMessage = (e: MessageEvent) => {
          const { id, type, payload, error } = e.data
          
          if (id !== taskId) return

          switch (type) {
            case 'progress':
              if (onProgress && payload) {
                onProgress(payload)
              }
              break
              
            case 'result':
              this.cleanup()
              resolve(payload.results)
              break
              
            case 'error':
              this.cleanup()
              reject(new Error(error || 'Worker error'))
              break
          }
        }

        this.worker!.addEventListener('message', handleMessage)
        
        // 发送验证任务
        this.worker!.postMessage({
          id: taskId,
          type: 'validateBatch',
          payload: { lines, maxYears, chunkSize }
        })
      })
    } catch (error) {
      this.cleanup()
      console.warn('Worker failed, falling back to main thread:', error)
      return this.validateInMainThread(lines, options)
    }
  }

  // 清理资源
  private cleanup() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.currentTaskId = null
  }

  // 销毁服务
  destroy() {
    this.cleanup()
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}

// 单例实例
let validationService: CardValidationService | null = null

export function getValidationService(): CardValidationService {
  if (!validationService) {
    validationService = new CardValidationService()
  }
  return validationService
}
