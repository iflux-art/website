# iFluxArt 项目

## 项目概述

这是一个使用 Next.js 和 React 构建的现代化网站，采用模块化架构设计，支持多语言、主题切换等功能。

## 技术栈

- **基础库**：React + react-dom（最新稳定版）
- **框架**：Next.js + next-themes（App Router）
- **样式**：TailwindCSS + Radix UI + ShadcnUI 组件库
- **图标**：lucide-react
- **动画**：framer-motion
- **包管理器**：pnpm

## 模块化架构

项目采用模块化架构，将代码按功能和职责划分为不同的模块，提高代码的可维护性、可测试性和可复用性。

### 目录结构

```
src/
  ├── app/                 # Next.js App Router 页面
  │   ├── [lang]/          # 多语言路由
  │   ├── layout.tsx       # 根布局
  │   └── globals.css      # 全局样式
  ├── components/          # 组件库
  │   ├── ui/              # 基础UI组件
  │   ├── features/        # 功能组件
  │   └── layout/          # 布局组件
  ├── contexts/            # React Context 上下文
  ├── hooks/               # 自定义 Hooks
  ├── lib/                 # 工具函数和常量
  │   ├── animations.ts    # 动画配置
  │   ├── constants.ts     # 全局常量
  │   ├── i18n.ts          # 国际化工具
  │   └── utils.ts         # 工具函数
  └── content/             # 内容数据
      ├── en/              # 英文内容（自动生成）
      └── zh/              # 中文内容（源内容）
scripts/
  ├── translate-content.ts # 内容翻译脚本
  ├── next-build-hook.js   # Next.js构建钩子
  └── env.ts               # 环境变量加载工具
```

## 自动翻译功能

本项目实现了自动翻译功能，在构建时会自动将中文内容（`src/content/zh`）翻译为英文内容（`src/content/en`）。开发者只需维护中文版本，英文版本会在构建过程中自动生成。

### 使用方法

1. 复制 `.env.example` 为 `.env.local` 并配置翻译API密钥
2. 只需编辑 `src/content/zh` 目录中的中文内容
3. 运行 `pnpm build` 命令时，系统会自动翻译并生成英文内容

更多详细信息请参阅 [自动翻译功能文档](docs/AUTO_TRANSLATION.md)

## 组件分类

### UI 组件 (`components/ui/`)

基础UI组件是构建用户界面的基本单元，它们是纯展示型、可复用、可组合的组件。

例如：Button, Card, Dialog, Input 等。

### 功能组件 (`components/features/`)

功能组件实现特定的功能或业务逻辑，可能使用多个UI组件，与状态管理交互。

例如：ThemeToggle, LanguageToggle, SearchButton 等。

### 布局组件 (`components/layout/`)

布局组件定义页面的结构和排列，管理空间分配，实现响应式设计。

例如：Navbar, Footer, PageLayout 等。

## 状态管理

项目使用 React Context API 进行状态管理：

- **主题状态**：使用 next-themes 管理明暗主题
- **语言状态**：使用自定义 LanguageContext 管理多语言

## 国际化

项目支持中英文两种语言：

1. **路由**：使用 [lang] 动态路由参数
2. **内容**：在 content 目录中按语言组织内容
3. **UI文本**：使用 i18n.ts 和 useTranslations hook 管理不同语言的UI文本

## 动画系统

动画使用 Framer Motion 实现，并在 `lib/animations.ts` 中集中定义常用动画：

- **页面过渡**：页面切换动画
- **元素动画**：元素进入、退出和交互动画
- **微交互**：按钮点击、悬停等小型交互动画

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 开发服务器

```bash
pnpm dev
```

### 构建项目

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 最佳实践

详细的最佳实践和架构指南请参考 [ARCHITECTURE.md](./docs/ARCHITECTURE.md) 文档。