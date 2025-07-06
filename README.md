# Project Name

符合Next.js + next-mdx-remote/rsc最佳实践：Next.js 社区和官方都推荐的

充分利用RSC特性
合理拆分组件
优化了性能

基于Next.js的应用框架，采用现代化架构和最佳实践。

最佳实践通常包括：单一职责原则，合理的模块划分，避免过度拆分或过度合并

职责单一
内容不重复
大小适中
易于维护

## 技术栈

- 核心框架：Next.js (App Router) + React + React DOM
- 主题切换：Next Themes
- TypeScript
- 样式系统：Tailwind CSS
- CSS 类名管理和合并：Class Variants Authority + clsx + Tailwind Merge
- UI 组件：Radix UI + Shadcn/UI
- 图标：lucide-react
- 状态管理：Zustand + TanStack Query
- 数据验证：Zod
- MDX处理：next-mdx-remote/rsc（MDX 渲染） + gray-matter（解析 frontmatter 元数据） + remark-gfm（扩展 Markdown 语法）
- 代码质量：ESLint + Prettier
- Git 提交前检查：Git Hooks
- 工具函数：immer
- 网页解析：cheerio
- 文件监听：chokidar
- 开发工具：madge

基础MDX样式在多处重复定义
变体样式管理混乱
缺少统一的样式扩展点

集中管理样式变量：

保留src/config/mdx/styles.ts作为唯一定义源
移除其他文件中的重复定义
创建统一样式工具：

在MDXStyles中提供完整样式组合
组件通过MDXStyles.prose使用统一样式

## 项目结构

```
src/
├── app/                # 应用路由
├── components/         # 组件库
├── config/            # 配置
├── content/           # 内容文件(MDX)
├── hooks/             # 自定义Hook
├── lib/               # 工具库
├── public/            # 静态资源
├── styles/            # 全局样式
├── types/             # 类型定义
└── utils/             # 工具函数
```

## 主要特性

### 架构设计

- 模块化组件结构
- 类型安全的API设计
- 集中式状态管理
- 全局错误处理

### 性能优化

- 代码分割
- 按需加载
- 图片优化
- 服务端渲染

## 开发指南

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 生产构建

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

## 最佳实践

1. 组件开发遵循原子设计原则
2. 所有API响应统一格式
3. 状态管理使用Zustand
4. 错误处理使用ErrorBoundary
5. 严格类型检查
