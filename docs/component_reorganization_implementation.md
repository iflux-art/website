# 组件重组实施指南

本文档提供了组件重组的具体实施步骤和示例代码，帮助您按照计划重组组件结构。

## 实施步骤概览

1. 创建新的目录结构
2. 处理重复组件
3. 重新组织组件目录
4. 更新导入路径
5. 测试验证

## 详细实施步骤

### 1. 创建新的目录结构

首先，创建新的目录结构，但暂时不移动或修改任何文件：

```bash
# 在项目根目录执行
mkdir -p src/components/common
mkdir -p src/components/content/blog
mkdir -p src/components/content/docs
```

### 2. 处理重复组件

#### 2.1 合并 layout/page-layout 组件

保留功能更完整的 `layout/page-layout.tsx` 版本，删除 `layout/page-layout/` 目录：

```bash
# 确认保留的文件内容正确
rm -rf src/components/layout/page-layout/
```

`page-layout.tsx` 应保留以下内容：

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  id?: string;
  pageTitle?: string;
};

/**
 * 页面布局组件
 * 提供统一的页面容器和动画效果
 */
export function PageLayout({
  children,
  className = "",
  animate = true,
  id,
  pageTitle,
}: PageLayoutProps) {
  const Container = animate ? motion.main : "main";
  
  return (
    <Container
      id={id}
      className={`container mx-auto px-4 py-6 md:py-8 flex-grow min-h-[calc(100vh-10rem)] ${className}`}
      initial={animate ? "initial" : undefined}
      animate={animate ? "animate" : undefined}
      exit={animate ? "exit" : undefined}
      variants={animate ? pageTransition : undefined}
    >
      {pageTitle && (
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">{pageTitle}</h1>
      )}
      {children}
    </Container>
  );
}
```

#### 2.2 合并 features/search 组件

保留 `features/search/` 目录下的实现，删除重复文件：

```bash
rm src/components/features/search.tsx
rm src/components/features/search-dialog.tsx
```

#### 2.3 合并 features/language-toggle 组件

保留 `features/language-toggle/` 目录下的实现，删除重复文件：

```bash
rm src/components/features/language-toggle.tsx
```

#### 2.4 合并 features/theme-toggle 组件

保留 `features/theme-toggle/` 目录下的实现，删除重复文件：

```bash
rm src/components/features/theme-toggle.tsx
```

### 3. 重新组织组件目录

#### 3.1 移动博客相关组件到 content/blog/ 目录

```bash
# 移动博客相关组件
mv src/components/blog/* src/components/content/blog/
rmdir src/components/blog
```

#### 3.2 移动文档相关组件到 content/docs/ 目录

```bash
# 移动文档相关组件
mv src/components/docs/* src/components/content/docs/
rmdir src/components/docs
```

#### 3.3 确保每个组件目录结构统一

对于每个组件，确保它有自己的目录和统一的导出模式：

```tsx
// 示例: src/components/content/blog/post-card/index.tsx
export { PostCard } from './post-card';

// 示例: src/components/content/blog/post-card/post-card.tsx
// 组件实现...
```

### 4. 更新导入路径

在整个项目中搜索并更新组件的导入路径。以下是一些需要更新的导入路径示例：

#### 4.1 更新博客组件导入路径

```tsx
// 旧路径
import { PostCard } from '@/components/blog/post-card';

// 新路径
import { PostCard } from '@/components/content/blog/post-card';
```

#### 4.2 更新文档组件导入路径

```tsx
// 旧路径
import { Sidebar } from '@/components/docs/sidebar';

// 新路径
import { Sidebar } from '@/components/content/docs/sidebar';
```

### 5. 测试验证

在每个主要步骤后运行项目，确保功能正常：

```bash
pnpm dev
```

## 实施建议

1. **分阶段实施**：每完成一个小步骤就提交代码，方便回滚
2. **保持API兼容性**：确保组件接口不变，避免破坏现有功能
3. **使用IDE重构功能**：利用IDE的重命名和移动功能自动更新导入路径
4. **创建备份**：在开始重组前，创建代码备份或确保有干净的Git工作区
5. **编写测试**：如果有测试，确保重组后所有测试通过

## 重组后的目录结构

完成重组后，组件目录结构应如下所示：

```
src/components/
├── common/           # 通用组件
├── layout/           # 布局组件
│   ├── footer/
│   ├── navbar/
│   └── page-layout.tsx
├── features/         # 功能组件
│   ├── language-toggle/
│   ├── search/
│   ├── theme-toggle/
│   └── travelling/
├── content/          # 内容展示组件
│   ├── blog/         # 博客相关组件
│   │   ├── post-card/
│   │   ├── author-card/
│   │   └── toc/
│   └── docs/         # 文档相关组件
│       ├── sidebar/
│       └── toc/
└── ui/              # 基础UI组件
```

## 后续工作

1. 更新项目文档，反映新的组件结构
2. 考虑为组件添加更详细的文档和使用示例
3. 检查组件的可复用性，进一步优化组件设计