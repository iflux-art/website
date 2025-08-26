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

## 项目结构

```
.
├── src/
│   ├── app/ - Next.js 应用路由
│   ├── components/ - 共享组件
│   ├── content/ - MDX 内容
│   ├── features/ - 功能模块
│   ├── lib/ - 工具函数
│   ├── middleware.ts - 中间件
│   └── styles/ - 全局样式
├── public/ - 静态资源
├── next.config.mjs - Next.js 配置
└── tailwind.config.mjs - Tailwind 配置
```

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
