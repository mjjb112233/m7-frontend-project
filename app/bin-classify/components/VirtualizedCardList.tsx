"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { CardInfo } from "../types"
import { useLanguage } from "@/contexts/language-context"

interface VirtualizedCardListProps {
  cards: CardInfo[]
  onCopyCard: (cardNumber: string) => void
  itemHeight: number
  containerHeight: number
  overscan?: number
}

export function VirtualizedCardList({ 
  cards, 
  onCopyCard, 
  itemHeight = 140, // 增加默认高度
  containerHeight = 400,
  overscan = 3
}: VirtualizedCardListProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target) {
      setScrollTop(target.scrollTop)
    }
  }, [])

  // 计算可见范围
  const visibleRange = useMemo(() => {
    if (cards.length === 0) {
      return { start: 0, end: 0 }
    }
    
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 1
    const end = Math.min(cards.length, start + visibleCount + overscan * 2)
    
    return { start, end }
  }, [scrollTop, itemHeight, containerHeight, cards.length, overscan])

  // 可见的卡片
  const visibleCards = useMemo(() => {
    if (cards.length === 0 || visibleRange.start >= cards.length) {
      return []
    }
    
    return cards.slice(visibleRange.start, visibleRange.end).map((card, index) => ({
      ...card,
      virtualIndex: visibleRange.start + index,
    }))
  }, [cards, visibleRange])

  // 总高度
  const totalHeight = cards.length * itemHeight

  // 上方占位高度
  const offsetY = visibleRange.start * itemHeight

  // 处理空数据情况
  if (cards.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-gray-500"
        style={{ height: containerHeight }}
      >
        暂无数据
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="overflow-auto"
      style={{ 
        height: containerHeight,
        maxHeight: containerHeight,
        minHeight: containerHeight
      }}
      onScroll={handleScroll}
    >
      {/* 虚拟滚动容器 - 确保有正确的高度 */}
      <div style={{ 
        height: totalHeight, 
        position: 'relative',
        minHeight: totalHeight
      }}>
        {/* 可见项容器 */}
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%'
          }}
        >
          {visibleCards.map((card) => (
            <VirtualizedCardItem
              key={`${card.cardNumber}-${card.virtualIndex}`}
              card={card}
              onCopyCard={onCopyCard}
              itemHeight={itemHeight}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface VirtualizedCardItemProps {
  card: CardInfo & { virtualIndex?: number }
  onCopyCard: (cardNumber: string) => void
  itemHeight: number
}

const VirtualizedCardItem = React.memo(function VirtualizedCardItem({ 
  card, 
  onCopyCard, 
  itemHeight
}: VirtualizedCardItemProps) {
  const handleCopy = useCallback(() => {
    onCopyCard(card.cardNumber)
  }, [card.cardNumber, onCopyCard])

  return (
    <div 
      className="bg-white/80 rounded-lg p-3 border border-purple-200 hover:border-purple-300 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md mb-2"
      style={{ 
        height: itemHeight - 8, // 减去margin
        minHeight: itemHeight - 8,
        boxSizing: 'border-box'
      }}
    >
      {/* 卡号和复制按钮 */}
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-sm font-semibold text-gray-900 truncate mr-2">
          {card.cardNumber}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 w-6 p-0 hover:bg-purple-50 hover:text-purple-600 flex-shrink-0 transition-colors duration-200"
        >
          <Copy className="w-3 h-3" />
        </Button>
      </div>
      
      {/* 简化信息显示 */}
      <div className="flex flex-wrap gap-1 overflow-hidden">
        {card.cardBrand && card.cardBrand !== '未知' && (
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
            {card.cardBrand}
          </Badge>
        )}
        {card.type && card.type !== '未知' && (
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            {card.type}
          </Badge>
        )}
        {card.cardSegmentType && card.cardSegmentType !== '未知' && (
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            {card.cardSegmentType}
          </Badge>
        )}
        {card.bankName && card.bankName !== '未知' && (
          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
            {card.bankName}
          </Badge>
        )}
        {card.countryName && card.countryName !== '未知' && (
          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
            {card.countryName}
          </Badge>
        )}
      </div>
      
      {/* 如果所有信息都是未知，显示提示 */}
      {(!card.cardBrand || card.cardBrand === '未知') && 
       (!card.type || card.type === '未知') && 
       (!card.cardSegmentType || card.cardSegmentType === '未知') && 
       (!card.bankName || card.bankName === '未知') && 
       (!card.countryName || card.countryName === '未知') && (
        <div className="text-xs text-gray-400 italic">
          {t("bin.results.noDetails")}
        </div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  return prevProps.card.cardNumber === nextProps.card.cardNumber
})