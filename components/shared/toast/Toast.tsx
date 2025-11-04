import React, { useEffect } from 'react'
import { Check, X } from 'lucide-react'

export interface ToastProps {
  message: string
  type?: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 left-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border ${
        type === 'success' 
          ? 'bg-green-50/90 border-green-200 text-green-800' 
          : 'bg-red-50/90 border-red-200 text-red-800'
      }`}>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {type === 'success' ? (
            <Check className="w-3 h-3 text-white" />
          ) : (
            <X className="w-3 h-3 text-white" />
          )}
        </div>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className={`ml-2 p-1 rounded-full hover:bg-white/50 transition-colors ${
            type === 'success' ? 'hover:bg-green-100' : 'hover:bg-red-100'
          }`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

