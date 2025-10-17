# CVV检测页面目录结构

## 📁 新的目录结构

```
app/cvv-check/
├── page.tsx              # 主页面文件
├── types.ts              # 类型定义
├── hooks/                # 自定义Hooks
│   ├── useCVVDetection.ts
│   └── useCVVAPI.ts
├── steps/                # 步骤组件目录
│   ├── index.ts          # 步骤统一导出
│   ├── config/           # 配置步骤
│   │   ├── index.tsx     # ConfigStep组件
│   │   └── index.ts      # 导出文件
│   ├── input/            # 输入步骤
│   │   ├── index.tsx     # InputStep组件
│   │   └── index.ts      # 导出文件
│   ├── precheck/         # 预检测步骤
│   │   ├── index.tsx     # PrecheckStep组件
│   │   └── index.ts      # 导出文件
│   ├── detecting/        # 检测步骤
│   │   ├── index.tsx     # DetectingStep组件
│   │   └── index.ts      # 导出文件
│   ├── results/          # 结果步骤
│   │   ├── index.tsx     # ResultsStep组件
│   │   └── index.ts      # 导出文件
│   └── prompts/          # 提示步骤
│       ├── index.tsx     # PromptSteps组件
│       └── index.ts      # 导出文件
├── shared/               # 共享组件
│   ├── index.ts          # 共享组件导出
│   ├── dialogs.tsx       # 对话框组件
│   └── StepIndicator.tsx # 步骤指示器
└── components/           # 旧组件目录（已清理）
    ├── index.ts
    └── README.md
```

## 🎯 设计原则

### 1. **按步骤分类**
- 每个检测步骤有独立的目录
- 便于维护和扩展
- 清晰的职责分离

### 2. **共享组件分离**
- 跨步骤使用的组件放在 `shared/` 目录
- 如对话框、步骤指示器等

### 3. **统一导出管理**
- 每个目录都有 `index.ts` 导出文件
- 便于管理和导入

## 📝 使用方式

### 导入步骤组件
```typescript
import { 
  InputStep,
  PrecheckStep,
  DetectingStep,
  ResultsStep,
  DetectingPrompt,
  CompletedPrompt
} from "./steps"
```

### 导入共享组件
```typescript
import { 
  StatusAlert,
  ErrorAlert,
  StepIndicator
} from "./shared"
```

### 导入特定步骤
```typescript
import { InputStep } from "./steps/input"
import { PrecheckStep } from "./steps/precheck"
```

## 🔧 各步骤说明

| 步骤 | 目录 | 组件 | 职责 |
|------|------|------|------|
| 配置 | `steps/config/` | ConfigStepV2 | 检测模式、通道选择 |
| 输入 | `steps/input/` | InputStep | CVV列表输入 |
| 预检测 | `steps/precheck/` | PrecheckStep | 格式验证结果 |
| 检测中 | `steps/detecting/` | DetectingStep | 实时检测进度 |
| 结果 | `steps/results/` | ResultsStep | 最终检测结果 |
| 提示 | `steps/prompts/` | PromptSteps | 状态提示页面 |

## 🚀 优势

1. **模块化**: 每个步骤独立管理
2. **清晰结构**: 按功能分类，便于定位
3. **易于维护**: 修改某个步骤不影响其他步骤
4. **可扩展性**: 新增步骤时只需创建对应目录
5. **类型安全**: 完整的TypeScript支持

## 📋 迁移指南

### 旧结构 → 新结构
```typescript
// 旧方式
import { ConfigStep } from "./components/ConfigStep"

// 新方式
import { ConfigStepV2 } from "./steps/config/ConfigStepV2"
```

### 新增步骤
1. 在 `steps/` 下创建新目录
2. 创建 `index.tsx` 组件文件
3. 创建 `index.ts` 导出文件
4. 在 `steps/index.ts` 中添加导出
5. 在页面中使用新组件

## 🎉 重构成果

- ✅ 按步骤分类组织组件
- ✅ 共享组件独立管理
- ✅ 统一导出管理
- ✅ 清晰的目录结构
- ✅ 保持向后兼容
- ✅ 构建验证通过
