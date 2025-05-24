# 模块化架构重构

## 概述

按照您的要求，我已经将项目重构为更加模块化的架构，主要分为**页面布局组件**和**卡片组件**两大类。

## 页面布局组件 (`src/components/layouts/`)

### 1. DocsLayout - 文档布局
**用途**: 文档详情页的三栏布局
- 左侧：文档列表侧边栏
- 中间：内容主体
- 右侧：目录

**使用场景**:
- 文档详情页 (`/docs/[...slug]`)
- 导航详情页 (`/navigation/[...slug]`)

### 2. ArticleLayout - 文章布局
**用途**: 去掉左侧边栏的两栏布局
- 中间：内容主体
- 右侧：目录

**使用场景**:
- 友情链接页 (`/friends`)
- 单独的文章页面

### 3. BlogLayout - 博客布局
**用途**: 博客聚合页效果，支持标签筛选
- 页面标题和描述
- 可选的标签筛选器
- 内容网格布局

**使用场景**:
- 博客集合页 (`/blog`)
- 文档集合页 (`/docs`) - 不显示标签筛选

## 卡片组件 (`src/components/cards/`)

### 1. BaseCard - 基础卡片
**功能**: 只有标题+描述的基础卡片
**属性**:
- `title`: 标题
- `description`: 描述
- `children`: 自定义内容
- `onClick`: 点击事件
- `href`: 链接地址

### 2. DocsCard - 文档集卡片
**功能**: 标题+描述+文章数量+浏览文档超链接
**属性**:
- `title`: 文档集标题
- `description`: 文档集描述
- `articleCount`: 文章数量
- `href`: 文档集链接

### 3. BlogCard - 博客卡片
**功能**: 标题+描述+发布时间+文章标签+阅读全文超链接
**属性**:
- `title`: 博客标题
- `description`: 博客描述
- `publishDate`: 发布时间
- `tags`: 标签数组
- `href`: 博客链接

### 4. NavigationCard - 网址导航卡片
**功能**: 标题+描述+网站图标+可选的"推荐"标签
**属性**:
- `title`: 网站标题
- `description`: 网站描述
- `url`: 网站链接
- `icon`: 网站图标
- `isRecommended`: 是否推荐

### 5. FriendLinkCard - 友情链接卡片
**功能**: 标题+描述+网站图标
**属性**:
- `title`: 网站标题
- `description`: 网站描述
- `url`: 网站链接
- `avatar`: 网站头像

## 使用示例

### 页面布局使用

```tsx
// 文档详情页
<DocsLayout
  category="guides"
  currentDoc="introduction"
  headings={headings}
  breadcrumbItems={breadcrumbItems}
>
  <h1>文档标题</h1>
  <MDXContent>{content}</MDXContent>
</DocsLayout>

// 博客集合页
<BlogLayout
  title="博客"
  showTagFilter={true}
  allTags={allTags}
  selectedTag={selectedTag}
  onTagChange={setSelectedTag}
>
  <BlogList />
</BlogLayout>
```

### 卡片组件使用

```tsx
// 文档集合页
<DocsCard
  title="开发指南"
  description="前端开发相关的指南和最佳实践"
  articleCount={12}
  href="/docs/guides"
/>

// 博客列表
<BlogCard
  title="Next.js 最佳实践"
  description="分享 Next.js 开发中的经验和技巧"
  publishDate="2024-01-15"
  tags={["Next.js", "React", "前端"]}
  href="/blog/nextjs-best-practices"
/>
```

## MDX 组件集成

为了在 MDX 文件中使用新的卡片组件，我创建了专门的 MDX 组件：

### NavigationGrid & NavigationItem
```mdx
<NavigationGrid>
  <NavigationItem
    title="React"
    description="用于构建用户界面的 JavaScript 库"
    url="https://react.dev"
    icon="⚛️"
    featured
  />
</NavigationGrid>
```

### FriendLinkGrid & FriendLinkItem
```mdx
<FriendLinkGrid>
  <FriendLinkItem
    title="张三的博客"
    description="分享技术和生活"
    url="https://zhangsan.blog"
    avatar="/avatars/zhangsan.jpg"
  />
</FriendLinkGrid>
```

## 已更新的页面

1. **文档详情页** (`/docs/[...slug]`) - 使用 DocsLayout
2. **博客集合页** (`/blog`) - 使用 BlogLayout
3. **文档集合页** (`/docs`) - 使用 BlogLayout + DocsCard
4. **友情链接页** (`/friends`) - 使用 ArticleLayout

## 优势

1. **高度模块化**: 每个组件职责单一，易于维护
2. **易于复用**: 布局和卡片组件可在不同页面间复用
3. **一致性**: 统一的设计风格和交互体验
4. **可扩展**: 新增页面类型或卡片类型都很容易
5. **类型安全**: 完整的 TypeScript 类型定义

这样的架构让代码更加清晰、易维护，同时保持了高度的灵活性和可复用性。
