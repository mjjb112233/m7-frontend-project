/**
 * 验证工具函数
 */

// 邮箱验证
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 密码强度验证
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('密码长度至少8位')
  }
  
  if (password.length > 20) {
    errors.push('密码长度不能超过20位')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母')
  }
  
  if (!/\d/.test(password)) {
    errors.push('密码必须包含至少一个数字')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码必须包含至少一个特殊字符')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// 用户名验证
export function validateUsername(username: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (username.length < 3) {
    errors.push('用户名长度至少3位')
  }
  
  if (username.length > 20) {
    errors.push('用户名长度不能超过20位')
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('用户名只能包含字母、数字和下划线')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// 卡号验证
export function validateCardNumber(cardNumber: string): boolean {
  // 移除空格和连字符
  const cleaned = cardNumber.replace(/[\s-]/g, '')
  
  // 检查是否为数字
  if (!/^\d+$/.test(cleaned)) {
    return false
  }
  
  // 检查长度（13-19位）
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false
  }
  
  // Luhn算法验证
  return luhnCheck(cleaned)
}

// Luhn算法
function luhnCheck(cardNumber: string): boolean {
  let sum = 0
  let isEven = false
  
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i])
    
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

// CVV验证
export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

// 有效期验证
export function validateExpiryDate(expiry: string): boolean {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
  if (!regex.test(expiry)) {
    return false
  }
  
  const [month, year] = expiry.split('/')
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1
  
  const expMonth = parseInt(month)
  const expYear = parseInt(year)
  
  if (expYear < currentYear) {
    return false
  }
  
  if (expYear === currentYear && expMonth < currentMonth) {
    return false
  }
  
  return true
}
