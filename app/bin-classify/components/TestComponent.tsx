import React from "react"

export function TestComponent() {
  return (
    <div className="bg-yellow-300 p-8 text-center">
      <h1 className="text-3xl font-bold text-red-600">
        测试组件 - {new Date().toLocaleString()}
      </h1>
      <p className="text-lg mt-4">如果你看到这个，说明文件更新正常工作</p>
    </div>
  )
}