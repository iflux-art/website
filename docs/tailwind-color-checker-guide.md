# Tailwind CSS 颜色检查工具指南

本文档介绍了如何使用 Tailwind CSS 颜色检查工具，该工具可以帮助你检测代码中使用的传统 Tailwind CSS 颜色名称，并提供替代方案。

## 背景

Tailwind CSS v4 使用 OKLCH 颜色格式替代了传统的命名颜色系统。为了确保项目完全兼容 Tailwind CSS v4，我们需要避免使用传统的颜色名称（如 `text-blue-500`、`bg-gray-200` 等），而是使用 CSS 变量或 OKLCH 颜色格式。

## 颜色检查工具

我们创建了一个自定义 ESLint 插件 `tailwind-color-checker`，它可以检测代码中使用的传统 Tailwind CSS 颜色名称，并提供替代方案。

### 检测的颜色名称

该工具检测以下传统颜色名称的使用：

- 灰度系列：`gray`、`slate`、`zinc`、`neutral`、`stone`
- 颜色系列：`red`、`orange`、`amber`、`yellow`、`lime`、`green`、`emerald`、`teal`、`cyan`、`sky`、`blue`、`indigo`、`violet`、`purple`、`fuchsia`、`pink`、`rose`

### 检测的颜色类型

该工具检测以下类型的颜色类名：

- 文本颜色：`text-{color}-{intensity}`
- 背景颜色：`bg-{color}-{intensity}`
- 边框颜色：`border-{color}-{intensity}`
- 轮廓颜色：`outline-{color}-{intensity}`
- 阴影颜色：`shadow-{color}-{intensity}`
- 环颜色：`ring-{color}-{intensity}`
- 分割线颜色：`divide-{color}-{intensity}`
- 占位符颜色：`placeholder-{color}-{intensity}`

## 使用方法

### 在开发过程中

在开发过程中，ESLint 会自动检测代码中使用的传统颜色名称，并在 IDE 中显示警告。你可以根据警告信息，使用推荐的替代方案进行修改。

### 使用命令行检查

你可以使用以下命令检查项目中使用的传统颜色名称：

```bash
# 使用增强的 ESLint 配置进行检查
pnpm lint:enhanced

# 专门检查传统颜色名称（将警告升级为错误）
pnpm lint:tailwind-colors
```

## 替代方案

当检测到传统颜色名称时，工具会提供以下替代方案：

### 使用 CSS 变量

推荐使用 CSS 变量替代传统颜色名称，这样可以更容易地管理主题：

```jsx
// 旧版
<div className="text-gray-800 bg-blue-100">内容</div>

// 新版
<div className="text-foreground bg-background">内容</div>
```

常用的 CSS 变量包括：

- `text-foreground`：主要文本颜色
- `text-muted-foreground`：次要文本颜色
- `bg-background`：主要背景颜色
- `bg-muted`：次要背景颜色
- `border-border`：边框颜色
- `text-primary`：主要强调色
- `text-secondary`：次要强调色
- `text-destructive`：危险/错误颜色
- `text-success`：成功颜色

### 使用 OKLCH 颜色格式

如果需要更精确的颜色控制，可以使用 OKLCH 颜色格式：

```jsx
// 旧版
<div className="text-blue-500">内容</div>

// 新版
<div className="text-[oklch(0.5_0.15_240)]">内容</div>
```

常用的 OKLCH 颜色对应关系：

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

## 最佳实践

1. **使用 CSS 变量**：尽可能使用 CSS 变量而不是硬编码颜色值，这样可以更容易地管理主题
2. **创建颜色映射系统**：对于需要多种颜色的组件，使用 `src/lib/color-utils.ts` 中的颜色映射系统
3. **定期运行检查**：定期运行 `pnpm lint:tailwind-colors` 命令，确保没有使用传统颜色名称
4. **在 CI 中集成**：在 CI 流程中添加颜色检查，确保所有提交的代码都符合规范

## 常见问题

### 1. 如何处理第三方组件中的传统颜色名称？

对于无法修改的第三方组件，可以使用以下方法：

1. 使用 `className` 覆盖第三方组件的样式
2. 使用 `!important` 强制应用自定义样式
3. 使用包装组件，重新定义样式

### 2. 如何处理大量需要更新的代码？

对于大量需要更新的代码，可以使用以下策略：

1. 优先更新高优先级组件（如 UI 组件库）
2. 使用 `pnpm lint:tailwind-colors` 命令识别需要更新的文件
3. 使用批量替换工具，如 VSCode 的全局搜索替换功能
4. 逐步更新，先将警告级别设置为 `warn`，然后逐步升级为 `error`

## 参考资源

- [Tailwind CSS v4 官方文档](https://tailwindcss.com/docs)
- [OKLCH 颜色格式介绍](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Tailwind CSS v4 迁移指南](docs/tailwind-v4-migration-guide.md)
