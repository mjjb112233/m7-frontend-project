import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Download, X } from "lucide-react"
import { GroupedResult, CardInfo } from "../types"

interface GroupedResultsProps {
  groupedResults: GroupedResult
  expandedGroups: Set<string>
  onToggleGroup: (groupKey: string) => void
  onCopyCard: (cardNumber: string) => void
  onCopyGroup: (cards: CardInfo[]) => void
  onCollapseAll: () => void
  onExportData: () => void
  selectedCategory: string
  getCategoryLabel: (category: string) => string
}

export function GroupedResults({ 
  groupedResults, 
  onCopyCard,
  onCopyGroup,
  onExportData,
  selectedCategory,
  getCategoryLabel
}: GroupedResultsProps) {
  const [selectedGroup, setSelectedGroup] = useState<{name: string, cards: CardInfo[]} | null>(null)
  const totalCards = Object.values(groupedResults).reduce((sum, cards) => sum + cards.length, 0)
  const groupCount = Object.keys(groupedResults).length

  const handleCardClick = (cards: CardInfo[], groupName: string) => {
    console.log('Group clicked:', groupName, 'with', cards.length, 'cards')
    setSelectedGroup({name: groupName, cards: cards})
  }

  const clearSelection = () => {
    setSelectedGroup(null)
  }

  if (totalCards === 0) {
    return null
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">按 {getCategoryLabel(selectedCategory)} 分类结果</h2>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
            {groupCount} 个分组
          </Badge>
          {selectedGroup && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              已选择: {selectedGroup.name} ({selectedGroup.cards.length}张卡)
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {selectedGroup && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
              className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              清除选择
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onExportData}
            className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 左侧卡片列表 */}
        <div className={`transition-all duration-300 ${selectedGroup ? 'w-2/3' : 'w-full'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedResults).map(([groupName, cards]) => (
              <Card
                key={groupName}
                className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group cursor-pointer ${
                  selectedGroup?.name === groupName 
                    ? 'ring-2 ring-blue-500 bg-blue-50/30' 
                    : ''
                }`}
                onClick={() => handleCardClick(cards, groupName)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-60"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                
                <CardHeader className="relative pb-3">
                  <div className="flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 rounded-lg p-2 -m-2">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-base font-semibold group-hover:text-purple-600 transition-colors">
                        {groupName}
                      </CardTitle>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium">
                        {cards.length}张卡
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onCopyGroup(cards)
                        }}
                        className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:scale-105"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      {selectedGroup?.name === groupName && (
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative pt-0 p-6">
                  <div className="text-sm text-gray-600">
                    点击查看 {cards.length} 张卡片的详细信息
                  </div>
                  
                  {/* 显示前几张卡片的预览 */}
                  <div className="mt-3 space-y-1">
                    {cards.slice(0, 3).map((card, index) => (
                      <div key={index} className="text-xs text-gray-500 font-mono truncate">
                        {card.CardNumber} • {card.CardBrand}
                      </div>
                    ))}
                    {cards.length > 3 && (
                      <div className="text-xs text-gray-400">
                        还有 {cards.length - 3} 张卡片...
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              </Card>
            ))}
          </div>
        </div>

        {/* 右侧详细信息面板 */}
        {selectedGroup && (
          <div className="w-1/3 transition-all duration-300">
            <div className="sticky top-4">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm" style={{maxHeight: 'calc(100vh - 200px)'}}>
                <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {selectedGroup.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="h-8 w-8 p-0 hover:bg-white/50 transition-all duration-300 hover:scale-105"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 flex flex-col" style={{maxHeight: 'calc(100vh - 280px)'}}>
                  {/* 组信息 - 固定在顶部 */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 mb-4">
                    <div className="text-lg font-bold text-purple-900 mb-2">
                      {selectedGroup.name}
                    </div>
                    <div className="text-sm text-purple-700 mb-3">
                      包含 {selectedGroup.cards.length} 张卡片
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCopyGroup(selectedGroup.cards)}
                      className="h-8 text-xs bg-white/80 hover:bg-white hover:scale-105 transition-all duration-300"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      复制所有卡号
                    </Button>
                  </div>

                  {/* 卡片列表标题 - 固定 */}
                  <div className="text-sm font-medium text-gray-700 mb-3">卡片列表</div>
                  
                  {/* 卡片列表 - 可滚动区域 */}
                  <div className="overflow-y-auto space-y-2 pr-2 pb-4" style={{maxHeight: 'calc(100vh - 450px)'}}>
                    {selectedGroup.cards.map((card, index) => (
                      <div key={index} className="bg-white/80 rounded-lg p-3 border border-purple-200 hover:border-purple-300 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md">
                        {/* 卡号和复制按钮 */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-mono text-sm font-semibold text-gray-900 truncate mr-2">
                            {card.CardNumber}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCopyCard(card.CardNumber)}
                            className="h-6 w-6 p-0 hover:bg-purple-50 hover:text-purple-600 flex-shrink-0 transition-colors duration-200"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {/* 简化信息显示 */}
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">{card.CardBrand}</Badge>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">{card.Type}</Badge>
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">{card.CardSegmentType}</Badge>
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">{card.IssuerCurrency}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>


    </>
  )
}