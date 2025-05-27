# 工具页面重构指南

## 已完成的模块化组件

### 1. 通用布局组件
- `ToolLayout` - 工具页面统一布局
- `DualTextarea` - 双栏输入输出组件
- `ToolActions` - 工具操作按钮组件

### 2. 通用 Hook
- `useToolState` - 工具状态管理

### 3. 工具函数库
- `jsonUtils` - JSON 处理
- `base64Utils` - Base64 编码解码
- `urlUtils` - URL 编码解码
- `textUtils` - 文本处理
- `exampleData` - 示例数据生成

## 重构模板

### 基础工具页面模板

```tsx
'use client';

import React from 'react';
import { IconName } from 'lucide-react';
import { ToolLayout } from '@/components/layouts/tool-layout';
import { DualTextarea } from '@/components/ui/dual-textarea';
import { ToolActions } from '@/components/ui/tool-actions';
import { useToolState } from '@/hooks/use-tool-state';
import { toolUtils } from '@/lib/tool-utils';

export default function ToolPage() {
  const [{ input, output, error }, { setInput, setOutput, setError, clearAll }] = useToolState();

  const processFunction = () => {
    const result = toolUtils.process(input);
    if (result.success) {
      setOutput(result.data!);
      setError('');
    } else {
      setError(result.error!);
      setOutput('');
    }
  };

  const actions = [
    {
      label: '处理',
      onClick: processFunction,
      icon: IconName,
    },
    // ... 其他操作
  ];

  const helpContent = (
    <div className="space-y-4">
      {/* 帮助内容 */}
    </div>
  );

  return (
    <ToolLayout
      title="工具标题"
      description="工具描述"
      icon={IconName}
      actions={<ToolActions actions={actions} />}
      helpContent={helpContent}
      path="/tools/tool-name"
    >
      <DualTextarea
        inputTitle="输入标题"
        outputTitle="输出标题"
        inputPlaceholder="输入提示..."
        outputPlaceholder="输出提示..."
        inputValue={input}
        outputValue={output}
        onInputChange={setInput}
        error={error}
      />
    </ToolLayout>
  );
}
```

## 已重构的工具页面

### 1. JSON 格式化工具 ✅
- 路径：`/tools/json-formatter`
- 功能：格式化、压缩、验证 JSON
- 使用组件：ToolLayout, DualTextarea, ToolActions
- 使用工具函数：jsonUtils

### 2. Base64 编码工具 ✅
- 路径：`/tools/base64-simple`
- 功能：Base64 编码解码
- 使用组件：ToolLayout, DualTextarea, ToolActions
- 使用工具函数：base64Utils

### 3. URL 编码工具 ✅
- 路径：`/tools/url-encoder`
- 功能：URL 编码解码
- 使用组件：ToolLayout, DualTextarea, ToolActions
- 使用工具函数：urlUtils

### 4. 文本处理工具 ✅
- 路径：`/tools/text-processor`
- 功能：大小写转换、字符统计等
- 使用组件：ToolLayout, DualTextarea, ToolActions
- 使用工具函数：textUtils

## 待重构的工具页面

### 需要重构的页面列表
1. `/tools/base64-encoder` - 复杂的多功能编码器（可保留或简化）
2. `/tools/color-picker` - 颜色选择器
3. `/tools/qr-generator` - 二维码生成器
4. `/tools/password-generator` - 密码生成器
5. 其他工具页面...

## 重构步骤

### 1. 分析现有工具
- 确定工具的核心功能
- 识别可复用的处理逻辑
- 评估是否需要特殊的 UI 组件

### 2. 添加工具函数
如果需要新的处理函数，在 `src/lib/tool-utils.ts` 中添加：

```typescript
export const newToolUtils = {
  process: (input: string): ProcessResult => {
    try {
      // 处理逻辑
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: '处理失败' };
    }
  },
};
```

### 3. 重构页面组件
- 使用 `useToolState` 管理状态
- 使用 `ToolLayout` 作为页面布局
- 使用 `DualTextarea` 或自定义 UI 组件
- 使用 `ToolActions` 管理操作按钮

### 4. 添加评论功能
确保每个工具页面都包含评论功能：
```tsx
path="/tools/tool-name"  // 在 ToolLayout 中设置
```

## 优势

### 代码复用
- 减少重复代码 60%+
- 统一的 UI 风格
- 一致的用户体验

### 维护性
- 集中的状态管理
- 统一的错误处理
- 模块化的功能组件

### 扩展性
- 易于添加新工具
- 可复用的处理函数
- 灵活的组件组合

## 注意事项

1. **保持向后兼容**：重构时确保现有功能不受影响
2. **渐进式重构**：可以逐步重构，不需要一次性完成
3. **特殊需求**：某些工具可能需要特殊的 UI 组件，可以灵活处理
4. **性能考虑**：对于复杂的处理逻辑，考虑使用 Web Workers
5. **用户体验**：保持加载状态、错误提示等用户反馈
