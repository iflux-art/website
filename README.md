# Web 项目

这是一个基于 Next.js 的全栈应用，包含博客、文档、链接管理等多种功能模块。

## 技术栈

- **核心框架**: Next.js 15.4 (App Router), React 19, TypeScript 5.9
- **样式**: Tailwind CSS, Shadcn/ui, Radix UI
- **图标**: lucide-react
- **状态管理**: Zustand
- **数据获取**: TanStack Query
- **认证**: Clerk
- **包管理**: pnpm
- **测试**: Vitest
- **代码规范**: Biome + Husky

## 开发环境

### 前置要求

- Node.js >= 22.x
- pnpm >= 9.11.0

### 安装依赖

```bash
pnpm install
```

## 常用命令

| 命令                      | 描述                            |
| ------------------------- | ------------------------------- |
| `pnpm dev`                | 启动开发服务器（使用Turbopack） |
| `pnpm build`              | 构建生产版本                    |
| `pnpm start`              | 启动生产服务器                  |
| `pnpm lint`               | 运行代码检查                    |
| `pnpm lint:fix`           | 自动修复代码问题                |
| `pnpm format`             | 格式化代码                      |
| `pnpm format:check`       | 检查代码格式                    |
| `pnpm check`              | 运行代码检查和格式化            |
| `pnpm check:fix`          | 自动修复代码检查和格式化问题    |
| `pnpm type-check`         | 运行TypeScript类型检查          |
| `pnpm test`               | 运行测试                        |
| `pnpm test:run`           | 运行测试一次                    |
| `pnpm test:coverage`      | 生成测试覆盖率报告              |
| `pnpm preview`            | 构建并预览生产版本              |
| `pnpm clean`              | 清理构建文件                    |
| `pnpm update-deps`        | 更新依赖包                      |
| `pnpm update-deps:latest` | 更新所有依赖到最新版本          |

## 开发指南

本文档提供了项目开发过程中的指导和最佳实践。

### 项目检查

项目提供了几个有用的脚本来帮助开发者检查代码质量和项目状态。

#### 运行完整项目检查

```bash
pnpm check-project
```

这个脚本会运行以下检查：
- 未使用的依赖检查
- TypeScript类型检查
- 代码规范检查
- 测试运行

#### 检查未使用的依赖

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

## 部署

项目已配置为支持 Vercel 部署。部署时请注意：

1. 确保环境变量已正确设置
2. 构建命令: `pnpm build`
3. 输出目录: `.next`

## 开发工具推荐

- **性能监控**: Vercel Analytics & Speed Insights
- **错误追踪**: Sentry
- **国际化**: next-i18next
- **SEO优化**: next-seo, next-sitemap
- **字体优化**: next/font

## 贡献指南

1. 提交代码前请运行:

```bash
pnpm check
pnpm test
```

2. 遵循代码规范:
   - 使用TypeScript类型
   - 组件按功能组织
   - 工具函数放在lib目录
   - 类型定义放在types目录
3. 提交信息使用[约定式提交](https://www.conventionalcommits.org/)
4. 重要变更需更新文档和测试

## 项目优化

有关项目优化的详细清单，请查看 [OPTIMIZATION_CHECKLIST.md](OPTIMIZATION_CHECKLIST.md) 文件。

## 更新日志

有关项目的更新和优化记录，请查看 [CHANGELOG.md](CHANGELOG.md) 文件。