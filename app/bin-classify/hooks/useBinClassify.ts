import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { CardInfo, GroupedResult, ProcessingStatus, ClassificationResult, BinClassifyConfig, BinClassifyState } from "../types"
import { useBinClassifyAPI } from "@/lib/api/bin-classify"

interface FilterOption {
  key: string
  label: string
  value: string
}

// 使用Web Worker进行大数据筛选
const useWebWorkerFilter = () => {
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    // 创建内联Web Worker - 优化版本
    const workerCode = `
      self.onmessage = function(e) {
        const { cards, filters, dimensionMap } = e.data;
        
        // 分批处理以避免占用太多内存
        const batchSize = 2000;
        const filteredCards = [];
        
        for (let i = 0; i < cards.length; i += batchSize) {
          const batch = cards.slice(i, i + batchSize);
          const filteredBatch = batch.filter(card => {
            return filters.every(filter => {
              if (filter.value === "all") return true;
              const field = dimensionMap[filter.key];
              return card[field] === filter.value;
            });
          });
          filteredCards.push(...filteredBatch);
          
          // 发送进度更新
          if (i % (batchSize * 5) === 0) {
            self.postMessage({ 
              type: 'progress', 
              processed: Math.min(i + batchSize, cards.length),
              total: cards.length 
            });
          }
        }
        
        self.postMessage({ type: 'complete', filteredCards });
      };
    `
    
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    workerRef.current = new Worker(URL.createObjectURL(blob))
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const filterWithWorker = useCallback((cards: CardInfo[], filters: FilterOption[]): Promise<CardInfo[]> => {
    return new Promise((resolve) => {
      if (!workerRef.current || filters.length === 0) {
        resolve(cards)
        return
      }

      const dimensionMap = {
        'brand': 'cardBrand',
        'type': 'type',
        'level': 'cardSegmentType',
        'bank': 'bankName',
        'country': 'countryName',
        'product': 'productName'
      }

      workerRef.current.onmessage = (e) => {
        const { type, filteredCards, processed, total } = e.data
        
        if (type === 'progress') {
          // 可以在这里更新进度显示
          console.log(`筛选进度: ${processed}/${total}`)
        } else if (type === 'complete') {
          resolve(filteredCards)
        } else {
          // 兼容旧格式
          resolve(filteredCards || e.data.filteredCards)
        }
      }

      workerRef.current.postMessage({ cards, filters, dimensionMap })
    })
  }, [])

  return filterWithWorker
}

export function useBinClassify() {
  // 基础状态
  const [cardInput, setCardInput] = useState("")
  const shouldStopProcessing = useRef(false)
  const [selectedCategory, setSelectedCategory] = useState("country")
  const [groupedResults, setGroupedResults] = useState<GroupedResult>({})
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  
  // 处理状态
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    processedCount: 0,
    totalCount: 0,
    currentCard: "",
    progress: 0
  })
  
  // 分类结果
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null)
  
  // 多维度筛选状态
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([])
  const [allCards, setAllCards] = useState<CardInfo[]>([])
  
  // 添加防抖状态
  const [isFiltering, setIsFiltering] = useState(false)
  const [filteredCards, setFilteredCards] = useState<CardInfo[]>([])
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const filterWithWorker = useWebWorkerFilter()
  
  // 配置
  const [config, setConfig] = useState<BinClassifyConfig>({
    selectedCategory: "country",
    groupBy: "country",
    sortOrder: "asc"
  })

  const { startBinClassifyQuery, getBinClassifyResults, cancelBinClassifyQuery } = useBinClassifyAPI()
  const [currentQueryId, setCurrentQueryId] = useState<string | null>(null)

  // 处理卡片分类
  const processCards = useCallback(async (cards: string[]) => {
    shouldStopProcessing.current = false
    setIsProcessing(true)
    setProcessingStatus({
      isProcessing: true,
      processedCount: 0,
      totalCount: cards.length,
      currentCard: "",
      progress: 0
    })

    try {
      // 1. 发起查询请求
      const queryResponse = await startBinClassifyQuery(cards)
      
      if (!queryResponse || !queryResponse.success) {
        throw new Error(queryResponse?.message || 'Failed to start query')
      }

      const queryId = queryResponse.data.queryId
      setCurrentQueryId(queryId)

      // 2. 轮询获取结果
      const pollInterval = setInterval(async () => {
        if (shouldStopProcessing.current) {
          clearInterval(pollInterval)
          return
        }

        const resultResponse = await getBinClassifyResults(queryId)
        
        if (!resultResponse || !resultResponse.success) {
          console.error('Failed to get results:', resultResponse?.message)
          return
        }

        const { status, totalCount, processedCount, pendingCount, results } = resultResponse.data

        // 更新进度
        if ((status === 'pending' || status === 'running') && totalCount && processedCount !== undefined) {
          setProcessingStatus(prev => ({
            ...prev,
            processedCount,
            totalCount,
            progress: (processedCount / totalCount) * 100
          }))
        }

        // 查询完成
        if (status === 'completed' && results) {
          clearInterval(pollInterval)
          
          // 直接使用API返回的数据
          setAllCards(results)
          setFilteredCards(results) // 初始化筛选结果
          
          // 使用requestIdleCallback进行异步分组
          if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
              const grouped = groupCardsByCategory(results, selectedCategory)
              setGroupedResults(grouped)
              
              setClassificationResult({
                groupedResults: grouped,
                totalCards: results.length,
                categories: Object.keys(grouped),
                processingTime: 0
              })
            })
          } else {
            // 降级到setTimeout
            setTimeout(() => {
              const grouped = groupCardsByCategory(results, selectedCategory)
              setGroupedResults(grouped)
              
              setClassificationResult({
                groupedResults: grouped,
                totalCards: results.length,
                categories: Object.keys(grouped),
                processingTime: 0
              })
            }, 0)
          }

          setIsProcessing(false)
          setProcessingStatus(prev => ({ ...prev, isProcessing: false }))
        }

        // 查询失败或被取消
        if (status === 'failed' || status === 'cancelled') {
          clearInterval(pollInterval)
          throw new Error(status === 'failed' ? 'Query failed' : 'Query cancelled')
        }
      }, 1000) // 每1秒轮询一次

    } catch (error) {
      console.error('Error processing cards:', error)
      setIsProcessing(false)
      setProcessingStatus(prev => ({ ...prev, isProcessing: false }))
    }
  }, [startBinClassifyQuery, getBinClassifyResults, selectedCategory])

  // 切换分组展开状态
  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey)
      } else {
        newSet.add(groupKey)
      }
      return newSet
    })
  }, [])

  // 收起所有分组
  const collapseAll = useCallback(() => {
    setExpandedGroups(new Set())
  }, [])

  // 异步筛选函数
  const performFilter = useCallback(async (cards: CardInfo[], filters: FilterOption[]) => {
    if (filters.length === 0) {
      return cards
    }

    // 对于大数据集，使用Web Worker
    if (cards.length > 1000) {
      return await filterWithWorker(cards, filters)
    }

    // 小数据集使用同步筛选，但分批处理
    const dimensionMap: Record<string, keyof CardInfo> = {
      'brand': 'cardBrand',
      'type': 'type',
      'level': 'cardSegmentType',
      'bank': 'bankName',
      'country': 'countryName',
      'product': 'productName'
    }

    return new Promise<CardInfo[]>((resolve) => {
      const batchSize = 500 // 减小批处理大小以提高响应性
      const result: CardInfo[] = []
      let index = 0

      const processBatch = () => {
        const batch = cards.slice(index, index + batchSize)
        const filteredBatch = batch.filter(card => {
          return filters.every(filter => {
            if (filter.value === "all") return true
            const field = dimensionMap[filter.key]
            return card[field] === filter.value
          })
        })
        
        result.push(...filteredBatch)
        index += batchSize

        if (index < cards.length) {
          // 使用setTimeout让出控制权，避免阻塞UI
          setTimeout(processBatch, 0)
        } else {
          resolve(result)
        }
      }

      processBatch()
    })
  }, [filterWithWorker])

  // 处理筛选变化
  useEffect(() => {
    if (allCards.length === 0) {
      setFilteredCards([])
      return
    }

    // 清除之前的定时器
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current)
      filterTimeoutRef.current = null
    }

    setIsFiltering(true)

    // 使用防抖
    const delay = activeFilters.length > 0 ? 300 : 0
    
    filterTimeoutRef.current = setTimeout(async () => {
      try {
        const filtered = await performFilter(allCards, activeFilters)
        setFilteredCards(filtered)
      } catch (error) {
        console.error('Filter error:', error)
        setFilteredCards(allCards) // 降级到显示所有数据
      } finally {
        setIsFiltering(false)
        filterTimeoutRef.current = null
      }
    }, delay)

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current)
        filterTimeoutRef.current = null
      }
    }
  }, [allCards, activeFilters, performFilter])

  // 处理分组变化
  useEffect(() => {
    if (filteredCards.length > 0 && classificationResult) {
      // 清除之前的定时器
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current)
        filterTimeoutRef.current = null
      }

      setIsFiltering(true)

      // 使用requestIdleCallback进行异步分组
      const groupCards = () => {
        try {
          const newGrouped = groupCardsByCategory(filteredCards, selectedCategory)
          setGroupedResults(newGrouped)
        } catch (error) {
          console.error('Error grouping cards:', error)
        } finally {
          setIsFiltering(false)
        }
      }

      if (window.requestIdleCallback) {
        window.requestIdleCallback(groupCards)
      } else {
        setTimeout(groupCards, 0)
      }
    }
  }, [filteredCards, selectedCategory, classificationResult])

  // 获取可用的筛选选项 - 使用缓存优化
  const availableOptions = useMemo(() => {
    if (allCards.length === 0) return {}
    
    const options: Record<string, string[]> = {}
    const dimensionMap: Record<string, keyof CardInfo> = {
      'brand': 'cardBrand',
      'type': 'type',
      'level': 'cardSegmentType',
      'bank': 'bankName',
      'country': 'countryName',
      'product': 'productName'
    }
    
    Object.entries(dimensionMap).forEach(([key, field]) => {
      const uniqueValues = Array.from(new Set(
        allCards
          .map(card => card[field] as string)
          .filter(value => value && value.toString().trim() !== '')
      ))
      options[key] = uniqueValues.sort()
    })
    
    return options
  }, [allCards])

  // 添加筛选条件
  const addFilter = useCallback((dimension: string) => {
    const dimensionLabels: Record<string, string> = {
      brand: "卡片品牌",
      type: "卡片种类",
      level: "卡片等级",
      bank: "发卡行",
      country: "发卡国家",
      product: "产品名称"
    }
    
    const newFilter: FilterOption = {
      key: dimension,
      label: dimensionLabels[dimension] || dimension,
      value: "all"
    }
    
    setActiveFilters(prev => [...prev, newFilter])
  }, [])

  // 移除筛选条件
  const removeFilter = useCallback((key: string) => {
    setActiveFilters(prev => prev.filter(filter => filter.key !== key))
  }, [])

  // 更新筛选条件值
  const updateFilterValue = useCallback((key: string, value: string) => {
    setActiveFilters(prev => prev.map(filter => 
      filter.key === key ? { ...filter, value } : filter
    ))
  }, [])

  // 停止处理
  const stopProcessing = useCallback(async () => {
    shouldStopProcessing.current = true
    
    // 如果有正在进行的查询，尝试取消它
    if (currentQueryId) {
      try {
        await cancelBinClassifyQuery(currentQueryId)
      } catch (error) {
        console.error('Failed to cancel query:', error)
      }
    }
    
    setIsProcessing(false)
    setProcessingStatus(prev => ({ ...prev, isProcessing: false }))
    setCurrentQueryId(null)
  }, [currentQueryId, cancelBinClassifyQuery])

  // 重置状态
  const resetState = useCallback(() => {
    shouldStopProcessing.current = false
    
    // 安全清理定时器
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current)
      filterTimeoutRef.current = null
    }
    
    setCardInput("")
    setGroupedResults({})
    setExpandedGroups(new Set())
    setIsProcessing(false)
    setClassificationResult(null)
    setAllCards([])
    setFilteredCards([])
    setActiveFilters([])
    setCurrentQueryId(null)
    setIsFiltering(false)
    setProcessingStatus({
      isProcessing: false,
      processedCount: 0,
      totalCount: 0,
      currentCard: "",
      progress: 0
    })
  }, [])

  // 组件卸载时的清理
  useEffect(() => {
    return () => {
      // 清理所有定时器
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current)
        filterTimeoutRef.current = null
      }
      shouldStopProcessing.current = true
    }
  }, [])

  return {
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
    activeFilters,
    availableOptions,
    filteredCards,
    isFiltering,
    
    // 方法
    processCards,
    stopProcessing,
    addFilter,
    removeFilter,
    updateFilterValue,
    toggleGroup,
    collapseAll,
    resetState
  }
}



// 按分类分组卡片
function groupCardsByCategory(cards: CardInfo[], category: string): GroupedResult {
  const grouped: GroupedResult = {}
  
  const dimensionMap: Record<string, keyof CardInfo> = {
    'brand': 'cardBrand',
    'type': 'type',
    'level': 'cardSegmentType',
    'bank': 'bankName',
    'country': 'countryName',
    'product': 'productName'
  }
  
  const field = dimensionMap[category] || 'countryName'
  
  cards.forEach(card => {
    const key = card[field] as string
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(card)
  })
  
  return grouped
}