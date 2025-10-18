import { GroupedResult, CardInfo } from "../types"

export function formatResults(groupedResults: GroupedResult): string {
  let result = "分类结果:\n\n"
  
  Object.entries(groupedResults).forEach(([category, cards]) => {
    result += `${category} (${cards.length} 张卡片):\n`
    cards.forEach(card => {
      result += `  ${card.CardNumber} - ${card.CardBrand} ${card.Type} ${card.CardSegmentType}\n`
    })
    result += "\n"
  })
  
  return result
}

export function downloadResults(groupedResults: GroupedResult, filename: string = "bin-classification-results.txt") {
  const content = formatResults(groupedResults)
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error("复制到剪贴板失败:", error)
    return false
  }
}
