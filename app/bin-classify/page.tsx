"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/layout/auth-guard"
import { CreditCard } from "lucide-react"
import Header from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useBinClassify } from "./hooks/useBinClassify"
import { CardInput, GroupedResults, QueryProgress, MultiDimensionFilter, DataSourceInfo, LoadingOverlay } from "./components"
import { Toast } from "@/components/shared/toast"
import { getBrandingConfig } from "@/lib/config"
import { useLanguage } from "@/contexts/language-context"

export default function BinClassifyPage() {
  return (
    <AuthGuard requiredLevel={1}>
      <BinClassifyContent />
    </AuthGuard>
  )
}

function BinClassifyContent() {
  const { t } = useLanguage()
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const {
    // 状态
    cardInput,
    setCardInput,
    selectedCategory,
    setSelectedCategory,
    groupedResults,
    expandedGroups,
    isProcessing,
    processingStatus,
    classificationResult,
    config,
    setConfig,
    
    // 方法
    processCards,
    stopProcessing,
    addFilter,
    removeFilter,
    updateFilterValue,
    toggleGroup,
    collapseAll,
    resetState,
    
    // 筛选状态
    activeFilters,
    availableOptions,
    filteredCards,
    isFiltering
  } = useBinClassify()

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  const groupCount = Object.keys(groupedResults).length
  const totalResults = Object.values(groupedResults).reduce((sum, cards) => sum + cards.length, 0)
  const hasQueryResults = classificationResult !== null
  const totalQueryResults = classificationResult?.totalCards || 0

  // 处理查询卡片信息
  const handleQuery = async () => {
    if (!cardInput.trim()) return
    
    const cardList = cardInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
    
    await processCards(cardList)
  }




  // 复制卡号
  const copyCardNumber = async (cardNumber: string) => {
    let websiteName = "cc-m7.com"
    try {
      const brandingConfig = getBrandingConfig()
      websiteName = brandingConfig?.copyWebsiteName || "cc-m7.com"
    } catch (error) {
      console.error("Failed to get copy website name from config:", error)
    }
    const cardNumberWithSuffix = `${cardNumber}  ---->${websiteName}`
    try {
      await navigator.clipboard.writeText(cardNumberWithSuffix)
      showToast(t("bin.cardCopied"))
    } catch (err) {
      console.error('复制失败:', err)
      try {
        // 降级方案：创建临时文本区域
        const textArea = document.createElement('textarea')
        textArea.value = cardNumberWithSuffix
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        showToast(t("bin.cardCopied"))
      } catch (fallbackErr) {
        showToast(t("bin.copyFailed"), 'error')
      }
    }
  }

  // 开始新查询
  const handleNewQuery = () => {
    resetState()
  }

  // 停止查询
  const handleStopQuery = () => {
    stopProcessing()
  }

  // 导出数据
  const exportData = () => {
    let exportText = ""
    Object.entries(groupedResults).forEach(([groupName, cards]) => {
      exportText += `${groupName}:\n`
      cards.forEach((card) => {
        exportText += `${card.cardNumber} | ${card.cardBrand} | ${card.type} | ${card.cardSegmentType} | ${card.bankName} | ${card.countryName} | ${card.productName}\n`
      })
      exportText += "\n"
    })

    const blob = new Blob([exportText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "card_classification.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  // 获取分类标签
  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      brand: t("bin.categoryLabels.brand"),
      type: t("bin.categoryLabels.type"),
      level: t("bin.categoryLabels.level"),
      bank: t("bin.categoryLabels.bank"),
      country: t("bin.categoryLabels.country"),
      product: t("bin.categoryLabels.product"),
    }
    return labels[category] || category
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-4 pb-16">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t("bin.systemTitle")}</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">{t("bin.systemSubtitle")}</p>
        </div>

        <div className="space-y-6 mb-8">
          {/* 卡号输入区域 - 只在没有查询结果且不在处理中时显示 */}
          {!hasQueryResults && !isProcessing && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CardInput 
                  cardInput={cardInput}
                  setCardInput={setCardInput}
                  onQuery={handleQuery}
                  isProcessing={isProcessing}
                />
              </div>
              <div>
                <DataSourceInfo />
              </div>
            </div>
          )}

          {/* 查询进度区域 - 只在处理中时显示 */}
          {isProcessing && (
            <div className="max-w-2xl mx-auto">
              <QueryProgress 
                processingStatus={processingStatus}
                onStop={handleStopQuery}
              />
            </div>
          )}

          {/* 多维度筛选区域 - 查询完成后显示 */}
          <MultiDimensionFilter
            hasQueryResults={hasQueryResults}
            activeFilters={activeFilters}
            onAddFilter={addFilter}
            onRemoveFilter={removeFilter}
            onFilterValueChange={updateFilterValue}
            availableOptions={availableOptions}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            totalResults={totalResults}
            groupCount={groupCount}
            totalQueryResults={totalQueryResults}
            hasFilters={activeFilters.length > 0}
            onNewQuery={handleNewQuery}
          />
        </div>

        <div className="mb-12">
          <GroupedResults
            groupedResults={groupedResults}
            expandedGroups={expandedGroups}
            onToggleGroup={toggleGroup}
            onCopyCard={copyCardNumber}
            onCopyGroup={async (cards) => {
              let websiteName = "cc-m7.com"
              try {
                const brandingConfig = getBrandingConfig()
                websiteName = brandingConfig?.copyWebsiteName || "cc-m7.com"
              } catch (error) {
                console.error("Failed to get copy website name from config:", error)
              }
              const groupData = cards.map((card) => `${card.cardNumber}  ---->${websiteName}`).join("\n")
              try {
                await navigator.clipboard.writeText(groupData)
                showToast(t("bin.cardsCopied").replace("{count}", cards.length.toString()))
              } catch (err) {
                console.error('复制失败:', err)
                try {
                  // 降级方案
                  const textArea = document.createElement('textarea')
                  textArea.value = groupData
                  document.body.appendChild(textArea)
                  textArea.select()
                  document.execCommand('copy')
                  document.body.removeChild(textArea)
                  showToast(t("bin.cardsCopied").replace("{count}", cards.length.toString()))
                } catch (fallbackErr) {
                  showToast(t("bin.copyFailed"), 'error')
                }
              }
            }}
            onCollapseAll={collapseAll}
            onExportData={exportData}
            selectedCategory={selectedCategory}
            getCategoryLabel={getCategoryLabel}
            isFiltering={isFiltering}
          />
        </div>
      </div>
      
      <Footer />
      
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      
      <LoadingOverlay 
        isVisible={isFiltering && !isProcessing}
        message={t("bin.filtering")}
      />
    </div>
  )
}