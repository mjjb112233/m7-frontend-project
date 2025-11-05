/**
 * 全局维护状态管理器
 * 提供全局的维护状态管理，不依赖React Context
 */

import type { MaintenanceData } from '@/types/api.types'

interface MaintenanceState {
  isOpen: boolean
  announcement?: string
  endTime?: number
}

type StateChangeCallback = (state: MaintenanceState) => void

class MaintenanceManager {
  private state: MaintenanceState = {
    isOpen: false,
  }

  private listeners: Set<StateChangeCallback> = new Set()

  /**
   * 打开维护对话框
   */
  openMaintenanceDialog(data?: MaintenanceData): void {
    this.state = {
      isOpen: true,
      announcement: data?.announcement,
      endTime: data?.endTime,
    }
    this.notifyListeners()
  }

  /**
   * 关闭维护对话框
   */
  closeMaintenanceDialog(): void {
    this.state = {
      isOpen: false,
      announcement: undefined,
      endTime: undefined,
    }
    this.notifyListeners()
  }

  /**
   * 获取当前状态
   */
  getState(): MaintenanceState {
    return { ...this.state }
  }

  /**
   * 获取维护数据
   */
  getMaintenanceData(): MaintenanceData | undefined {
    if (!this.state.isOpen) {
      return undefined
    }
    return {
      announcement: this.state.announcement,
      endTime: this.state.endTime,
    }
  }

  /**
   * 订阅状态变化
   */
  subscribe(callback: StateChangeCallback): () => void {
    this.listeners.add(callback)
    // 立即调用一次，同步当前状态
    callback(this.getState())
    
    // 返回取消订阅函数
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * 通知所有监听者
   */
  private notifyListeners(): void {
    const state = this.getState()
    this.listeners.forEach((callback) => {
      try {
        callback(state)
      } catch (error) {
        console.error('维护状态监听器错误:', error)
      }
    })
  }
}

// 导出单例
export const maintenanceManager = new MaintenanceManager()

