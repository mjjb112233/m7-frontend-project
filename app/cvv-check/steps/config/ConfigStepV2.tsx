import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, TrendingUp, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCVVCheckAPI } from "@/lib/api"
import { LoadingState } from "../../components/LoadingState"
import { Channel, DetectionMode, DetectionConfig, DetectionModeType } from "../../types"

interface ConfigStepV2Props {
  onNext: () => void
  // 配置选择完成后的回调，将选择的配置传递给父组件
  onConfigSelected?: (config: { mode: DetectionModeType; channel: Channel }) => void
}

/**
 * 重构后的配置步骤组件
 * 特点：
 * 1. 组件内部自主获取数据
 * 2. 独立的状态管理
 * 3. 按需加载，只在需要时获取数据
 * 4. 更好的错误处理和加载状态
 */
export function ConfigStepV2({
  onNext,
  onConfigSelected
}: ConfigStepV2Props) {
  const { t, language } = useLanguage()
  
  // 根据语言获取本地化文本
  const getLocalizedText = (item: { name_zh?: string; name_en?: string; description_zh?: string; description_en?: string; speed_zh?: string; speed_en?: string }, field: 'name' | 'description' | 'speed'): string => {
    if (field === 'name') {
      return language === 'en' ? (item.name_en || item.name_zh || '') : (item.name_zh || item.name_en || '')
    } else if (field === 'description') {
      return language === 'en' ? (item.description_en || item.description_zh || '') : (item.description_zh || item.description_en || '')
    } else if (field === 'speed') {
      return language === 'en' ? (item.speed_en || item.speed_zh || '') : (item.speed_zh || item.speed_en || '')
    }
    return ''
  }
  
  // 格式化消耗价格为两位小数
  const formatRate = (rate: string | number | undefined): string => {
    if (!rate && rate !== 0) return '0.00'
    const num = typeof rate === 'string' ? parseFloat(rate) : rate
    if (isNaN(num)) return '0.00'
    return num.toFixed(2)
  }
  
  // 组件内部状态管理
  const [detectionConfig, setDetectionConfig] = useState<DetectionConfig | null>(null)
  const [isLoadingConfig, setIsLoadingConfig] = useState(false)
  const [configError, setConfigError] = useState<string | null>(null)
  
  // 组件内部的选择状态
  const [selectedMode, setSelectedMode] = useState<DetectionMode | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  
  // 获取API实例
  const api = useCVVCheckAPI()
  
  // 组件挂载时自动获取配置数据
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoadingConfig(true)
      setConfigError(null)
      try {
        console.log("[ConfigStepV2] 开始获取检测配置...")
        const result = await api.fetchDetectionConfig()
        if (result) {
          console.log("[ConfigStepV2] 配置获取成功:", result)
          const firstChannel = result?.detectionModes?.[0]?.["channels-data"]?.channels?.[0]
          console.log("[ConfigStepV2] 第一个通道数据:", firstChannel)
          if (firstChannel) {
            console.log("[ConfigStepV2] 通道字段检查 - description_zh:", firstChannel.description_zh)
            console.log("[ConfigStepV2] 通道字段检查 - description_en:", firstChannel.description_en)
            console.log("[ConfigStepV2] 通道所有字段:", Object.keys(firstChannel))
          }
          setDetectionConfig(result as DetectionConfig)
        }
      } catch (error) {
        console.error("[ConfigStepV2] 配置获取失败:", error)
        setConfigError(error instanceof Error ? error.message : '获取配置失败')
      } finally {
        setIsLoadingConfig(false)
      }
    }
    
    fetchConfig()
  }, []) // 移除 api 依赖，只在组件挂载时执行一次

  // 当配置数据加载完成后，设置默认选择的模式
  useEffect(() => {
    if (detectionConfig?.detectionModes && detectionConfig.detectionModes.length > 0 && !selectedMode) {
      const firstMode = detectionConfig.detectionModes[0]
      setSelectedMode(firstMode)
    }
  }, [detectionConfig, selectedMode])
  
  // 根据API响应数据获取channels
  const getChannelsForMode = (mode: DetectionMode): Channel[] => {
    // 如果没有配置数据，返回空数组
    if (!detectionConfig?.detectionModes) {
      return []
    }

    // 查找对应模式的channels-data
    const modeEntry = detectionConfig.detectionModes.find((item) => 
      item["mode-id"] === mode["mode-id"]
    )
    
    if (modeEntry) {
      return modeEntry["channels-data"]?.channels || []
    }

    return []
  }

  const channels: Channel[] = selectedMode ? getChannelsForMode(selectedMode) : []
  
  // 调试：检查通道数据
  useEffect(() => {
    if (channels.length > 0) {
      console.log("[ConfigStepV2] 第一个通道数据:", channels[0])
      console.log("[ConfigStepV2] 当前语言:", language)
      console.log("[ConfigStepV2] description_zh:", channels[0].description_zh)
      console.log("[ConfigStepV2] description_en:", channels[0].description_en)
      console.log("[ConfigStepV2] 本地化结果:", getLocalizedText(channels[0], 'description'))
    }
  }, [channels, language])

  // 将mode-id转换为DetectionModeType
  const getModeTypeFromId = (modeId: number): DetectionModeType => {
    switch (modeId) {
      case 1: return "charge_test"
      case 2: return "no_cvv"
      case 3: return "with_cvv"
      default: return "charge_test"
    }
  }

  // 处理模式选择
  const handleModeSelect = (mode: DetectionMode) => {
    setSelectedMode(mode)
    setSelectedChannel(null) // 切换模式时清空通道选择
  }

  // 处理通道选择
  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel)
    
    // 选择通道后立即通知父组件
    if (onConfigSelected && selectedMode) {
      const modeType = getModeTypeFromId(selectedMode["mode-id"])
      console.log("[ConfigStepV2] 配置传出:", { mode: modeType, channel })
      onConfigSelected({ mode: modeType, channel })
    }
  }

  // 处理下一步点击
  const handleNext = () => {
    if (selectedMode && selectedChannel) {
      // 确保配置已同步到父组件
      if (onConfigSelected) {
        const modeType = getModeTypeFromId(selectedMode["mode-id"])
        console.log("[ConfigStepV2] 下一步时配置传出:", { mode: modeType, channel: selectedChannel })
        onConfigSelected({ mode: modeType, channel: selectedChannel })
      }
      onNext()
    }
  }

  // 加载状态处理
  if (isLoadingConfig) {
    return (
      <LoadingState 
        message={t("cvv.loadingConfig")}
        description={t("cvv.loadingConfigDesc")}
      />
    )
  }

  // 错误处理
  if (configError) {
    return (
      <Card className="max-w-5xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-4">{t("cvv.configLoadFailed")}: {configError}</div>
          <Button onClick={() => window.location.reload()}>{t("cvv.reload")}</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl max-w-5xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="relative text-left pb-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="h-4 w-4 text-white" />
          </div>
          {t("cvv.detectionConfig")}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 text-left">{t("cvv.selectModeAndChannel")}</CardDescription>
        {isLoadingConfig && (
          <div className="flex items-center gap-2 text-xs text-gray-600 justify-center mt-2">
            <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            {t("cvv.loadingConfig")}
          </div>
        )}
      </CardHeader>
      <CardContent className="relative space-y-6 p-6">
        {/* 检测模式和通道选择 - 左右布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
          {/* 左侧：检测模式选择 - 占1列 */}
          <div className="lg:col-span-1 space-y-4">
            <label className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="h-3 w-3 text-white" />
              </div>
              {t("cvv.detectionMode")}
            </label>
            <div className="flex flex-col gap-3 items-center" style={{marginTop: '50px'}}>
              {detectionConfig?.detectionModes?.map((modeData) => {
                // 直接使用当前模式数据
                const modeConfig = modeData["channels-data"]
                const isEnabled = true // 所有模式默认启用

                return (
                  <Button
                    key={modeData["mode-id"]}
                    variant={selectedMode?.["mode-id"] === modeData["mode-id"] ? "default" : "outline"}
                    size="sm"
                    onClick={() => isEnabled && handleModeSelect(modeData)}
                    disabled={!isEnabled}
                    className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:shadow-md rounded min-w-[140px] max-w-[200px] whitespace-nowrap ${
                      selectedMode?.["mode-id"] === modeData["mode-id"]
                        ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-md"
                        : "bg-white hover:bg-gray-50 border border-gray-200"
                    } ${!isEnabled ? "opacity-50" : ""}`}
                    title={modeConfig ? getLocalizedText({ description_zh: modeConfig.description_zh || '', description_en: modeConfig.description_en || '' }, 'description') : ''}
                  >
                    {getLocalizedText(modeData, 'name')}
                    {!isEnabled && <span className="ml-1 text-xs">({t("cvv.maintenance")})</span>}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* 分割线 */}
          <div className="hidden lg:block absolute left-1/5 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent shadow-sm"></div>

          {/* 右侧：通道选择 - 占4列 */}
          <div className="lg:col-span-4 space-y-4">
            <label className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              {t("cvv.selectChannel")}
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((channel, index) => {
                const channelColors = [
                  { from: "blue-500", to: "cyan-500", bg: "blue-50", border: "blue-200" },
                  { from: "emerald-500", to: "green-500", bg: "emerald-50", border: "emerald-200" },
                  { from: "purple-500", to: "violet-500", bg: "purple-50", border: "purple-200" },
                ]
                const colorTheme = channelColors[index % channelColors.length]

                return (
                  <Card
                    key={channel.id}
                    className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 border-0 shadow-lg ${
                      selectedChannel?.id === channel.id
                        ? `ring-2 ring-${colorTheme.from.split("-")[0]}-500 bg-${colorTheme.bg} shadow-xl`
                        : channel.status !== "idle"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                    }`}
                    onClick={() => channel.status === "idle" && handleChannelSelect(channel)}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-${colorTheme.bg} to-${colorTheme.bg} opacity-60`}
                    ></div>
                    <div
                      className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-${colorTheme.from}/20 to-${colorTheme.to}/20 rounded-full -translate-y-10 translate-x-10`}
                    ></div>
                    <CardContent className="relative p-4 pb-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-sm text-gray-900">{getLocalizedText(channel, 'name')}</span>
                        <Badge
                          variant={
                            channel.status === "idle"
                              ? "default"
                              : channel.status === "busy"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs font-medium"
                        >
                          {channel.status === "idle" ? t("cvv.statusOnline") : channel.status === "busy" ? t("cvv.statusBusy") : t("cvv.statusOffline")}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>{t("cvv.consumptionLabel")}:</span>
                          <span className={`font-semibold text-${colorTheme.from.split("-")[0]}-600`}>
                            {formatRate(channel.consumption || channel.rate)} {t("cvv.mCoins")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t("cvv.speedLabel")}:</span>
                          <span className="font-semibold">{getLocalizedText(channel, 'speed')}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">{getLocalizedText(channel, 'description')}</div>
                      </div>
                    </CardContent>
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${colorTheme.from} to-${colorTheme.to}`}
                    ></div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* 当前选择显示 */}
        {selectedChannel && (
          <Card className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-12 translate-x-12"></div>
            <CardContent className="relative p-4">
              <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                {t("cvv.currentSelection")}: {selectedMode ? getLocalizedText(selectedMode, 'name') : ''} - {selectedChannel ? getLocalizedText(selectedChannel, 'name') : ''}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="text-center p-2 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="font-semibold text-blue-600 text-sm">
                    {formatRate(selectedChannel.consumption || selectedChannel.rate)}
                  </div>
                  <div className="text-gray-600">{t("cvv.mCoins")}</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="font-semibold text-gray-900 text-sm">{getLocalizedText(selectedChannel, 'speed')}</div>
                  <div className="text-gray-600">{t("cvv.speed")}</div>
                </div>
                <div className="col-span-2 p-2 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="text-gray-600 text-xs">{getLocalizedText(selectedChannel, 'description')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 下一步按钮 */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleNext}
            disabled={!selectedChannel}
            size="sm"
            className="px-8 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {t("cvv.nextStepInput")}
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      </CardContent>
    </Card>
  )
}
