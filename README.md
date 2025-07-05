# Project Name

基于Next.js的应用框架，采用现代化架构和最佳实践。

## 技术栈

Next.js (App Router) + React + TypeScript + Tailwind CSS + Shadcn-ui + Zustand + Zod + TanStack Query + next-mdx-remote/rsc

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
