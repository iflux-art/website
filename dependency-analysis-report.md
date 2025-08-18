# 代码依赖关系分析报告

## 分析概述

本报告基于对源代码的全面扫描，分析了当前的导入导出关系，识别了跨功能模块使用的共享代码，并制定了详细的文件移动映射表和路径更新计划。

## 当前代码组织结构分析

### 共享目录现状

- `src/types/`: 已有基础类型、数据类型、元数据类型
- `src/lib/`: 已有工具函数、样式工具、元数据生成函数
- `src/hooks/`: 已有缓存 hook 和部分功能 hooks
- `src/components/`: 已有 UI 组件库、MDX 组件、主题提供者

### 功能模块现状

- `src/features/`: 包含 11 个功能模块，结构完整度不一
- 部分模块已有完整的 types/lib/hooks/components 子目录结构
- 部分模块缺少统一的导出文件

## 跨功能模块依赖关系分析

### 1. 类型定义跨功能使用

#### 需要提升到共享目录的类型

```typescript
// 当前位置 -> 目标位置
@/features/content/types/BreadcrumbItem -> @/types/content-types.ts
@/features/docs/types/Heading -> @/types/content-types.ts
```

**使用情况分析:**

- `BreadcrumbItem`: 被 blog 和 docs 功能模块使用
  - `src/features/blog/lib/index.ts` (导入)
  - `src/features/docs/lib/index.ts` (导入)
- `Heading`: 被 content 功能模块使用
  - `src/features/content/hooks/use-heading-observer.ts` (导入)

### 2. 工具函数跨功能使用

#### 需要提升到共享目录的工具函数

```typescript
// 当前位置 -> 目标位置
@/features/website-parser/* -> @/lib/website-parser.ts (如果被多处使用)
```

**使用情况分析:**

- `website-parser`: 被 links 功能模块使用
  - `src/features/links/components/links/links-form.tsx` (导入)
  - `src/lib/index.ts` (已有兼容性导出)

### 3. Hooks 跨功能使用

#### 需要提升到共享目录的 hooks

```typescript
// 当前位置 -> 目标位置
@/features/content/hooks/use-content-data -> @/hooks/use-content-data.ts (已提升)
```

**使用情况分析:**

- `use-content-data`: 被多个功能模块使用
  - `src/features/blog/hooks/index.ts` (导入)
  - `src/features/docs/hooks/index.ts` (导入)
  - `src/hooks/index.ts` (已有导出)

### 4. 组件跨功能使用

#### 布局组件使用情况

```typescript
// 广泛使用的布局组件
@/features/layout/app-grid -> 被 app 页面使用
@/features/layout/navbar/* -> 被 app layout 使用
@/features/layout/footer -> 被 app layout 使用
@/features/layout/sidebar -> 被 links 功能使用
```

## 文件移动映射表

### 阶段 1: 提升共享类型定义

| 源文件                                      | 目标文件                     | 影响的导入文件                                                       |
| ------------------------------------------- | ---------------------------- | -------------------------------------------------------------------- |
| `src/features/content/types/BreadcrumbItem` | `src/types/content-types.ts` | `src/features/blog/lib/index.ts`<br>`src/features/docs/lib/index.ts` |
| `src/features/docs/types/Heading`           | `src/types/content-types.ts` | `src/features/content/hooks/use-heading-observer.ts`                 |

### 阶段 2: 提升共享工具函数

| 源文件                          | 目标文件                    | 影响的导入文件                                                             |
| ------------------------------- | --------------------------- | -------------------------------------------------------------------------- |
| `src/features/website-parser/*` | `src/lib/website-parser.ts` | `src/features/links/components/links/links-form.tsx`<br>`src/lib/index.ts` |

### 阶段 3: 整理功能模块内部结构

| 功能模块  | 当前状态                   | 需要的操作                                |
| --------- | -------------------------- | ----------------------------------------- |
| `auth`    | 有 components, 有 index.ts | 需要创建 types, lib, hooks 子目录         |
| `admin`   | 有 components, hooks       | 需要创建 types, lib 子目录                |
| `comment` | 有 components, 有 index.ts | 需要创建 types, lib, hooks 子目录         |
| `home`    | 有 components, hooks       | 需要创建 types, lib 子目录，创建 index.ts |
| `layout`  | 结构完整                   | 需要整理子目录结构                        |

## 路径更新计划

### 1. 类型定义路径更新

#### BreadcrumbItem 类型更新

```typescript
// 需要更新的文件:
// src/features/blog/lib/index.ts
- import type { BreadcrumbItem } from "@/features/content/types";
+ import type { BreadcrumbItem } from "@/types/content-types";

// src/features/docs/lib/index.ts
- import type { BreadcrumbItem } from "@/features/content/types";
+ import type { BreadcrumbItem } from "@/types/content-types";
```

#### Heading 类型更新

```typescript
// 需要更新的文件:
// src/features/content/hooks/use-heading-observer.ts
- import type { Heading } from "@/features/docs/types";
+ import type { Heading } from "@/types/content-types";
```

### 2. 工具函数路径更新

#### website-parser 路径更新

```typescript
// 需要更新的文件:
// src/features/links/components/links/links-form.tsx
- import { isValidUrl, useWebsiteParser } from "@/features/website-parser";
+ import { isValidUrl, useWebsiteParser } from "@/lib/website-parser";

// src/lib/index.ts
- export * from "@/features/website-parser";
+ export * from "@/lib/website-parser";
```

### 3. 统一导出文件更新

#### 共享目录导出更新

```typescript
// src/types/index.ts
+ export * from "./content-types"; // 新增

// src/lib/index.ts
- export * from "@/features/website-parser";
+ export * from "@/lib/website-parser";

// src/hooks/index.ts (已有正确导出)
// src/components/index.ts (已有正确导出)
```

#### 功能模块导出创建

```typescript
// 需要创建的 index.ts 文件:
// src/features/home/index.ts
// src/features/admin/index.ts (如果需要)
// src/features/layout/index.ts (如果需要)
```

## 验证检查点

### 编译时验证

1. TypeScript 编译检查 - 确保所有类型引用正确
2. ESLint 检查 - 确保代码风格符合规范
3. 构建验证 - 确保应用能够成功构建

### 运行时验证

1. 页面渲染测试 - 确保所有页面正常显示
2. 功能交互测试 - 确保所有功能正常工作
3. 导入路径测试 - 确保所有导入路径正确解析

## 风险评估

### 高风险操作

1. 移动被多处引用的类型定义
2. 更新跨功能模块的导入路径
3. 重构功能模块内部结构

### 风险缓解措施

1. 分阶段执行，每阶段完成后立即验证
2. 保持代码备份，出现问题时快速回滚
3. 使用自动化工具进行路径替换，减少人为错误

## 实施建议

### 执行顺序

1. 先处理独立性强的类型定义移动
2. 再处理工具函数的移动和路径更新
3. 最后整理功能模块内部结构

### 验证策略

1. 每个文件移动后立即进行编译检查
2. 每个阶段完成后进行功能测试
3. 全部完成后进行全面的回归测试

## 总结

通过本次分析，识别出了需要重构的关键依赖关系和文件移动计划。主要工作集中在：

1. 提升 2 个跨功能使用的类型定义到共享目录
2. 评估 website-parser 工具函数的提升必要性
3. 整理 5 个功能模块的内部结构
4. 更新相关的导入路径和导出文件

整个重构过程预计影响约 20+ 个文件，需要谨慎执行并充分验证。
