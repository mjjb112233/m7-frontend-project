"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X, Send, Settings, Bell, BellOff, Bot } from "lucide-react"



// 3D风格的可爱机器人
const CuteRobot = ({ className = "h-20 w-20" }: { className?: string }) => {
  return (
    <div className={`${className} relative flex items-center justify-center`}>
      <div className="relative transform transition-transform duration-300 hover:scale-110">
        {/* 天线 */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="w-1 h-4 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDuration: '2s'}}></div>
        </div>
        
        {/* 头部 */}
        <div className="relative">
          <div className="w-12 h-8 bg-gradient-to-b from-blue-400 to-blue-500 rounded-t-2xl shadow-lg animate-bounce" style={{animationDuration: '3s'}}>
            {/* 眼睛 */}
            <div className="absolute top-2 left-2.5 w-2.5 h-2.5 bg-white rounded-full shadow-inner">
              <div className="w-1 h-1 bg-blue-600 rounded-full mt-0.5 ml-0.5 animate-ping" style={{animationDuration: '2s'}}></div>
            </div>
            <div className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-white rounded-full shadow-inner">
              <div className="w-1 h-1 bg-blue-600 rounded-full mt-0.5 ml-0.5 animate-ping" style={{animationDuration: '2s', animationDelay: '1s'}}></div>
            </div>
            
            {/* 嘴巴 */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-1 bg-white rounded-full opacity-80"></div>
            </div>
          </div>
        </div>
        
        {/* 身体 */}
        <div className="w-11 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-b-xl mx-auto shadow-lg relative">
          {/* 胸前面板 */}
          <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-6 h-5 bg-blue-300 rounded opacity-50"></div>
          
          {/* 中央指示灯 */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg" style={{animationDuration: '1.5s'}}></div>
          
          {/* 侧边指示灯 */}
          <div className="absolute top-4 left-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{animationDuration: '3s', animationDelay: '0.5s'}}></div>
          <div className="absolute top-4 right-1.5 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{animationDuration: '3s', animationDelay: '1.5s'}}></div>
          
          {/* 底部装饰 */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-blue-300 rounded opacity-60"></div>
        </div>
        
        {/* 手臂 */}
        <div className="absolute top-8 -left-2.5 w-2.5 h-6 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full shadow animate-pulse" style={{animationDuration: '2.5s', animationDelay: '0.3s'}}></div>
        <div className="absolute top-8 -right-2.5 w-2.5 h-6 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full shadow animate-pulse" style={{animationDuration: '2.5s', animationDelay: '1.3s'}}></div>
        
        {/* 腿部 */}
        <div className="absolute -bottom-1 left-3 w-2.5 h-4 bg-gradient-to-b from-blue-600 to-blue-700 rounded-b-full shadow"></div>
        <div className="absolute -bottom-1 right-3 w-2.5 h-4 bg-gradient-to-b from-blue-600 to-blue-700 rounded-b-full shadow"></div>
        
        {/* 阴影 */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-black opacity-20 rounded-full blur-sm"></div>
      </div>
    </div>
  )
}

interface CustomerServiceProps {
  onOpenChange?: (isOpen: boolean) => void
}

export function CustomerService({ onOpenChange }: CustomerServiceProps = {}) {
  const [showBubble, setShowBubble] = useState(false)
  
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  
  // 对话泡泡的消息列表
  const bubbleMessages = [
    "有问题请跟我对话！",
    "需要帮助吗？我在这里！",
    "遇到困难？点击我聊聊！",
    "我可以帮您解决问题！",
    "有疑问随时找我哦～"
  ]



  // 对话泡泡的自动弹出逻辑
  useEffect(() => {
    // 初始延迟3秒后开始第一次泡泡
    const initialTimeout = setTimeout(() => {
      setShowBubble(true)
      setTimeout(() => {
        setShowBubble(false)
      }, 3000)
    }, 3000)
    
    const bubbleInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        const newIndex = (prev + 1) % bubbleMessages.length
        return newIndex
      })
      setShowBubble(true)
      
      // 3秒后自动隐藏泡泡
      setTimeout(() => {
        setShowBubble(false)
      }, 3000)
    }, 5000) // 每5秒弹出一次

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(bubbleInterval)
    }
  }, [])



  const handleTelegramContact = () => {
    // 这里可以替换为实际的Telegram客服链接
    window.open("https://t.me/your_customer_service_bot", "_blank")
  }

  // 暴露打开客服的方法到全局
  useEffect(() => {
    // @ts-ignore
    window.openCustomerService = handleTelegramContact
    
    return () => {
      // @ts-ignore
      delete window.openCustomerService
    }
  }, [])

  return (
    <>
      {/* 浮动按钮组 */}
      <div className="fixed bottom-6 right-6 z-50 group">
        {/* 主客服按钮 */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer" onClick={handleTelegramContact}>
            <CuteRobot className="h-20 w-20" />
          </div>
          
          {/* 小红点提示 */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
            <span className="text-sm text-white font-bold">!</span>
          </div>
          
          {/* 对话泡泡 */}
          {showBubble && (
            <div className="absolute -top-20 -left-16 bg-white px-4 py-3 rounded-2xl shadow-xl text-sm text-gray-700 whitespace-nowrap animate-in slide-in-from-bottom-2 duration-300 border border-gray-200 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                {bubbleMessages[currentMessageIndex]}
              </div>
              {/* 尖角 */}
              <div className="absolute bottom-0 left-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-gray-200"></div>
            </div>
          )}
          
          {/* 悬停提示 */}
          <div className="absolute -top-16 -left-10 bg-gray-800 text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
            点击和我聊天！
            <div className="absolute bottom-0 left-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
          </div>
        </div>
      </div>


    </>
  )
}
