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

    // 返回基础卡片信息，BIN信息将通过API获取
    return {
      cardNumber,
      brand: "Unknown", // 将通过BIN查询API获取
      type: "Unknown",  // 将通过BIN查询API获取
      level: "Unknown", // 将通过BIN查询API获取
      bank: "Unknown",  // 将通过BIN查询API获取
      country: "Unknown", // 将通过BIN查询API获取
      currency: "Unknown" // 将通过BIN查询API获取
    }
  } catch (error) {
    console.error("解析卡片数据失败:", error)
    return null
  }
}