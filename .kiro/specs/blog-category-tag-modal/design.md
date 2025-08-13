# 博客分类和标签模态对话框设计文档

## 概述

本设计文档描述了如何实现博客分类和标签页面的模态对话框交互功能。该功能将改进用户体验，通过弹窗形式展示筛选后的文章列表，提供更清晰的浏览体验。

## 架构设计

### 组件架构

```
BlogCategoriesPage
├── CategoryGrid (分类按钮网格)
├── ArticleModal (文章模态对话框)
│   ├── ModalHeader (标题和关闭按钮)
│   ├── ArticleGrid (文章网格布局)
│   └── EmptyState (空状态提示)
└── LoadingState (加载状态)

BlogTagsPage
├── TagCloud (标签云)
├── ArticleModal (复用相同的模态组件)
│   ├── ModalHeader
│   ├── ArticleGrid
│   └── EmptyState
└── LoadingState
```

### 状态管理

使用React的useState和useEffect管理以下状态：

```typescript
interface ModalState {
  isOpen: boolean;
  selectedCategory?: string;
  selectedTag?: string;
  filteredPosts: BlogPost[];
  isLoading: boolean;
  error?: string;
}
```

## 组件设计

### 1. ArticleModal 组件

**职责：** 通用的文章展示模态对话框

**Props接口：**

```typescript
interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  posts: BlogPost[];
  isLoading?: boolean;
  error?: string;
}
```

**功能特性：**

- 使用 Radix UI Dialog 组件作为基础
- 支持ESC键关闭
- 点击遮罩层关闭
- 平滑的淡入淡出动画
- 响应式网格布局
- 滚动支持
- 焦点管理

### 2. CategoryGrid 组件

**职责：** 显示分类按钮网格

**Props接口：**

```typescript
interface CategoryGridProps {
  categories: Category[];
  onCategoryClick: (category: string) => void;
}
```

**设计特性：**

- 响应式网格布局
- 显示分类名称和文章数量
- 悬停效果和点击反馈
- 按文章数量排序显示

### 3. TagCloud 组件

**职责：** 显示标签云

**Props接口：**

```typescript
interface TagCloudProps {
  tags: TagWithCount[];
  onTagClick: (tag: string) => void;
}
```

**设计特性：**

- 标签按使用频率排序
- 热门标签使用更大字体
- 显示标签名称和文章数量
- 流式布局适应不同屏幕尺寸

## 数据模型

### Category 类型

```typescript
interface Category {
  id: string;
  name: string;
  count: number;
}
```

### TagWithCount 类型

```typescript
interface TagWithCount {
  name: string;
  count: number;
  isPopular: boolean;
}
```

### ModalState 类型

```typescript
interface ModalState {
  isOpen: boolean;
  title: string;
  posts: BlogPost[];
  isLoading: boolean;
  error?: string;
}
```

## 用户界面设计

### 分类页面布局

```
┌─────────────────────────────────────┐
│ 文章分类                              │
│ 按分类浏览所有文章，快速找到感兴趣的内容    │
├─────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│ │技术 (12)│ │生活 (8) │ │随笔 (5) │  │
│ └─────────┘ └─────────┘ └─────────┘  │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│ │教程 (15)│ │工具 (6) │ │其他 (3) │  │
│ └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────┘
```

### 标签页面布局

```
┌─────────────────────────────────────┐
│ 文章标签                              │
│ 通过标签发现相关文章，探索更多主题        │
├─────────────────────────────────────┤
│ 热门标签                              │
│ ┌─────┐ ┌───────┐ ┌─────┐ ┌─────┐   │
│ │React│ │Vue (8)│ │CSS  │ │JS   │   │
│ │(12) │ └───────┘ │(6)  │ │(10) │   │
│ └─────┘           └─────┘ └─────┘   │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│ │Node │ │Git  │ │API  │ │Tool │     │
│ │(5)  │ │(4)  │ │(7)  │ │(3)  │     │
│ └─────┘ └─────┘ └─────┘ └─────┘     │
└─────────────────────────────────────┘
```

### 模态对话框布局

```
┌─────────────────────────────────────┐
│ ████████████████████████████████████ │ ← 遮罩层
│ █ ┌─────────────────────────────┐ █ │
│ █ │ 技术分类文章 (12篇)      ✕ │ █ │ ← 标题栏
│ █ ├─────────────────────────────┤ █ │
│ █ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─┐ │ █ │
│ █ │ │文章1│ │文章2│ │文章3│ │4│ │ █ │ ← 文章网格
│ █ │ └─────┘ └─────┘ └─────┘ └─┘ │ █ │
│ █ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─┐ │ █ │
│ █ │ │文章5│ │文章6│ │文章7│ │8│ │ █ │
│ █ │ └─────┘ └─────┘ └─────┘ └─┘ │ █ │
│ █ └─────────────────────────────┘ █ │
│ ████████████████████████████████████ │
└─────────────────────────────────────┘
```

## 响应式设计

### 断点定义

- 移动设备: < 640px (1列)
- 小平板: 640px - 768px (2列)
- 大平板: 768px - 1024px (3列)
- 桌面: > 1024px (4列)

### 模态对话框尺寸

- 移动设备: 宽度95%，最大高度90vh
- 平板设备: 宽度85%，最大高度85vh
- 桌面设备: 宽度80%，最大宽度1200px，最大高度80vh

## 动画设计

### 模态对话框动画

```css
/* 打开动画 */
.modal-enter {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-active {
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 200ms,
    transform 200ms;
}

/* 关闭动画 */
.modal-exit {
  opacity: 1;
  transform: scale(1);
}
.modal-exit-active {
  opacity: 0;
  transform: scale(0.95);
  transition:
    opacity 150ms,
    transform 150ms;
}
```

### 按钮悬停效果

```css
.category-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 200ms ease;
}
```

## 错误处理

### 错误状态设计

1. **网络错误：** 显示重试按钮和错误信息
2. **空数据：** 显示友好的空状态提示
3. **加载超时：** 显示超时提示和重试选项

### 错误信息文案

- 网络错误: "加载失败，请检查网络连接后重试"
- 空数据: "该分类/标签暂无文章"
- 加载超时: "加载时间过长，请重试"

## 性能优化策略

### 1. 数据缓存

- 使用React Query或SWR缓存文章数据
- 实现智能预加载热门分类/标签的数据

### 2. 虚拟滚动

- 当文章数量超过50篇时启用虚拟滚动
- 减少DOM节点数量提升性能

### 3. 图片优化

- 使用Next.js Image组件优化图片加载
- 实现渐进式图片加载

### 4. 代码分割

- 模态对话框组件使用动态导入
- 减少初始包大小

## 可访问性设计

### ARIA 属性

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">技术分类文章</h2>
  <div id="modal-description">共12篇文章</div>
</div>
```

### 键盘导航

- Tab: 在可聚焦元素间移动
- Escape: 关闭模态对话框
- Enter/Space: 激活按钮
- 焦点陷阱: 确保焦点不会离开模态对话框

### 屏幕阅读器支持

- 提供清晰的标题和描述
- 使用语义化HTML标签
- 提供状态变化的实时反馈

## 测试策略

### 单元测试

- 组件渲染测试
- 事件处理测试
- 状态管理测试

### 集成测试

- 模态对话框打开/关闭流程
- 数据筛选和显示
- 响应式布局测试

### 端到端测试

- 用户完整操作流程
- 不同设备和浏览器兼容性
- 可访问性测试

## 技术实现细节

### 依赖库选择

- **UI组件库：** Radix UI (Dialog, Portal)
- **动画库：** Framer Motion 或 CSS Transitions
- **状态管理：** React useState/useReducer
- **数据获取：** 现有的 useBlogPosts hook

### 文件结构

```
src/
├── components/
│   ├── modals/
│   │   ├── ArticleModal.tsx
│   │   └── index.ts
│   └── blog/
│       ├── CategoryGrid.tsx
│       ├── TagCloud.tsx
│       └── index.ts
├── hooks/
│   ├── useModal.ts
│   └── useArticleFilter.ts
└── app/
    ├── blog/
    │   ├── categories/
    │   │   └── page.tsx
    │   └── tags/
    │       └── page.tsx
```

这个设计提供了完整的技术实现方案，确保功能的可用性、性能和可访问性。
