# 导航栏下拉菜单主题色使用指南

## 概述

导航栏下拉菜单现在使用项目的主题色系统，确保与整体设计保持一致，并支持深色模式自动切换。

## 使用的主题色变量

### 下拉菜单容器

```css
bg-popover          /* 弹出层背景色 */
border-border       /* 边框颜色 */
text-popover-foreground  /* 文字颜色 */
```

### 菜单项

```css
text-popover-foreground      /* 默认文字颜色 */
hover:bg-accent             /* 悬浮背景色 */
hover:text-accent-foreground /* 悬浮文字颜色 */
```

## 主题色定义

### 浅色模式

```css
--popover: oklch(1 0 0); /* 白色背景 */
--popover-foreground: oklch(0.145 0 0); /* 深色文字 */
--border: oklch(0.922 0 0); /* 浅灰边框 */
--accent: oklch(0.97 0 0); /* 浅灰悬浮背景 */
--accent-foreground: oklch(0.205 0 0); /* 深色悬浮文字 */
```

### 深色模式

```css
--popover: oklch(0.205 0 0); /* 深色背景 */
--popover-foreground: oklch(0.985 0 0); /* 浅色文字 */
--border: oklch(1 0 0 / 10%); /* 半透明边框 */
--accent: oklch(0.269 0 0); /* 深灰悬浮背景 */
--accent-foreground: oklch(0.985 0 0); /* 浅色悬浮文字 */
```

## 实现代码

### 导航菜单下拉样式

```typescript
<div
  className="absolute top-full left-0 mt-2 min-w-[8rem] bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-1"
  style={{ zIndex: 9999 }}
>
  {item.children.map((child) => (
    <Link
      key={child.key}
      href={NAV_PATHS[child.key]}
      onClick={onClose}
      className="block px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
    >
      {child.label}
    </Link>
  ))}
</div>
```

## 优势

### 1. 主题一致性

- 自动与项目整体设计保持一致
- 使用统一的颜色变量系统
- 避免硬编码颜色值

### 2. 深色模式支持

- 自动适配深色/浅色主题
- 无需额外的深色模式样式
- 平滑的主题切换过渡

### 3. 可维护性

- 集中的颜色管理
- 易于全局颜色调整
- 符合设计系统规范

### 4. 可访问性

- 确保足够的对比度
- 符合 WCAG 可访问性标准
- 支持高对比度模式

## 颜色对比度

项目的主题色经过精心设计，确保在所有模式下都有足够的对比度：

- **浅色模式**: 深色文字 (oklch(0.145 0 0)) 在白色背景上
- **深色模式**: 浅色文字 (oklch(0.985 0 0)) 在深色背景上
- **悬浮状态**: 使用 accent 颜色提供清晰的交互反馈

## 自定义主题色

如需自定义主题色，只需修改 `src/app/globals.css` 中的 CSS 变量：

```css
:root {
  --popover: your-custom-color;
  --popover-foreground: your-custom-text-color;
  --accent: your-custom-hover-color;
  --accent-foreground: your-custom-hover-text-color;
  --border: your-custom-border-color;
}
```

## 测试建议

1. **主题切换测试**: 在浅色和深色模式下测试下拉菜单
2. **对比度测试**: 确保文字在所有状态下都清晰可读
3. **交互测试**: 验证悬浮状态的视觉反馈
4. **响应式测试**: 在不同屏幕尺寸下测试显示效果

## 相关文件

- `src/components/navbar/nav-menu.tsx` - 导航菜单实现
- `src/components/ui/hover-dropdown.tsx` - 悬浮下拉组件
- `src/app/globals.css` - 主题色定义
- `tailwind.config.mjs` - Tailwind 配置
