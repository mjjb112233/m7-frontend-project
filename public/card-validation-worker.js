// 银行卡批量验证 Web Worker
// 支持大批量处理，分块处理，进度报告

// 卡类型检测
const CARD_TYPES = {
  VISA: { pattern: /^4/, name: 'Visa', cvvLength: 3 },
  MASTERCARD: { pattern: /^5[1-5]/, name: 'MasterCard', cvvLength: 3 },
  AMEX: { pattern: /^3[47]/, name: 'Amex', cvvLength: 4 },
  DISCOVER: { pattern: /^6(?:011|5)/, name: 'Discover', cvvLength: 3 },
  JCB: { pattern: /^(?:2131|1800|35)/, name: 'JCB', cvvLength: 3 },
  UNIONPAY: { pattern: /^62/, name: 'UnionPay', cvvLength: 3 },
  DINERS: { pattern: /^3[0689]/, name: 'Diners', cvvLength: 3 }
}

// 检测卡类型
function detectCardType(number) {
  for (const [type, config] of Object.entries(CARD_TYPES)) {
    if (config.pattern.test(number)) {
      return config
    }
  }
  return { name: 'Unknown', cvvLength: 3 }
}

// Luhn算法验证
function luhnCheck(number) {
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

// 标准化卡号（移除空格和连字符）
function normalizeCardNumber(number) {
  return number.replace(/[\s-]/g, '')
}

// 验证有效期
function validateExpiry(month, year) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  
  // 处理两位年份
  const fullYear = year < 100 ? 2000 + year : year
  
  // 检查月份范围
  if (month < 1 || month > 12) {
    return { valid: false, reason: 'month_invalid' }
  }
  
  // 检查是否过期
  if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
    return { valid: false, reason: 'expired' }
  }
  
  // 检查是否超过最大年限（默认15年）
  const maxYears = 15
  if (fullYear > currentYear + maxYears) {
    return { valid: false, reason: 'expiry_too_far' }
  }
  
  return { valid: true, month, year: fullYear }
}

// 验证CVV
function validateCVV(cvv, cardType) {
  if (!cvv) {
    return { valid: false, reason: 'cvv_missing' }
  }
  
  if (!/^\d+$/.test(cvv)) {
    return { valid: false, reason: 'cvv_not_numeric' }
  }
  
  const expectedLength = cardType.cvvLength
  if (cvv.length !== expectedLength) {
    return { valid: false, reason: `cvv_length_${cardType.name.toLowerCase()}` }
  }
  
  return { valid: true }
}

// 解析输入行
function parseLine(line) {
  const parts = line.split('|')
  if (parts.length < 4) {
    return { error: 'insufficient_parts' }
  }
  
  const [number, month, year, cvv, ...other] = parts
  const otherText = other.join('|') // 合并可能包含|的其他信息
  
  return {
    number: normalizeCardNumber(number),
    month: parseInt(month, 10),
    year: parseInt(year, 10),
    cvv: cvv || '',
    other: otherText
  }
}

// 验证单张卡
function validateCard(parsed, index) {
  const { number, month, year, cvv, other } = parsed
  const reasons = []
  
  // 检查卡号长度
  if (number.length < 13 || number.length > 19) {
    reasons.push('length_invalid')
  }
  
  // 检测卡类型
  const cardType = detectCardType(number)
  const bin = number.substring(0, Math.min(6, number.length))
  
  // Luhn验证
  const luhnValid = luhnCheck(number)
  if (!luhnValid) {
    reasons.push('luhn_invalid')
  }
  
  // 有效期验证
  const expiryResult = validateExpiry(month, year)
  if (!expiryResult.valid) {
    reasons.push(expiryResult.reason)
  }
  
  // CVV验证
  const cvvResult = validateCVV(cvv, cardType)
  if (!cvvResult.valid) {
    reasons.push(cvvResult.reason)
  }
  
  // 生成掩码卡号
  const masked = number.length > 4 
    ? number.substring(0, 4) + '*'.repeat(number.length - 8) + number.substring(number.length - 4)
    : number
  
  return {
    index,
    originalLine: `${number}|${month}|${year}|${cvv}${other ? '|' + other : ''}`,
    masked,
    valid: reasons.length === 0,
    reasons,
    bin,
    cardType: cardType.name,
    expiry: expiryResult.valid ? { month: expiryResult.month, year: expiryResult.year } : null
  }
}

// 处理数据块
async function processChunk(lines, startIndex, chunkSize) {
  const results = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const parsed = parseLine(line)
    if (parsed.error) {
      results.push({
        index: startIndex + i,
        originalLine: line,
        masked: 'INVALID',
        valid: false,
        reasons: [parsed.error],
        bin: '',
        cardType: 'Unknown',
        expiry: null
      })
      continue
    }
    
    const result = validateCard(parsed, startIndex + i)
    results.push(result)
  }
  
  return results
}

// 主处理函数
async function processBatch(lines, chunkSize = 10000, maxYears = 15) {
  const results = []
  const total = lines.length
  
  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize)
    const chunkResults = await processChunk(chunk, i, chunkSize)
    results.push(...chunkResults)
    
    // 发送进度报告
    self.postMessage({
      type: 'progress',
      payload: {
        done: Math.min(i + chunkSize, total),
        total
      }
    })
    
    // 让出控制权，避免阻塞
    await new Promise(resolve => setTimeout(resolve, 0))
  }
  
  return results
}

// 监听消息
self.onmessage = async function(e) {
  const { id, type, payload } = e.data
  
  try {
    if (type === 'validateBatch') {
      const { lines, maxYears = 15, chunkSize = 10000 } = payload
      
      const results = await processBatch(lines, chunkSize, maxYears)
      
      self.postMessage({
        id,
        type: 'result',
        ok: true,
        payload: { results }
      })
    }
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      error: error.message
    })
  }
}
