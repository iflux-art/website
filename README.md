## 项目优化

文件夹分为：blog、docs、tools、navigation、admin

### 当前优化

针对 Next.js + Tailwind CSS v4 + shadcn/ui + Typescript 的最新特性，和项目技术栈的最佳实践，对项目整体进行一次全面的优化

组件冗余：

未优化的性能问题：
features/navigation/navigation-data.ts 文件大小达到867.5KB，需要拆分或优化
features/home/search-box.tsx 高达37.6KB，建议拆分组件
