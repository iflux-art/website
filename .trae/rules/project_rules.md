1. 项目包管理器默认用 pnpm ，非特殊情况，不允许使用其他包管理器
2. 遵循“如无必要，勿增实体”的原则，扁平化管理，模块化组件，避免引入不必要的依赖
3. 主要技术栈为 React + Next.js（App Router） + TailwindCSSTypeScript ，项目管理要符合技术栈最佳实践
4. 样式统一使用 TailwindCSS v4 + shadcn/ui + ，避免使用 CSS 预处理器，图标默认使用 lucide-react
5. 多步操作时，完成每步重要操作，要运行确认，没问题再继续