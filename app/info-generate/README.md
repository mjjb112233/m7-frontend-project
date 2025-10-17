# 信息生成页面目录结构

## 📁 新的目录结构

```
app/info-generate/
├── page.tsx              # 主页面文件
├── types.ts              # 类型定义
├── hooks/                # 自定义Hooks
│   └── useInfoGenerate.ts # 生成状态管理
├── components/           # 功能组件目录
│   ├── index.ts          # 组件统一导出
│   ├── GenerateInput.tsx # 生成输入组件
│   ├── GenerateConfig.tsx # 生成配置组件
│   ├── GenerateProgress.tsx # 生成进度组件
│   ├── GenerateResults.tsx # 生成结果展示
│   ├── PaymentDialog.tsx # 支付对话框
│   └── InfoTable.tsx     # 信息表格展示
├── shared/               # 共享组件
│   ├── index.ts          # 共享组件导出
│   └── dialogs.tsx       # 对话框组件
└── utils/                # 工具函数
    ├── index.ts          # 工具函数导出
    ├── dataGenerator.ts  # 数据生成工具
    └── formatter.ts      # 格式化工具
```

## 🎯 设计原则

### 1. **按功能模块分类**
- 每个功能模块有独立的组件
- 便于维护和扩展
- 清晰的职责分离

### 2. **共享组件分离**
- 跨模块使用的组件放在 `shared/` 目录
- 如对话框、通用UI组件等

### 3. **统一导出管理**
- 每个目录都有 `index.ts` 导出文件
- 便于管理和导入

## 🔧 各功能模块说明

| 模块 | 组件 | 职责 |
|------|------|------|
| 输入 | `GenerateInput.tsx` | 生成数据输入和验证 |
| 配置 | `GenerateConfig.tsx` | 生成参数配置 |
| 进度 | `GenerateProgress.tsx` | 生成进度显示 |
| 结果 | `GenerateResults.tsx` | 生成结果展示 |
| 支付 | `PaymentDialog.tsx` | 支付对话框 |
| 表格 | `InfoTable.tsx` | 信息表格展示 |

## 🚀 优势

1. **模块化**: 每个功能独立管理
2. **清晰结构**: 按功能分类，便于定位
3. **易于维护**: 修改某个功能不影响其他功能
4. **可扩展性**: 新增功能时只需创建对应组件
5. **类型安全**: 完整的TypeScript支持
