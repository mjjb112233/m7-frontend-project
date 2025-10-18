"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

// DiceBear 头像风格配置
export const DICEBEAR_STYLES = {
  adventurer: { name: "冒险家", category: "人物" },
  "adventurer-neutral": { name: "冒险家(中性)", category: "人物" },
  avataaars: { name: "Avataaars", category: "卡通" },
  "big-ears": { name: "大耳朵", category: "可爱" },
  "big-ears-neutral": { name: "大耳朵(中性)", category: "可爱" },
  "big-smile": { name: "大笑脸", category: "表情" },
  bottts: { name: "机器人", category: "科技" },
  "bottts-neutral": { name: "机器人(中性)", category: "科技" },
  croodles: { name: "涂鸦", category: "艺术" },
  "croodles-neutral": { name: "涂鸦(中性)", category: "艺术" },
  fun: { name: "趣味", category: "可爱" },
  icons: { name: "图标", category: "简约" },
  identicon: { name: "几何", category: "抽象" },
  initials: { name: "首字母", category: "简约" },
  lorelei: { name: "洛蕾莱", category: "人物" },
  "lorelei-neutral": { name: "洛蕾莱(中性)", category: "人物" },
  micah: { name: "米卡", category: "人物" },
  miniavs: { name: "迷你头像", category: "可爱" },
  "open-peeps": { name: "开放人物", category: "人物" },
  personas: { name: "角色", category: "人物" },
  "pixel-art": { name: "像素艺术", category: "复古" },
  "pixel-art-neutral": { name: "像素艺术(中性)", category: "复古" },
  shapes: { name: "形状", category: "抽象" },
  thumbs: { name: "拇指", category: "表情" },
}

// 分类配置
export const AVATAR_CATEGORIES = {
  "人物": { color: "from-blue-500 to-indigo-600", icon: "👤" },
  "卡通": { color: "from-green-500 to-teal-600", icon: "🎨" },
  "可爱": { color: "from-pink-500 to-rose-600", icon: "😊" },
  "表情": { color: "from-yellow-500 to-orange-600", icon: "😀" },
  "科技": { color: "from-purple-500 to-violet-600", icon: "🤖" },
  "艺术": { color: "from-red-500 to-pink-600", icon: "🎭" },
  "简约": { color: "from-gray-500 to-slate-600", icon: "⚪" },
  "抽象": { color: "from-indigo-500 to-purple-600", icon: "🔮" },
  "复古": { color: "from-amber-500 to-yellow-600", icon: "👾" },
}

// 预设种子值，确保头像的一致性
export const AVATAR_SEEDS = [
  "Felix", "Aneka", "Trouble", "Zoey", "Tigger", "Sammy", "Sassy", "Shadow",
  "Smokey", "Clementine", "Kitty", "Chester", "Mittens", "Misty", "Oscar", 
  "Peanut", "Pudding", "Smudge", "Snickers", "Socks", "Spooky", "Sugar", 
  "Whiskers", "Abby", "Angel", "Annie", "Baby", "Bailey", "Bandit", "Bear", 
  "Bella", "Bob", "Boo", "Boots", "Bubba", "Buddy", "Buster", "Cali", 
  "Callie", "Casper", "Charlie", "Chloe", "Cleo", "Coco", "Cookie", "Cuddles"
]

interface DiceBearAvatarProps {
  seed?: string
  style?: keyof typeof DICEBEAR_STYLES
  size?: number
  className?: string
  showBorder?: boolean
  animated?: boolean
}

export function DiceBearAvatar({ 
  seed = "default",
  style = "adventurer",
  size = 100,
  className,
  showBorder = true,
  animated = true
}: DiceBearAvatarProps) {
  const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=${size}`
  
  const styleInfo = DICEBEAR_STYLES[style]
  const categoryInfo = AVATAR_CATEGORIES[styleInfo.category as keyof typeof AVATAR_CATEGORIES]

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full overflow-hidden transition-all duration-500",
        animated && "hover:scale-110 hover:rotate-2 transform-gpu",
        showBorder && "ring-4 ring-white shadow-2xl",
        className
      )}
      style={{ width: size, height: size }}
      title={`${styleInfo.name} - ${seed}`}
    >
      {/* 背景渐变 */}
      {showBorder && (
        <div className={cn(
          "absolute -inset-2 rounded-full bg-gradient-to-br opacity-75 blur-sm",
          categoryInfo.color,
          animated && "animate-pulse"
        )} style={{animationDuration: '3s'}} />
      )}
      
      {/* 头像图片 */}
      <img
        src={avatarUrl}
        alt={`${styleInfo.name} avatar`}
        className={cn(
          "w-full h-full object-cover relative z-10 bg-white rounded-full",
          animated && "transition-transform duration-300"
        )}
        onError={(e) => {
          // 如果加载失败，显示备用方案
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      
      {/* 备用方案 */}
      <div 
        className={cn(
          "hidden w-full h-full items-center justify-center bg-gradient-to-br text-white font-bold text-2xl rounded-full",
          categoryInfo.color
        )}
      >
        {categoryInfo.icon}
      </div>
      
      {/* 3D高光效果 */}
      {showBorder && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-20"></div>
          <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-sm pointer-events-none z-20"></div>
        </>
      )}
    </div>
  )
}

interface DiceBearSelectorProps {
  selectedSeed?: string
  selectedStyle?: keyof typeof DICEBEAR_STYLES
  onSelect: (seed: string, style: keyof typeof DICEBEAR_STYLES) => void
  className?: string
  showCategories?: boolean
  showStyles?: boolean
}

export function DiceBearSelector({ 
  selectedSeed = "default",
  selectedStyle = "adventurer",
  onSelect,
  className,
  showCategories = true,
  showStyles = true
}: DiceBearSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentStyle, setCurrentStyle] = useState<keyof typeof DICEBEAR_STYLES>(selectedStyle)
  
  const filteredStyles = selectedCategory 
    ? Object.entries(DICEBEAR_STYLES).filter(([_, info]) => info.category === selectedCategory)
    : Object.entries(DICEBEAR_STYLES)

  const handleStyleChange = (style: keyof typeof DICEBEAR_STYLES) => {
    setCurrentStyle(style)
    onSelect(selectedSeed, style)
  }

  const handleSeedSelect = (seed: string) => {
    onSelect(seed, currentStyle)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* 当前预览 */}
      <div className="flex justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
        <DiceBearAvatar 
          seed={selectedSeed}
          style={currentStyle}
          size={120}
          showBorder={true}
          animated={true}
        />
      </div>

      {/* 风格分类选择 */}
      {showCategories && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">选择分类</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105",
                !selectedCategory 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25" 
                  : "bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
              )}
            >
              全部风格
            </button>
            {Object.entries(AVATAR_CATEGORIES).map(([category, info]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-1",
                  selectedCategory === category 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                )}
              >
                <span>{info.icon}</span>
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 风格选择 */}
      {showStyles && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">选择风格</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredStyles.map(([style, info]) => (
              <button
                key={style}
                onClick={() => handleStyleChange(style as keyof typeof DICEBEAR_STYLES)}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 text-left",
                  currentStyle === style 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DiceBearAvatar 
                    seed={selectedSeed}
                    style={style as keyof typeof DICEBEAR_STYLES}
                    size={32}
                    showBorder={false}
                    animated={false}
                  />
                  <div>
                    <div className="font-medium text-sm">{info.name}</div>
                    <div className="text-xs text-gray-500">{info.category}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 种子选择 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">选择头像变体</h3>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
          {AVATAR_SEEDS.map((seed) => (
            <button
              key={seed}
              onClick={() => handleSeedSelect(seed)}
              className={cn(
                "relative group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full",
                selectedSeed === seed && "ring-2 ring-blue-500 ring-offset-2 scale-110"
              )}
              title={seed}
            >
              <DiceBearAvatar 
                seed={seed}
                style={currentStyle}
                size={60}
                showBorder={true}
                animated={true}
                className="group-hover:shadow-xl"
              />
              {selectedSeed === seed && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}