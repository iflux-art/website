# 组件分类指南

本文档提供了项目组件分类的标准和最佳实践，帮助团队成员理解如何正确组织和分类组件。

## 组件分类体系

我们的项目采用三层组件分类体系：

1. **UI 组件** (`components/ui/`)
2. **功能组件** (`components/features/`)
3. **布局组件** (`components/layout/`)

### UI 组件 (`components/ui/`)

UI 组件是构建用户界面的基本单元，它们是纯展示型、可复用、可组合的组件。

#### 特点：
- 纯展示型，不包含业务逻辑
- 高度可复用
- 不依赖特定上下文
- 通常只依赖于样式和基础库
- 通过 props 接收所有数据和回调函数

#### 示例：
- Button
- Card
- Dialog
- Input
- Avatar
- Badge

#### 目录结构：
```
components/ui/button/
  ├── index.ts           # 导出文件
  ├── button.tsx         # 组件实现
  ├── button.types.ts    # 类型定义（可选）
  └── button.test.tsx    # 组件测试（可选）
```

### 功能组件 (`components/features/`)

功能组件实现特定的功能或业务逻辑，可能使用多个UI组件，与状态管理交互。

#### 特点：
- 实现特定功能
- 可能包含业务逻辑
- 可能使用多个UI组件
- 可能与状态管理交互
- 可能依赖于特定上下文

#### 示例：
- ThemeToggle
- SearchBar
- BlogPostCard
- CommentForm
- NotificationList

#### 目录结构：
```
components/features/theme-toggle/
  ├── index.ts                # 导出文件
  ├── theme-toggle.tsx        # 组件实现
  ├── theme-toggle.types.ts   # 类型定义（可选）
  └── theme-toggle.test.tsx   # 组件测试（可选）
```

### 布局组件 (`components/layout/`)

布局组件定义页面的结构和排列，管理空间分配，实现响应式设计。

#### 特点：
- 定义页面结构
- 管理空间分配
- 实现响应式设计
- 通常不包含复杂的业务逻辑
- 可能包含多个UI组件和功能组件

#### 示例：
- Navbar
- Footer
- Sidebar
- PageLayout
- HeroSection
- FeatureSection

#### 目录结构：
```
components/layout/navbar/
  ├── index.ts           # 导出文件
  ├── navbar.tsx         # 组件实现
  ├── navbar.types.ts    # 类型定义（可选）
  └── navbar.test.tsx    # 组件测试（可选）
```

## 组件命名约定

### 文件命名

- 组件文件使用 kebab-case（小写字母，单词之间用连字符连接）
- 组件目录使用与组件文件相同的名称
- 类型定义文件添加 `.types` 后缀
- 测试文件添加 `.test` 或 `.spec` 后缀

### 组件命名

- 组件使用 PascalCase（每个单词首字母大写，没有分隔符）
- UI 组件使用简洁的名称（如 `Button`、`Card`）
- 功能组件使用描述性名称（如 `ThemeToggle`、`SearchBar`）
- 布局组件使用位置或功能相关名称（如 `Navbar`、`Footer`）

## 组件结构最佳实践

### 1. 每个组件都应该有自己的目录

```
components/ui/button/
  ├── index.ts
  └── button.tsx
```

### 2. 使用 index.ts 导出组件

```typescript
// components/ui/button/index.ts
export * from './button';
```

### 3. 为组件添加类型定义

```typescript
// components/ui/button/button.types.ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}
```

### 4. 为组件添加注释

```typescript
/**
 * 按钮组件
 * 
 * 提供多种样式变体和尺寸的按钮
 * 
 * @example
 * <Button variant="primary" size="md">点击我</Button>
 */
export function Button({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) {
  // 组件实现
}
```

## 组件迁移策略

在重构现有组件时，请遵循以下策略：

1. **渐进式迁移**：一次迁移一个组件或一组相关组件
2. **保持向后兼容**：确保迁移不会破坏现有功能
3. **添加测试**：为迁移的组件添加测试，确保功能正确
4. **更新文档**：更新组件文档，反映新的结构和用法

## 组件审计和维护

定期进行组件审计，确保所有组件都遵循分类标准和最佳实践。使用 `scripts/component-audit.js` 脚本生成审计报告，识别需要改进的组件。
