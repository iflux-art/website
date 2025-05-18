1. 包管理器默认用 pnpm
   - 依赖用最新稳定版本，不使用 beta 版本，不回退到低版本
   - 禁止使用 npm 或 yarn
   - lockfile 必须提交到代码仓库

2. Javascript 技术栈规范
   - 基础库：React + react-dom（最新稳定版）
   - 框架：Next.js + next-themes（App Router）
   - 样式：TailwindCSS + Radix UI + ShadcnUI 组件库
   - 图标：lucide-react（统一图标风格）
   - 代码规范：
     - TypeScript 严格模式
     - ESLint + Prettier 配置
     - 遵循 Airbnb Style Guide
   - 状态管理：根据项目规模选择 Context/Zustand/Jotai
   - 测试框架：Jest + React Testing Library
   - 构建工具：Turborepo（适用于 Monorepo）

3. 开发规范
   - 组件采用函数式编程
   - 遵循 React Hooks 最佳实践
   - 页面性能优化（分包、懒加载等）
   - 确保代码可访问性（WCAG 2.1）

4. 部署规范
   - 使用 Vercel 进行部署
   - 配置环境变量和配置文件
   - 确保部署过程中没有错误

5. 文档规范
   - 编写清晰的 README.md 文件
   - 使用 Markdown 语法
   - 包含项目介绍、安装指南、使用示例等内容