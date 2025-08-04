# 网站功能改进设计文档

## 概述

本设计文档详细描述了网站功能改进的技术实现方案，包括友链页面、首页重设计、文档页面优化和TOC目录文本溢出修复。所有改进都基于现有的 Next.js + shadcn/ui 技术栈。

## 架构

### 技术栈

- **前端框架**: Next.js 14+ (App Router)
- **UI组件库**: shadcn/ui + Tailwind CSS
- **内容管理**: MDX + gray-matter
- **状态管理**: React hooks
- **样式系统**: Tailwind CSS + CSS Modules

### 目录结构

```
src/
├── app/
│   ├── friends/          # 友链页面
│   ├── docs/            # 文档页面
│   └── page.tsx         # 首页
├── components/
│   ├── content/         # 内容相关组件
│   ├── layout/          # 布局组件
│   └── ui/              # shadcn/ui 组件
└── data/
    └── friends.json     # 友链数据
```

## 组件和接口

### 1. 友链页面组件

#### FriendsPage 组件

```typescript
interface Friend {
  name: string;
  url: string;
  description: string;
  favicon?: string;
  category?: string;
}

interface FriendsPageProps {
  friends: Friend[];
}
```

**设计要点:**

- 使用 CSS Grid 实现响应式布局
- 自动获取网站 favicon
- 支持分类显示
- 卡片悬停效果

#### FriendCard 组件

```typescript
interface FriendCardProps {
  friend: Friend;
  className?: string;
}
```

### 2. 首页重设计组件

#### HeroSection 组件

- 全屏背景设计
- 动画效果
- 响应式文字大小

#### BusinessSection 组件

- 四个业务模块展示
- 图标 + 描述 + 链接
- Grid 布局适配移动端

### 3. 文档页面优化

#### 路由结构调整

- 移除列表页面逻辑
- 直接渲染文档详情
- 保持面包屑导航

### 4. TOC目录文本溢出修复

#### TableOfContents 组件优化

**当前问题分析:**

1. 长标题文本溢出容器边界
2. 固定宽度限制导致文本截断
3. 缺少适当的文本换行处理
4. 多级标题缩进与换行冲突

**解决方案:**

##### 4.1 文本换行处理

```css
.toc-link {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  overflow-wrap: break-word;
}
```

##### 4.2 容器宽度优化

- 使用 `min-w-0` 确保容器可以收缩
- 设置合理的最大宽度限制
- 使用 flexbox 布局处理文本溢出

##### 4.3 多级标题缩进调整

```typescript
// 动态计算缩进，考虑文本换行
const getIndentStyle = (level: number) => ({
  paddingLeft: `${Math.max(0.5, (level - 2) * 0.75)}rem`,
  textIndent: level > 2 ? `-0.25rem` : "0",
});
```

##### 4.4 响应式设计

- 在小屏幕上减少缩进量
- 调整字体大小适应容器
- 优化行高和间距

## 数据模型

### 友链数据结构

```json
{
  "friends": [
    {
      "name": "网站名称",
      "url": "https://example.com",
      "description": "网站描述",
      "favicon": "https://example.com/favicon.ico",
      "category": "技术博客"
    }
  ]
}
```

### TOC标题数据结构

```typescript
interface TocHeading {
  id: string;
  text: string;
  level: number;
}
```

## 错误处理

### 1. 友链页面错误处理

- Favicon 加载失败时显示默认图标
- 网络请求超时处理
- 无效链接检测

### 2. TOC组件错误处理

- 空标题列表处理
- 无效标题ID处理
- 滚动位置异常处理

### 3. 通用错误处理

- 404页面优化
- 加载状态显示
- 错误边界组件

## 测试策略

### 1. 单元测试

- 组件渲染测试
- 数据处理逻辑测试
- 工具函数测试

### 2. 集成测试

- 页面路由测试
- 组件交互测试
- 数据获取测试

### 3. 视觉回归测试

- 响应式布局测试
- 不同浏览器兼容性测试
- 文本溢出场景测试

### 4. 性能测试

- 页面加载速度测试
- 图片加载优化测试
- TOC滚动性能测试

## 具体实现细节

### TOC文本溢出修复的关键实现

#### 1. CSS样式优化

```css
.toc-container {
  min-width: 0;
  max-width: 16rem; /* 256px */
  width: 100%;
}

.toc-link {
  display: block;
  width: 100%;
  min-width: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.4;
}

.toc-text {
  display: block;
  width: 100%;
  white-space: normal;
  word-break: break-word;
}
```

#### 2. 响应式缩进计算

```typescript
const getResponsiveIndent = (level: number, containerWidth: number) => {
  const baseIndent = 1; // 1rem
  const levelIndent = Math.max(0.5, (level - 2) * 0.75);

  // 在小容器中减少缩进
  if (containerWidth < 200) {
    return baseIndent + levelIndent * 0.6;
  }

  return baseIndent + levelIndent;
};
```

#### 3. 文本截断与提示

```typescript
const truncateText = (text: string, maxLength: number = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
```

这个设计确保了TOC目录在各种屏幕尺寸和标题长度下都能正确显示，解决了文本溢出问题。
