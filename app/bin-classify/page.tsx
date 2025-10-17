"use client"

import { AuthGuard } from "@/components/layout/auth-guard"
import { CreditCard } from "lucide-react"
import Header from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useBinClassify } from "./hooks/useBinClassify"
import { CardInput, GroupedResults, QueryProgress, MultiDimensionFilter, DataSourceInfo } from "./components"

export default function BinClassifyPage() {
  return (
    <AuthGuard requiredLevel={1}>
      <BinClassifyContent />
    </AuthGuard>
  )
}

function BinClassifyContent() {
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
    filteredCards
  } = useBinClassify()

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
  const copyCardNumber = (cardNumber: string) => {
    navigator.clipboard.writeText(cardNumber)
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
        exportText += `${card.cardNumber} | ${card.brand} | ${card.type} | ${card.level} | ${card.bank} | ${card.country} | ${card.currency}\n`
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
      brand: "卡片品牌",
      type: "卡片种类",
      level: "卡片等级",
      bank: "发卡行",
      country: "发卡国家",
      currency: "国家货币",
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
            <h1 className="text-2xl font-bold text-gray-900">智能卡片分类系统</h1>
          </div>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">基于BIN码的高效银行卡分类工具，支持多维度智能分析</p>
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
            onCopyGroup={(cards) => {
              const groupData = cards.map((card) => card.cardNumber).join("\n")
              navigator.clipboard.writeText(groupData)
            }}
            onCollapseAll={collapseAll}
            onExportData={exportData}
            selectedCategory={selectedCategory}
            getCategoryLabel={getCategoryLabel}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  )
}