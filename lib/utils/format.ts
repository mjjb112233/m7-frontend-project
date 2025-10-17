/**
 * 格式化工具函数
 */

// 格式化货币
export function formatCurrency(amount: number, currency: string = 'USDT'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// 格式化M币
export function formatMCoins(amount: number): string {
  return `${amount.toFixed(1)} M币`
}

// 格式化时间戳为本地时区时间
export function formatTimestamp(timestamp: string | number, format: 'full' | 'date' | 'time' | 'datetime' = 'full'): string {
  try {
    let date: Date
    
    // 处理时间戳
    if (typeof timestamp === 'string') {
      // 检查是否是10位时间戳（秒）
      if (/^\d{10}$/.test(timestamp)) {
        date = new Date(parseInt(timestamp) * 1000)
      } else {
        date = new Date(timestamp)
      }
    } else {
      // 如果是数字，判断是秒还是毫秒
      if (timestamp < 10000000000) {
        // 10位时间戳（秒）
        date = new Date(timestamp * 1000)
      } else {
        // 13位时间戳（毫秒）
        date = new Date(timestamp)
      }
    }
    
    // 验证日期是否有效
    if (isNaN(date.getTime())) {
      return '无效时间'
    }
    
    switch (format) {
      case 'full':
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-')
      case 'date':
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '-')
      case 'time':
        return date.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      case 'datetime':
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).replace(/\//g, '-')
      default:
        return date.toLocaleString('zh-CN')
    }
  } catch (error) {
    console.error('时间格式化错误:', error)
    return '时间格式错误'
  }
}

// 格式化日期（保持向后兼容）
export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('zh-CN')
    case 'long':
      return dateObj.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    case 'time':
      return dateObj.toLocaleTimeString('zh-CN')
    default:
      return dateObj.toLocaleDateString('zh-CN')
  }
}

// 格式化相对时间
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}天前`
  } else {
    return formatDate(dateObj, 'short')
  }
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化数字
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

// 格式化百分比
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

// 格式化卡号（隐藏中间部分）
export function formatCardNumber(cardNumber: string): string {
  if (cardNumber.length < 8) return cardNumber
  
  const start = cardNumber.slice(0, 4)
  const end = cardNumber.slice(-4)
  const middle = '*'.repeat(cardNumber.length - 8)
  
  return `${start}${middle}${end}`
}

// 格式化手机号
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  
  return phone
}

// 格式化地址
export function formatAddress(address: {
  country?: string
  province?: string
  city?: string
  street?: string
}): string {
  const parts = [address.country, address.province, address.city, address.street]
    .filter(Boolean)
  
  return parts.join(' ')
}
