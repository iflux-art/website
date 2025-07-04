## 项目优化

基于 React + Next.js + Typescript + Tailwind CSS + Shadcn/ui + Zod + Zustand + next-mdx-remote/rsc 技术栈最佳实践，对 config、hooks、lib、stores、types、utils 等目录进行优化和重构，移除重复、冗余、冲突、没被实际使用的文件、组件、函数、代码等，尽可能精简项目

## 常用命令：

pnpm format 格式化所有文件
pnpm format:check 检查格式但不修改
pnpm lint 运行 ESLint 检查
npx tsc --noEmit 运行 TypeScript 检查

现在你的 Git 仓库已经配置好了自动代码格式化。每次你执行 git commit 时：

husky 会拦截commit命令
运行 lint-staged
lint-staged 会使用 Prettier 格式化所有暂存的文件
如果格式化成功，提交会继续进行；如果失败，提交会被阻止
你可以通过以下步骤测试配置是否生效：

修改任意文件
使用 git add 添加修改
使用 git commit 提交
当你执行 commit 时，应该会看到 lint-staged 运行并格式化文件。

## 问题

- next-mdx-remote/rsc 和 next-mdx-remote 有区别吗？
- @mdx-js/mdx 和 @mdx-js/react 是一样的吗？
- @next/mdx 、next-mdx-remote/rsc 和  @mdx-js/mdx  这三个依赖有什么区别？