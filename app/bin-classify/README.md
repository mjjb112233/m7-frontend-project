# BIN分类页面目录结构

## 📁 新的目录结构

```
app/bin-classify/
├── page.tsx              # 主页面文件
├── types.ts              # 类型定义
├── hooks/                # 自定义Hooks
│   └── useBinClassify.ts # 分类状态管理
├── components/           # 功能组件目录
│   ├── index.ts          # 组件统一导出
│   ├── CardInput.tsx     # 卡片输入组件
│   ├── ClassificationConfig.tsx # 分类配置组件
│   ├── ProcessingStatus.tsx # 处理状态组件
│   ├── GroupedResults.tsx # 分组结果展示
│   └── CardInfoTable.tsx # 卡片信息表格
├── shared/               # 共享组件
│   ├── index.ts          # 共享组件导出
│   └── dialogs.tsx       # 对话框组件
└── utils/                # 工具函数
    ├── index.ts          # 工具函数导出
    ├── cardParser.ts     # 卡片解析工具
    └── classification.ts # 分类算法工具
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
| 输入 | `CardInput.tsx` | 卡片数据输入和验证 |
| 配置 | `ClassificationConfig.tsx` | 分类参数配置 |
| 处理 | `ProcessingStatus.tsx` | 处理进度显示 |
| 结果 | `GroupedResults.tsx` | 分组结果展示 |
| 表格 | `CardInfoTable.tsx` | 卡片信息表格展示 |

## 🚀 优势

1. **模块化**: 每个步骤独立管理
2. **清晰结构**: 按功能分类，便于定位
3. **易于维护**: 修改某个步骤不影响其他步骤
4. **可扩展性**: 新增步骤时只需创建对应目录
5. **类型安全**: 完整的TypeScript支持
