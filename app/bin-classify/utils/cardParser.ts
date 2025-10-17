import { CardInfo } from "../types"

export function parseCardData(cardData: string): CardInfo | null {
  try {
    const parts = cardData.split("|")
    if (parts.length < 4) {
      return null
    }

    const [cardNumber, month, year, cvv, ...other] = parts
    
    // 验证卡号格式
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      return null
    }

    // 验证CVV
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      return null
    }

    // 生成BIN信息（这里使用模拟数据）
    const bin = cardNumber.substring(0, 6)
    const mockData = getMockBinData(bin)
    
    return {
      cardNumber,
      brand: mockData.brand,
      type: mockData.type,
      level: mockData.level,
      bank: mockData.bank,
      country: mockData.country,
      currency: mockData.currency
    }
  } catch (error) {
    console.error("解析卡片数据失败:", error)
    return null
  }
}

function getMockBinData(bin: string) {
  const mockData = {
    "400000": { brand: "Visa", type: "Credit", level: "Classic", bank: "Test Bank", country: "US", currency: "USD" },
    "500000": { brand: "Mastercard", type: "Credit", level: "Gold", bank: "Test Bank", country: "CA", currency: "CAD" },
    "300000": { brand: "American Express", type: "Credit", level: "Platinum", bank: "Test Bank", country: "US", currency: "USD" },
    "600000": { brand: "Discover", type: "Credit", level: "Standard", bank: "Test Bank", country: "US", currency: "USD" }
  }
  
  return mockData[bin as keyof typeof mockData] || {
    brand: "Unknown",
    type: "Credit",
    level: "Standard",
    bank: "Unknown Bank",
    country: "Unknown",
    currency: "USD"
  }
}
