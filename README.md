# iFluxArt · 斐流艺创

"斐流艺创" 是 "iFluxArt" 的中文翻译，代表智能技术与艺术创作的有机融合，"斐然成章" 的创作力与 "川流不息" 的技术流。我们致力于通过智能技术推动艺术创作，让创意与技术交融共生。探索未来艺术的可能性，共创数字时代的视觉盛宴。

## 项目概述

这是一个基于 Next.js 15.4 + React 19 + TypeScript 5.9 的现代化网站项目，采用 App Router 架构，集成了最新的 Web 开发技术和最佳实践。

## 技术栈

- **框架**: Next.js 15.4 (App Router)
- **语言**: TypeScript 5.9
- **React**: React 19 (最新RC版本)
- **样式**: Tailwind CSS 3.4 + CSS Modules
- **组件库**: shadcn/ui + Radix UI
- **状态管理**: Zustand 5.0
- **图标**: Lucide React
- **代码质量**: Biome.js
- **测试**: Vitest + React Testing Library
- **部署**: Vercel

## 项目结构

```
.
├── src/                  # 源代码
│   ├── app/              # Next.js 应用路由
│   ├── components/       # 共享组件
│   ├── content/          # MDX 内容
│   ├── features/         # 功能模块
│   ├── lib/              # 工具函数
│   ├── middleware.ts     # 中间件
│   └── styles/           # 全局样式
├── public/               # 静态资源
├── scripts/              # 开发脚本
├── next.config.mjs       # Next.js 配置
└── tailwind.config.mjs   # Tailwind 配置
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

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

## 开发工具

### 代码检查和格式化

```bash
pnpm check
```

这个脚本会使用 Biome.js 检查代码质量和格式问题。

### 自动修复代码问题

```bash
pnpm check:fix
```

### 检查未使用的依赖

```bash
pnpm depcheck
```

这个脚本会检查项目中可能未使用的依赖包。

### 代码质量

#### 运行代码检查

```bash
pnpm check
```

#### 自动修复代码问题

```bash
pnpm check:fix
```

#### 运行TypeScript类型检查

```bash
pnpm type-check
```

### 测试

#### 运行测试

```bash
pnpm test
```

#### 运行测试一次

```bash
pnpm test:run
```

#### 生成测试覆盖率报告

```bash
pnpm test:coverage
```

## 提交代码前的检查清单

在提交代码之前，请确保：

1. 运行 `pnpm check` 确保代码符合规范
2. 运行 `pnpm type-check` 确保没有类型错误
3. 运行 `pnpm test:run` 确保所有测试通过
4. 运行 `pnpm check-project` 进行全面检查

## 项目结构详解

### 核心目录

- `src/app/`: Next.js App Router 路由和页面
- `src/components/`: 共享的UI组件
- `src/features/`: 按功能模块组织的代码
- `src/lib/`: 工具函数和库
- `src/stores/`: Zustand 状态管理
- `src/hooks/`: 自定义 React Hooks
- `src/types/`: TypeScript 类型定义
- `src/services/`: 业务服务层
- `src/config/`: 配置文件

### 功能模块 (src/features/)

每个功能模块包含：
- `components/`: 模块特定的组件
- `hooks/`: 模块特定的Hooks
- `lib/`: 模块特定的工具函数
- `types/`: 模块特定的类型定义
- `services/`: 模块特定的服务

### 状态管理 (src/stores/)

使用 Zustand 进行状态管理，每个模块都有对应的 store。

### 工具函数 (src/lib/)

提供各种工具函数，包括：
- API 工具
- 错误处理
- 布局工具
- 异步操作工具
- 状态管理工具

## 最佳实践

1. 遵循现有的代码风格和规范
2. 组件按功能组织在 `src/features` 目录下
3. 工具函数放在 `src/lib` 目录
4. 类型定义放在 `src/types` 目录
5. 使用TypeScript类型
6. 为组件和函数添加适当的注释
7. 保持组件的小型化和可复用性
8. 使用Zustand进行状态管理
9. 使用Biome进行代码格式化和检查

## 新增工具和功能

### 异步操作工具

项目现在包含统一的异步操作处理工具，可以简化错误处理和加载状态管理：

- `executeAsyncOperation`: 执行异步操作并统一处理加载状态和错误
- `executeWithRetry`: 带重试机制的异步操作执行器

### 状态管理工具

提供标准化的状态管理工具函数，减少重复代码：

- `createStandardStateActions`: 创建标准化的状态操作函数
- `createFilteredStateManager`: 创建带过滤功能的状态管理器
- `createConfigManager`: 创建配置管理器

### API客户端

统一的API客户端，提供标准化的API请求处理：

- `ApiClient`: API客户端类
- `apiClient`: 默认API客户端实例
- 便捷函数: `get`, `post`, `put`, `deleteRequest`, `patch`

### 增强版缓存Hook

提供更强大的缓存功能：

- `useAdvancedCache`: 增强版数据缓存Hook

## 更新日志

有关项目的更新和优化记录，请查看 [CHANGELOG.md](CHANGELOG.md) 文件。