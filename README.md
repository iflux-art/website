## 待办

第一步：创建shadcn/ui风格的组件目录结构
第二步：实现组件时直接使用Tailwind类名
第三步：移除config/mdx/styles.ts文件
第四步：优化组件注册逻辑
第三步：优化src/mdx-components.tsx的组件注册
第四步：清理类型定义

可以将部分重复的内联样式提取为Tailwind插件
考虑将常用类组合定义为@apply指令

## 技术栈

- 核心框架：Next.js (App Router) + React + React DOM
- 主题切换：Next Themes
- TypeScript
- 样式系统：Tailwind CSS
- CSS 类名管理和合并：Class Variants Authority + clsx + Tailwind Merge + Shadcn/ui
- UI 组件：Radix UI + shadcn/ui
- 组件库开发：Storybook
- 表单组件：react-hook-form + zod
- 图标：lucide-react
- 状态管理：Zustand + TanStack Query
- 数据验证：Zod
- MDX处理：next-mdx-remote/rsc（MDX 渲染） + gray-matter（解析 frontmatter 元数据） + remark-gfm（扩展 Markdown 语法）+ rehype-pretty-code + Shiki
- MDX样式：Tailwind CSS + @tailwindcss/typography（prose 类） + shadcn/ui
- 代码质量：ESLint + Prettier
- Git 提交前检查：Git Hooks
- 工具函数：immer
- 网页解析：cheerio
- 文件监听：chokidar
- 开发工具：madge
- pwa：next-pwa

## MDX 组件整理

### 用 prose 替代（tailwindcss/typography + gfm）

- mdx-heading
- mdx-table
- mdx-image.tsx
- mdx-codeInline

### 自定义组件

- mdx-link.tsx
- mdx-blockquote 引用块
- mdx-callout.tsx 提示/警告/信息块
- mdx-code-block

---

- mdx-code-group.tsx
- mdx-video.tsx
- mdx-card.tsx

### 设置

- mdx-renderer.tsx
- mdx-components.ts 组件映射聚合

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
