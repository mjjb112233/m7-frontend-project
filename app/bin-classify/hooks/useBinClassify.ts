import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { CardInfo, GroupedResult, ProcessingStatus, ClassificationResult, BinClassifyConfig, BinClassifyState } from "../types"
import { useBinClassifyAPI } from "@/lib/api/bin-classify"

interface FilterOption {
  key: string
  label: string
  value: string
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
  
  // 配置
  const [config, setConfig] = useState<BinClassifyConfig>({
    selectedCategory: "country",
    groupBy: "country",
    sortOrder: "asc"
  })

  const { startBinClassifyQuery, getBinClassifyResults } = useBinClassifyAPI()
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

        const { status, totalCount, processedCount, results } = resultResponse.data

        // 更新进度
        if (status === 'processing' && totalCount && processedCount !== undefined) {
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
          
          // 按选择的分类进行分组
          const grouped = groupCardsByCategory(results, selectedCategory)
          setGroupedResults(grouped)
          
          setClassificationResult({
            groupedResults: grouped,
            totalCards: results.length,
            categories: Object.keys(grouped),
            processingTime: 0 // API不返回处理时间
          })

          setIsProcessing(false)
          setProcessingStatus(prev => ({ ...prev, isProcessing: false }))
        }

        // 查询失败
        if (status === 'failed') {
          clearInterval(pollInterval)
          throw new Error('Query failed')
        }
      }, 5000) // 每5秒轮询一次

    } catch (error) {
      console.error('Error processing cards:', error)
      setIsProcessing(false)
      setProcessingStatus(prev => ({ ...prev, isProcessing: false }))
    }
  }, [startBinClassifyQuery, getBinClassifyResults])

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

  // 筛选卡片
  const filteredCards = useMemo(() => {
    if (activeFilters.length === 0) return allCards
    
    const dimensionMap: Record<string, keyof CardInfo> = {
      'brand': 'CardBrand',
      'type': 'Type',
      'level': 'CardSegmentType',
      'bank': 'BankName',
      'country': 'CountryName',
      'currency': 'IssuerCurrency'
    }
    
    return allCards.filter(card => {
      return activeFilters.every(filter => {
        if (filter.value === "all") return true
        const field = dimensionMap[filter.key]
        return card[field] === filter.value
      })
    })
  }, [allCards, activeFilters])

  // 获取可用的筛选选项
  const availableOptions = useMemo(() => {
    const options: Record<string, string[]> = {}
    const dimensionMap: Record<string, keyof CardInfo> = {
      'brand': 'CardBrand',
      'type': 'Type',
      'level': 'CardSegmentType',
      'bank': 'BankName',
      'country': 'CountryName',
      'currency': 'IssuerCurrency'
    }
    
    Object.entries(dimensionMap).forEach(([key, field]) => {
      const uniqueValues = Array.from(new Set(allCards.map(card => card[field] as string)))
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
      currency: "国家货币"
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



  // 当筛选条件或分类维度改变时自动重新分类
  useEffect(() => {
    if (allCards.length > 0 && classificationResult) {
      const newGrouped = groupCardsByCategory(filteredCards, selectedCategory)
      setGroupedResults(newGrouped)
    }
  }, [filteredCards, selectedCategory, allCards.length, classificationResult])

  // 停止处理
  const stopProcessing = useCallback(() => {
    shouldStopProcessing.current = true
    setIsProcessing(false)
    setProcessingStatus(prev => ({ ...prev, isProcessing: false }))
    setCurrentQueryId(null)
  }, [])

  // 重置状态
  const resetState = useCallback(() => {
    shouldStopProcessing.current = false
    setCardInput("")
    setGroupedResults({})
    setExpandedGroups(new Set())
    setIsProcessing(false)
    setClassificationResult(null)
    setAllCards([])
    setActiveFilters([])
    setCurrentQueryId(null)
    setProcessingStatus({
      isProcessing: false,
      processedCount: 0,
      totalCount: 0,
      currentCard: "",
      progress: 0
    })
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

// 生成卡片信息的辅助函数
function generateCardInfo(cardData: string): CardInfo {
  const [cardNumber] = cardData.split("|")
  const bin = cardNumber.substring(0, 6)
  
  // 扩展的模拟BIN查询结果
  const mockData: Record<string, { brand: string; type: string; level: string; bank: string; country: string; currency: string }> = {
    // Visa卡片 - 美国
    "400000": { brand: "Visa", type: "Credit", level: "Classic", bank: "Chase Bank", country: "US", currency: "USD" },
    "411111": { brand: "Visa", type: "Credit", level: "Gold", bank: "Bank of America", country: "US", currency: "USD" },
    "412345": { brand: "Visa", type: "Credit", level: "Platinum", bank: "Wells Fargo", country: "US", currency: "USD" },
    "413456": { brand: "Visa", type: "Debit", level: "Standard", bank: "Citibank", country: "US", currency: "USD" },
    "414567": { brand: "Visa", type: "Credit", level: "Signature", bank: "Capital One", country: "US", currency: "USD" },
    
    // Visa卡片 - 加拿大
    "415678": { brand: "Visa", type: "Credit", level: "Infinite", bank: "TD Bank", country: "CA", currency: "CAD" },
    "416789": { brand: "Visa", type: "Debit", level: "Classic", bank: "RBC", country: "CA", currency: "CAD" },
    "417890": { brand: "Visa", type: "Credit", level: "Gold", bank: "Scotiabank", country: "CA", currency: "CAD" },
    
    // Visa卡片 - 英国
    "418901": { brand: "Visa", type: "Credit", level: "Platinum", bank: "Barclays", country: "UK", currency: "GBP" },
    "419012": { brand: "Visa", type: "Debit", level: "Standard", bank: "HSBC UK", country: "UK", currency: "GBP" },
    "420123": { brand: "Visa", type: "Credit", level: "Gold", bank: "Lloyds Bank", country: "UK", currency: "GBP" },
    
    // Mastercard卡片 - 美国
    "500000": { brand: "Mastercard", type: "Credit", level: "Standard", bank: "JPMorgan Chase", country: "US", currency: "USD" },
    "511111": { brand: "Mastercard", type: "Credit", level: "Gold", bank: "Bank of America", country: "US", currency: "USD" },
    "512345": { brand: "Mastercard", type: "Credit", level: "Platinum", bank: "Wells Fargo", country: "US", currency: "USD" },
    "513456": { brand: "Mastercard", type: "Debit", level: "Standard", bank: "Citibank", country: "US", currency: "USD" },
    "514567": { brand: "Mastercard", type: "Credit", level: "World", bank: "Capital One", country: "US", currency: "USD" },
    
    // Mastercard卡片 - 加拿大
    "515678": { brand: "Mastercard", type: "Credit", level: "World Elite", bank: "BMO", country: "CA", currency: "CAD" },
    "516789": { brand: "Mastercard", type: "Debit", level: "Standard", bank: "RBC", country: "CA", currency: "CAD" },
    "517890": { brand: "Mastercard", type: "Credit", level: "Gold", bank: "TD Bank", country: "CA", currency: "CAD" },
    
    // Mastercard卡片 - 欧洲
    "518901": { brand: "Mastercard", type: "Credit", level: "Platinum", bank: "Santander", country: "ES", currency: "EUR" },
    "519012": { brand: "Mastercard", type: "Debit", level: "Standard", bank: "Deutsche Bank", country: "DE", currency: "EUR" },
    "520123": { brand: "Mastercard", type: "Credit", level: "Gold", bank: "BNP Paribas", country: "FR", currency: "EUR" },
    
    // American Express卡片
    "340000": { brand: "American Express", type: "Credit", level: "Green", bank: "American Express", country: "US", currency: "USD" },
    "341111": { brand: "American Express", type: "Credit", level: "Gold", bank: "American Express", country: "US", currency: "USD" },
    "342345": { brand: "American Express", type: "Credit", level: "Platinum", bank: "American Express", country: "US", currency: "USD" },
    "343456": { brand: "American Express", type: "Credit", level: "Centurion", bank: "American Express", country: "US", currency: "USD" },
    "344567": { brand: "American Express", type: "Credit", level: "Gold", bank: "American Express", country: "CA", currency: "CAD" },
    "345678": { brand: "American Express", type: "Credit", level: "Platinum", bank: "American Express", country: "UK", currency: "GBP" },
    
    // Discover卡片
    "601100": { brand: "Discover", type: "Credit", level: "Standard", bank: "Discover Bank", country: "US", currency: "USD" },
    "601111": { brand: "Discover", type: "Credit", level: "Cash Back", bank: "Discover Bank", country: "US", currency: "USD" },
    "601234": { brand: "Discover", type: "Credit", level: "Miles", bank: "Discover Bank", country: "US", currency: "USD" },
    
    // JCB卡片 - 日本
    "352800": { brand: "JCB", type: "Credit", level: "Classic", bank: "JCB Bank", country: "JP", currency: "JPY" },
    "353456": { brand: "JCB", type: "Credit", level: "Gold", bank: "JCB Bank", country: "JP", currency: "JPY" },
    "354567": { brand: "JCB", type: "Credit", level: "Platinum", bank: "Mitsubishi UFJ", country: "JP", currency: "JPY" },
    "355678": { brand: "JCB", type: "Debit", level: "Standard", bank: "Sumitomo Mitsui", country: "JP", currency: "JPY" },
    
    // UnionPay卡片 - 中国
    "620000": { brand: "UnionPay", type: "Credit", level: "Standard", bank: "ICBC", country: "CN", currency: "CNY" },
    "621111": { brand: "UnionPay", type: "Debit", level: "Standard", bank: "Bank of China", country: "CN", currency: "CNY" },
    "622345": { brand: "UnionPay", type: "Credit", level: "Gold", bank: "China Construction Bank", country: "CN", currency: "CNY" },
    "623456": { brand: "UnionPay", type: "Credit", level: "Platinum", bank: "Agricultural Bank of China", country: "CN", currency: "CNY" },
    "624567": { brand: "UnionPay", type: "Debit", level: "Standard", bank: "China Merchants Bank", country: "CN", currency: "CNY" },
    
    // 澳大利亚银行卡
    "428000": { brand: "Visa", type: "Credit", level: "Gold", bank: "Commonwealth Bank", country: "AU", currency: "AUD" },
    "429111": { brand: "Visa", type: "Debit", level: "Standard", bank: "ANZ Bank", country: "AU", currency: "AUD" },
    "528000": { brand: "Mastercard", type: "Credit", level: "Platinum", bank: "Westpac", country: "AU", currency: "AUD" },
    "529111": { brand: "Mastercard", type: "Debit", level: "Standard", bank: "NAB", country: "AU", currency: "AUD" },
    
    // 新加坡银行卡
    "435000": { brand: "Visa", type: "Credit", level: "Signature", bank: "DBS Bank", country: "SG", currency: "SGD" },
    "436111": { brand: "Visa", type: "Debit", level: "Standard", bank: "OCBC Bank", country: "SG", currency: "SGD" },
    "535000": { brand: "Mastercard", type: "Credit", level: "World", bank: "UOB", country: "SG", currency: "SGD" },
    
    // 印度银行卡
    "440000": { brand: "Visa", type: "Credit", level: "Gold", bank: "State Bank of India", country: "IN", currency: "INR" },
    "441111": { brand: "Visa", type: "Debit", level: "Standard", bank: "HDFC Bank", country: "IN", currency: "INR" },
    "540000": { brand: "Mastercard", type: "Credit", level: "Platinum", bank: "ICICI Bank", country: "IN", currency: "INR" },
    "541111": { brand: "Mastercard", type: "Debit", level: "Standard", bank: "Axis Bank", country: "IN", currency: "INR" },
    
    // 巴西银行卡
    "460000": { brand: "Visa", type: "Credit", level: "Gold", bank: "Banco do Brasil", country: "BR", currency: "BRL" },
    "461111": { brand: "Visa", type: "Debit", level: "Standard", bank: "Itaú", country: "BR", currency: "BRL" },
    "560000": { brand: "Mastercard", type: "Credit", level: "Platinum", bank: "Bradesco", country: "BR", currency: "BRL" },
    "561111": { brand: "Mastercard", type: "Debit", level: "Standard", bank: "Santander Brasil", country: "BR", currency: "BRL" }
  }
  
  // 如果找不到匹配的BIN，生成随机的模拟数据
  const data = mockData[bin] || generateRandomCardInfo(bin)
  
  return {
    cardNumber,
    brand: data.brand,
    type: data.type,
    level: data.level,
    bank: data.bank,
    country: data.country,
    currency: data.currency
  }
}

// 生成随机卡片信息的辅助函数
function generateRandomCardInfo(bin: string) {
  const brands = ["Visa", "Mastercard", "American Express", "Discover", "JCB", "UnionPay"]
  const types = ["Credit", "Debit"]
  const levels = ["Standard", "Classic", "Gold", "Platinum", "Signature", "World", "World Elite"]
  const banks = [
    "Chase Bank", "Bank of America", "Wells Fargo", "Citibank", "Capital One",
    "TD Bank", "RBC", "Scotiabank", "BMO", "HSBC", "Barclays", "Lloyds Bank",
    "Deutsche Bank", "BNP Paribas", "Santander", "ING Bank", "Commonwealth Bank",
    "ANZ Bank", "Westpac", "NAB", "DBS Bank", "OCBC Bank", "UOB"
  ]
  const countries = ["US", "CA", "UK", "DE", "FR", "ES", "AU", "SG", "JP", "CN", "IN", "BR"]
  const currencies = ["USD", "CAD", "GBP", "EUR", "AUD", "SGD", "JPY", "CNY", "INR", "BRL"]
  
  // 使用BIN作为种子来确保相同BIN总是生成相同的结果
  const seed = parseInt(bin) % 1000
  
  return {
    brand: brands[seed % brands.length],
    type: types[seed % types.length],
    level: levels[seed % levels.length],
    bank: banks[seed % banks.length],
    country: countries[seed % countries.length],
    currency: currencies[seed % currencies.length]
  }
}

// 按分类分组卡片
function groupCardsByCategory(cards: CardInfo[], category: string): GroupedResult {
  const grouped: GroupedResult = {}
  
  const dimensionMap: Record<string, keyof CardInfo> = {
    'brand': 'CardBrand',
    'type': 'Type',
    'level': 'CardSegmentType',
    'bank': 'BankName',
    'country': 'CountryName',
    'currency': 'IssuerCurrency'
  }
  
  const field = dimensionMap[category] || 'CountryName'
  
  cards.forEach(card => {
    const key = card[field] as string
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(card)
  })
  
  return grouped
}