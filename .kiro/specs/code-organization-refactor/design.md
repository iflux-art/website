# 代码组织重构设计文档

## 概述

本设计文档描述了如何重构现有代码库的组织结构，将共享代码和特定功能代码进行清晰分离。重构的目标是提高代码的可维护性、可重用性和可扩展性，同时保持现有功能的完整性。

## 架构

### 当前架构分析

通过代码分析，发现当前架构存在以下特点：

- `src/types`、`src/lib`、`src/hooks`、`src/components` 已经有基本的共享代码组织
- `src/features` 下的各个功能模块已经有一定的内部组织结构
- 存在跨功能模块的依赖关系，需要仔细处理
- 部分功能模块已经有完整的 types/lib/hooks/components 子目录结构

### 目标架构

```
src/
├── types/           # 全局共享类型
│   ├── base-types.ts
│   ├── data-types.ts
│   ├── metadata-types.ts
│   └── index.ts
├── lib/             # 全局共享工具函数
│   ├── helpers.ts
│   ├── utils.ts
│   ├── metadata.ts
│   └── index.ts
├── hooks/           # 全局共享 hooks
│   ├── use-cache.ts
│   └── index.ts
├── components/      # 全局共享组件
│   ├── ui/          # UI 组件库
│   ├── mdx/         # MDX 组件
│   ├── theme-provider.tsx
│   └── index.ts
└── features/        # 功能模块
    ├── {feature}/
    │   ├── types/   # 功能特定类型
    │   ├── lib/     # 功能特定工具函数
    │   ├── hooks/   # 功能特定 hooks
    │   ├── components/ # 功能特定组件
    │   └── index.ts # 功能统一导出
    └── ...
```

## 组件和接口

### 代码分类策略

#### 共享代码识别规则

1. **类型定义**：被多个功能模块使用的类型定义
2. **工具函数**：通用的辅助函数，如格式化、验证等
3. **Hooks**：跨功能使用的状态管理和副作用逻辑
4. **组件**：UI 组件库、通用布局组件等

#### 功能特定代码识别规则

1. **类型定义**：仅在单个功能模块内使用的类型
2. **工具函数**：特定业务逻辑的辅助函数
3. **Hooks**：功能特定的状态管理和业务逻辑
4. **组件**：功能特定的业务组件

### 依赖关系处理

#### 跨功能依赖分析

基于代码分析，发现以下主要跨功能依赖：

1. `@/features/content/types` 被多个功能模块使用（blog, docs）
2. `@/features/layout` 组件被多个页面使用
3. `@/features/website-parser` 被 links 功能使用
4. UI 组件库被所有功能模块广泛使用

#### 依赖处理策略

1. **提升共享依赖**：将被多个功能使用的代码提升到共享目录
2. **保持功能边界**：功能特定的代码保持在功能目录内
3. **创建适配层**：对于复杂的跨功能依赖，创建适配接口

## 数据模型

### 文件移动映射

#### 需要提升到共享目录的代码

```typescript
// 类型定义
@/features/content/types/BreadcrumbItem -> @/types/content-types.ts
@/features/docs/types/Heading -> @/types/content-types.ts

// 工具函数
@/features/website-parser/lib -> @/lib/website-parser.ts (如果被多处使用)

// Hooks
@/features/content/hooks/use-content-data -> @/hooks/use-content-data.ts (如果被多处使用)
```

#### 保持在功能目录的代码

```typescript
// 功能特定的类型、工具函数、hooks、组件保持在各自的功能目录内
@/features/blog/types/* -> 保持不变
@/features/admin/components/* -> 保持不变
@/features/search/lib/* -> 保持不变
```

### 导出模式标准化

#### 共享目录导出模式

```typescript
// src/types/index.ts
export * from "./base-types";
export * from "./data-types";
export * from "./metadata-types";
export * from "./content-types"; // 新增

// src/lib/index.ts
export * from "./helpers";
export * from "./utils";
export * from "./metadata";
export * from "./website-parser"; // 如果提升

// src/hooks/index.ts
export * from "./use-cache";
export * from "./use-content-data"; // 如果提升

// src/components/index.ts
export * from "./ui";
export * from "./mdx";
export * from "./theme-provider";
```

#### 功能目录导出模式

```typescript
// src/features/{feature}/index.ts
export * from "./types";
export * from "./lib";
export * from "./hooks";
export * from "./components";
```

## 错误处理

### 导入路径更新策略

#### 自动化路径更新

1. **扫描阶段**：识别所有需要更新的导入语句
2. **映射阶段**：创建旧路径到新路径的映射表
3. **替换阶段**：批量替换所有导入路径
4. **验证阶段**：确保所有路径更新正确

#### 错误预防措施

1. **备份机制**：在开始重构前创建代码备份
2. **增量验证**：每次移动文件后立即验证编译状态
3. **回滚策略**：如果出现问题，能够快速回滚到之前状态

### 编译错误处理

#### 常见错误类型

1. **路径错误**：导入路径不正确
2. **循环依赖**：重构后可能产生的循环引用
3. **类型错误**：类型定义移动后的引用问题

#### 解决策略

1. **分步验证**：每个步骤完成后都进行 TypeScript 编译检查
2. **依赖图分析**：在移动代码前分析依赖关系，避免循环依赖
3. **渐进式重构**：先移动独立的代码，再处理有依赖关系的代码

## 测试策略

### 重构验证方法

#### 编译时验证

1. **TypeScript 编译**：确保所有类型检查通过
2. **ESLint 检查**：确保代码风格和规范符合要求
3. **构建验证**：确保应用能够成功构建

#### 运行时验证

1. **功能测试**：验证所有现有功能正常工作
2. **导入测试**：验证所有导入路径正确解析
3. **端到端测试**：确保用户界面和交互正常

### 测试执行计划

#### 阶段性测试

1. **移动前测试**：记录当前的测试基准
2. **移动后测试**：每次文件移动后立即测试
3. **完成后测试**：整个重构完成后的全面测试

#### 自动化测试集成

1. **持续集成**：在 CI/CD 流程中集成编译和测试检查
2. **回归测试**：确保重构不会破坏现有功能
3. **性能测试**：确保重构不会影响应用性能

## 实施计划

### 重构执行顺序

#### 第一阶段：分析和准备

1. 分析现有代码依赖关系
2. 识别需要移动的文件和代码
3. 创建详细的移动计划

#### 第二阶段：共享代码提升

1. 移动被多个功能使用的类型定义
2. 移动通用工具函数
3. 移动共享 hooks
4. 更新相关导入路径

#### 第三阶段：功能代码整理

1. 整理各功能模块内部结构
2. 创建功能级别的统一导出
3. 更新功能内部的导入路径

#### 第四阶段：验证和优化

1. 全面测试所有功能
2. 优化导入路径和导出结构
3. 更新文档和注释

### 风险控制措施

#### 技术风险

1. **代码备份**：在开始前创建完整备份
2. **分支管理**：在独立分支进行重构工作
3. **增量提交**：每个阶段完成后提交代码

#### 业务风险

1. **功能验证**：确保所有业务功能正常
2. **性能监控**：监控重构对性能的影响
3. **用户体验**：确保用户界面和交互不受影响
