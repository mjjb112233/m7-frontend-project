import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, X, BarChart3, Plus } from "lucide-react"

interface FilterOption {
  key: string
  label: string
  value: string
}

interface MultiDimensionFilterProps {
  hasQueryResults: boolean
  activeFilters: FilterOption[]
  onAddFilter: (dimension: string) => void
  onRemoveFilter: (key: string) => void
  onFilterValueChange: (key: string, value: string) => void
  availableOptions: Record<string, string[]>
  selectedCategory: string
  onCategoryChange: (category: string) => void
  // 统计数据
  totalResults: number
  groupCount: number
  totalQueryResults?: number
  hasFilters?: boolean
  // 新查询功能
  onNewQuery?: () => void
}

export function MultiDimensionFilter({
  hasQueryResults,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  onFilterValueChange,
  availableOptions,
  selectedCategory,
  onCategoryChange,
  totalResults,
  groupCount,
  totalQueryResults = 0,
  hasFilters = false,
  onNewQuery
}: MultiDimensionFilterProps) {
  const dimensions = [
    { key: "brand", label: "卡片品牌" },
    { key: "type", label: "卡片种类" },
    { key: "level", label: "卡片等级" },
    { key: "bank", label: "发卡行" },
    { key: "country", label: "发卡国家" },
    { key: "product", label: "产品名称" }
  ]

  const availableDimensions = dimensions.filter(
    dim => !activeFilters.some(filter => filter.key === dim.key) && dim.key !== selectedCategory
  )

  if (!hasQueryResults) {
    return null
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <Filter className="h-4 w-4 text-white" />
            </div>
            多维度筛选
          </div>
          {onNewQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNewQuery}
              className="text-xs hover:bg-blue-50 hover:border-blue-300"
            >
              <Plus className="w-3 h-3 mr-1" />
              新查询
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 统计信息区域 - 紧凑版 */}
        {(groupCount > 0 || totalQueryResults > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <BarChart3 className="h-2.5 w-2.5 text-white" />
                </div>
                <span className="text-xs font-medium text-purple-700">统计</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {totalQueryResults > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">查询:</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5">
                      {totalQueryResults}
                    </Badge>
                  </div>
                )}
                
                {hasFilters && totalQueryResults > totalResults && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-orange-600">筛选:</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5">
                      {totalResults}
                    </Badge>
                  </div>
                )}
                
                {!hasFilters && totalResults > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-blue-600">总数:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                      {totalResults}
                    </Badge>
                  </div>
                )}
                
                {groupCount > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-green-600">分类:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
                      {groupCount}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* 分类维度选择 */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-sm font-medium text-blue-700 mb-3">主分类维度</div>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brand">卡片品牌</SelectItem>
              <SelectItem value="type">卡片种类</SelectItem>
              <SelectItem value="level">卡片等级</SelectItem>
              <SelectItem value="bank">发卡行</SelectItem>
              <SelectItem value="country">发卡国家</SelectItem>
              <SelectItem value="product">产品名称</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 添加新筛选 */}
        {availableDimensions.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">添加筛选条件</div>
            <div className="flex gap-2 flex-wrap">
              {availableDimensions.map(dimension => (
                <Button
                  key={dimension.key}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddFilter(dimension.key)}
                  className="text-xs hover:bg-purple-50 hover:border-purple-300"
                >
                  + {dimension.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 当前筛选条件 */}
        {activeFilters.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">当前筛选条件:</div>
            <div className="space-y-2">
              {activeFilters.map(filter => (
                <div key={filter.key} className="flex items-center gap-2 bg-white/80 rounded-lg p-3 border border-purple-200">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {filter.label}
                  </Badge>
                  <Select
                    value={filter.value}
                    onValueChange={(value) => onFilterValueChange(filter.key, value)}
                  >
                    <SelectTrigger className="w-40 h-8 text-xs">
                      <SelectValue placeholder="选择..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      {availableOptions[filter.key]?.filter(option => option && option.trim() !== '').map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFilter(filter.key)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeFilters.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            添加筛选条件来过滤卡片结果
          </div>
        )}
      </CardContent>
    </Card>
  )
}