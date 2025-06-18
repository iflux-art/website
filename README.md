## 项目优化

文件夹分为：blog、docs、tools、navigation、admin

### 当前优化

我们已经完成了所有必要的更改：

移除了 use-content-data.ts 中的 loading 状态管理
移除了 use-journal.ts 中的 loading 状态依赖
优化了 loading.tsx 为服务端组件
现在整个加载流程将由 React Suspense 和 Next.js 的内置加载机制来处理，不再需要手动管理加载状态。页面加载时会自动显示我们的 loading.tsx 组件，然后平滑过渡到实际内容。

所有功能性的状态（如折叠/展开状态、数据缓存等）都保持不变。您需要我检查其他组件吗？

针对 Next.js + Tailwind CSS v4 + shadcn/ui + Typescript 的最新特性，和项目技术栈的最佳实践，对项目整体进行一次全面的优化

组件冗余：

建议继续优化：
考虑将导航按钮也抽象为可复用组件
统一处理加载状态

未优化的性能问题：
features/navigation/navigation-data.ts 文件大小达到867.5KB，需要拆分或优化
features/home/search-box.tsx 高达37.6KB，建议拆分组件

考虑添加 Prettier 配置来统一代码风格
可以添加 Husky 进行 git hooks 管理
使用 git hooks 自动在提交前格式化代码

## 可以使用以下命令：

pnpm format 格式化所有文件
pnpm format:check 检查格式但不修改
pnpm lint 运行 ESLint 检查

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