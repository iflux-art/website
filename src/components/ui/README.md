# UI Components

这个目录包含了所有基础 UI 组件。这些组件是构建用户界面的基础构建块，遵循了一致的设计系统。

## 组件分类

### 输入控件
- `button.tsx` - 按钮组件
- `input.tsx` - 输入框组件
- `textarea.tsx` - 文本域组件
- `checkbox.tsx` - 复选框组件
- `select.tsx` - 选择框组件
- `switch.tsx` - 开关组件
- `dual-textarea.tsx` - 双栏文本编辑器

### 导航组件
- `nav-item.tsx` - 导航项
- `nav-link.tsx` - 导航链接
- `breadcrumb.tsx` - 面包屑导航
- `sidebar.tsx` - 侧边栏
- `adaptive-sidebar.tsx` - 自适应侧边栏

### 布局组件
- `adaptive-container.tsx` - 自适应容器
- `card.tsx` - 卡片容器
- `card-hover.tsx` - 悬停效果卡片
- `unified-card.tsx` - 统一样式卡片
- `unified-grid.tsx` - 统一网格布局
- `separator.tsx` - 分隔线
- `scroll-area.tsx` - 滚动区域

### 反馈组件
- `alert.tsx` - 提示消息
- `alert-dialog.tsx` - 提示对话框
- `dialog.tsx` - 对话框
- `sheet.tsx` - 侧边抽屉
- `tooltip.tsx` - 工具提示
- `badge.tsx` - 徽章

### 数据展示
- `table.tsx` - 表格
- `data-table.tsx` - 数据表格
- `tabs.tsx` - 标签页
- `tag-filter.tsx` - 标签筛选器

### 文档相关
- `code-block.tsx` - 代码块
- `simple-markdown-renderer.tsx` - Markdown 渲染
- `heading-with-anchor.tsx` - 带锚点的标题
- `table-of-contents.tsx` - 目录导航

### 图片处理
- `optimized-image.tsx` - 优化图片
- `responsive-image.tsx` - 响应式图片

### 功能组件
- `admin-actions.tsx` - 管理操作
- `tool-actions.tsx` - 工具操作
- `font-loader.tsx` - 字体加载
- `progressive-enhancement.tsx` - 渐进增强
- `search-button.tsx` - 搜索按钮

## 使用指南

### 组件导入
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
```

### Tailwind CSS
所有组件都使用 Tailwind CSS 进行样式设计，确保一致的视觉风格。

### TypeScript
所有组件都使用 TypeScript 编写，提供完整的类型定义。

### 组件参数
每个组件都有详细的 Props 定义，请参考各组件文件顶部的类型定义。

### 可访问性
组件都遵循 WAI-ARIA 规范，确保良好的可访问性支持。

## 开发规范

1. 新组件必须使用 TypeScript
2. 必须提供组件的 Props 类型定义
3. 使用 Tailwind CSS 进行样式管理
4. 遵循无障碍设计原则
5. 编写组件单元测试

## 组件文档

每个组件都应该在文件顶部包含以下文档：

```tsx
/**
 * @component ComponentName
 * @description 简短的组件描述
 * 
 * @example
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */
```
