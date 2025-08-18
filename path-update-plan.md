# 路径更新执行计划

## 概述

本文档详细描述了代码重构过程中需要执行的路径更新操作，包括具体的文件修改、导入路径替换和验证步骤。

## 阶段 1: 共享类型定义迁移

### 1.1 创建新的类型文件

**目标文件**: `src/types/content-types.ts`

```typescript
/**
 * 内容相关类型定义
 * 从功能模块中提升的共享类型
 */

/** 面包屑导航项 */
export interface BreadcrumbItem {
  /** 显示的标签文本 */
  label: string;
  /** 链接地址，如果不提供则显示为纯文本 */
  href?: string;
}

/** 文档标题结构 */
export interface Heading {
  level: number;
  text: string;
  id: string;
}
```

### 1.2 更新类型导出文件

**文件**: `src/types/index.ts`
**操作**: 在文件末尾添加

```typescript
// ==================== 内容类型 ====================
export * from "./content-types";
```

### 1.3 更新导入路径

#### 文件 1: `src/features/blog/lib/index.ts`

**第 10 行**:

```typescript
// 修改前
import type { BreadcrumbItem } from "@/features/content/types";

// 修改后
import type { BreadcrumbItem } from "@/types/content-types";
```

#### 文件 2: `src/features/docs/lib/index.ts`

**第 10 行**:

```typescript
// 修改前
import type { BreadcrumbItem } from "@/features/content/types";

// 修改后
import type { BreadcrumbItem } from "@/types/content-types";
```

#### 文件 3: `src/features/content/hooks/use-heading-observer.ts`

**第 2 行**:

```typescript
// 修改前
import type { Heading } from "@/features/docs/types";

// 修改后
import type { Heading } from "@/types/content-types";
```

### 1.4 阶段验证

```bash
# TypeScript 编译检查
npx tsc --noEmit

# 确保没有类型错误
npm run type-check
```

## 阶段 2: 共享工具函数迁移

### 2.1 评估 website-parser 迁移

**当前状态分析**:

- 位置: `src/features/website-parser/`
- 使用者: `src/features/links/components/links/links-form.tsx`
- 已有导出: `src/lib/index.ts` 中已有兼容性导出

**决策**: 由于已在 lib/index.ts 中导出，表明这是共享功能，应该迁移

### 2.2 创建新的工具函数文件

**目标文件**: `src/lib/website-parser.ts`

```typescript
/**
 * 网站解析工具函数
 * 从 website-parser 功能模块迁移的共享工具
 */

// 重新导出所有 website-parser 功能
export * from "../features/website-parser/types";
export * from "../features/website-parser/lib/parser";
export * from "../features/website-parser/lib/validation";
export * from "../features/website-parser/lib/utils";
export * from "../features/website-parser/hooks/use-website-parser";
```

### 2.3 更新导入路径

#### 文件 1: `src/features/links/components/links/links-form.tsx`

**第 34 行**:

```typescript
// 修改前
import { isValidUrl, useWebsiteParser } from "@/features/website-parser";

// 修改后
import { isValidUrl, useWebsiteParser } from "@/lib/website-parser";
```

#### 文件 2: `src/lib/index.ts`

**第 13 行**:

```typescript
// 修改前
export * from "@/features/website-parser";

// 修改后
export * from "@/lib/website-parser";
```

### 2.4 阶段验证

```bash
# 构建测试
npm run build

# 功能测试 - 特别关注链接表单的网站解析功能
npm run dev
# 手动测试: 访问 /links 页面，测试添加链接时的网站解析功能
```

## 阶段 3: 功能模块内部结构整理

### 3.1 auth 功能模块标准化

**当前结构**: `components/`, `index.ts`
**需要创建**:

- `src/features/auth/types/` (如有需要)
- `src/features/auth/lib/` (如有需要)
- `src/features/auth/hooks/` (如有需要)

### 3.2 admin 功能模块标准化

**当前结构**: `components/`, `hooks/`
**需要创建**:

- `src/features/admin/types/` (如有需要)
- `src/features/admin/lib/` (如有需要)
- `src/features/admin/index.ts`

### 3.3 comment 功能模块标准化

**当前结构**: `components/`, `index.ts`
**需要创建**:

- `src/features/comment/types/` (如有需要)
- `src/features/comment/lib/` (如有需要)
- `src/features/comment/hooks/` (如有需要)

### 3.4 home 功能模块标准化

**当前结构**: `components/`, `hooks/`
**需要创建**:

- `src/features/home/types/` (如有需要)
- `src/features/home/lib/` (如有需要)
- `src/features/home/index.ts`

**创建统一导出文件**:

```typescript
// src/features/home/index.ts
/**
 * 首页功能模块统一导出
 */

export * from "./components";
export * from "./hooks";
// export * from "./types"; // 如果创建了 types 目录
// export * from "./lib";   // 如果创建了 lib 目录
```

### 3.5 layout 功能模块整理

**当前结构**: `navbar/`, `app-grid.tsx`, `footer.tsx`, `sidebar.tsx`
**整理方案**:

- 保持当前结构，因为已经有良好的组织
- 如有需要可创建 `types/`, `lib/` 子目录

### 3.6 阶段验证

```bash
# 完整构建测试
npm run build

# 所有页面渲染测试
npm run dev
# 手动测试所有主要页面: /, /blog, /docs, /links, /friends, /profile
```

## 阶段 4: 应用层导入路径更新

### 4.1 app 目录页面组件导入检查

需要检查的文件:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/*/page.tsx` (各个页面)

### 4.2 确保导入路径正确性

检查是否有需要更新的导入路径，特别是:

- 从功能模块导入的组件
- 从共享目录导入的类型和工具函数

## 最终验证清单

### 编译时验证

- [ ] TypeScript 编译无错误: `npx tsc --noEmit`
- [ ] ESLint 检查通过: `npm run lint`
- [ ] 构建成功: `npm run build`

### 运行时验证

- [ ] 首页正常渲染和功能
- [ ] 博客页面和文章页面正常
- [ ] 文档页面和导航正常
- [ ] 链接页面和添加功能正常
- [ ] 朋友页面正常
- [ ] 用户认证功能正常
- [ ] 管理后台功能正常

### 特定功能验证

- [ ] 博客面包屑导航显示正确
- [ ] 文档面包屑导航显示正确
- [ ] 文档目录结构显示正确
- [ ] 链接表单网站解析功能正常
- [ ] 内容标题观察器功能正常
- [ ] 所有 UI 组件渲染正常

### 代码质量验证

- [ ] 没有未使用的导入
- [ ] 没有重复的类型定义
- [ ] 导入路径简洁一致
- [ ] 导出模式符合项目标准

## 回滚计划

如果在任何阶段出现问题:

1. **立即停止当前操作**
2. **使用 Git 回滚到上一个稳定状态**
3. **分析问题原因**
4. **修正计划后重新执行**

```bash
# 回滚命令示例
git checkout HEAD~1 -- src/
git reset --hard HEAD~1
```

## 执行建议

1. **分阶段执行**: 每个阶段完成后立即验证
2. **频繁提交**: 每个小步骤完成后提交代码
3. **保持备份**: 在开始前创建分支备份
4. **测试优先**: 每次修改后立即测试相关功能

```bash
# 创建工作分支
git checkout -b refactor/code-organization

# 每个阶段完成后提交
git add .
git commit -m "Phase 1: Migrate shared types to global directory"

# 最终合并前进行完整测试
npm run test
npm run build
npm run lint
```
