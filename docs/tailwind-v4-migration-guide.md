# Tailwind CSS v4 迁移指南

本文档提供了将项目从 Tailwind CSS v3 迁移到 v4 的详细指南，包括新特性、语法变化和最佳实践。

## 迁移概述

Tailwind CSS v4 带来了许多重大变化，包括：

1. **新的颜色系统**：使用 OKLCH 颜色格式替代传统的命名颜色
2. **新的主题系统**：使用 `@theme` 指令替代旧版的 `dark:` 前缀
3. **新的插件系统**：使用 `@plugin` 指令导入插件
4. **新的 PostCSS 包**：使用 `@tailwindcss/postcss` 替代 `tailwindcss`

## 迁移步骤

### 1. 更新依赖

首先，更新项目依赖：

```bash
# 使用 pnpm
pnpm remove tailwindcss
pnpm add -D @tailwindcss/postcss

# 更新相关插件
pnpm add -D @tailwindcss/typography
```

### 2. 更新配置文件

将 `tailwind.config.js` 更新为 `tailwind.config.mjs`，并使用 ES 模块语法：

```js
// 旧版
module.exports = {
  // 配置
}

// 新版
export default {
  // 配置
}
```

### 3. 更新 PostCSS 配置

更新 `postcss.config.js` 为 `postcss.config.mjs`：

```js
// 旧版
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// 新版
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 4. 更新全局 CSS 文件

在 `globals.css` 中使用新的指令语法：

```css
/* 旧版 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 新版 */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
@plugin "@tailwindcss/typography";
```

### 5. 更新主题系统

使用新的 `@theme` 指令替代旧版的 `dark:` 前缀：

```css
/* 旧版 */
:root {
  --background: white;
  --foreground: black;
}

.dark {
  --background: black;
  --foreground: white;
}

/* 新版 */
@theme inline {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.2 0 0);
  }

  .dark {
    --background: oklch(0.2 0 0);
    --foreground: oklch(0.9 0 0);
  }
}
```

### 6. 更新颜色系统

使用 OKLCH 颜色格式或 CSS 变量替代传统的命名颜色：

```jsx
// 旧版
<div className="text-gray-800 bg-blue-100">内容</div>

// 新版 - 使用 CSS 变量
<div className="text-foreground bg-background">内容</div>

// 新版 - 使用 OKLCH 颜色
<div className="text-[oklch(0.2_0_0)] bg-[oklch(0.96_0.03_240/0.2)]">内容</div>
```

### 7. 更新自定义变体

使用新的 `@custom-variant` 指令定义自定义变体：

```css
/* 旧版 */
@layer utilities {
  .custom-variant\:class {
    /* 样式 */
  }
}

/* 新版 */
@custom-variant custom-variant {
  /* 样式 */
}
```

## 常见问题与解决方案

### 1. 颜色转换

将传统颜色名称转换为 OKLCH 格式：

| 传统颜色 | OKLCH 等效值 |
|---------|-------------|
| gray-900 | oklch(0.2 0 0) |
| gray-800 | oklch(0.3 0 0) |
| gray-500 | oklch(0.6 0 0) |
| gray-300 | oklch(0.8 0 0) |
| gray-100 | oklch(0.95 0 0) |
| blue-600 | oklch(0.5 0.15 240) |
| green-500 | oklch(0.5 0.15 140) |
| red-500 | oklch(0.5 0.15 20) |
| yellow-500 | oklch(0.7 0.15 80) |

### 2. 深色模式

在 Tailwind CSS v4 中，深色模式的处理方式发生了变化：

```jsx
// 旧版
<div className="bg-white dark:bg-gray-800">内容</div>

// 新版 - 使用 CSS 变量
<div className="bg-background">内容</div>

// 新版 - 使用 @custom-variant
<div className="bg-white @dark:bg-[oklch(0.2_0_0)]">内容</div>
```

### 3. 插件使用

在 Tailwind CSS v4 中，插件的使用方式发生了变化：

```js
// 旧版
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

// 新版
// globals.css
@plugin "@tailwindcss/typography";
```

## 最佳实践

1. **使用 CSS 变量**：尽可能使用 CSS 变量而不是硬编码颜色值，这样可以更容易地管理主题
2. **创建颜色映射系统**：为传统颜色名称创建映射系统，方便迁移
3. **逐步迁移**：从高优先级组件开始，逐步迁移到 Tailwind CSS v4
4. **使用 ESLint 插件**：使用 ESLint 插件检测和修复不兼容的语法

## 参考资源

- [Tailwind CSS v4 官方文档](https://tailwindcss.com/docs)
- [Tailwind CSS v4 迁移指南](https://tailwindcss.com/docs/upgrade-guide)
- [OKLCH 颜色格式介绍](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
