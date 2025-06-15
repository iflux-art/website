## 项目优化

文件夹分为：blog、docs、tools、navigation、admin

### 当前优化

针对 Next.js + Tailwind CSS v4 + shadcn/ui + Typescript 的最新特性，和项目技术栈的最佳实践，对项目整体进行一次全面的优化

组件冗余：

未优化的性能问题：
features/navigation/navigation-data.ts 文件大小达到867.5KB，需要拆分或优化
features/home/search-box.tsx 高达37.6KB，建议拆分组件
多个较大的组件文件(>8KB)需要考虑拆分：
mdx/typography/code-block.tsx
features/docs/use-docs.ts
features/home/enhanced-background.tsx
类型定义分散：
多个目录下都有独立的types.ts文件，建议统一到src/types目录
潜在的未使用组件：
common/button/travel-button.tsx 较小且独立，需检查使用情况
mdx/mdx-content-wrapper.tsx 过于简单，可能可以合并到其他组件
让我继续检查hooks目录看看是否存在类似问题。
 
完成
列出目录
.\src\hooks
分析完hooks目录，我要继续检查styles目录，但在此之前我发现了以下问题：

Hooks的组织问题：
主hooks目录只有2个文件，但实际上hooks分散在多个功能目录中：
mdx/hooks/use-mdx-content.ts
mdx/hooks/use-mdx-renderer.ts
features/blog/use-blog.ts
features/docs/use-docs.ts
layout/navbar/use-navbar-scroll.ts
features/tools/use-tool-state.ts
features/tools/use-tools.ts
admin/auth/use-auth-state.ts
功能重复：
use-content-data.ts 和 mdx/hooks/use-mdx-content.ts 可能有功能重叠
各个功能模块的状态管理hooks可以考虑统一模式
让我看看styles目录的情况。
 
完成
列出目录
.\src\styles
基于对整个项目的分析，我现在可以提供完整的优化建议：

依赖优化：
移除 Algolia 重复依赖，只保留 algoliasearch
统一 react-markdown 和 next-mdx-remote 的使用
更新不当的版本号（如 tailwindcss 4.1.7）
评估 web-vitals 和 cheerio 的必要性
组件结构优化：
合并重复目录：
将 common/toc 和 layout/toc 合并
统一所有导航相关组件到 components/navigation
拆分大文件：
navigation-data.ts (867.5KB)
search-box.tsx (37.6KB)
code-block.tsx (8.9KB)
Hook 优化：
建立统一的 hooks 目录结构：
将分散的 hooks 统一移动到 src/hooks
按功能分类：auth、content、navigation、ui 等
合并相似 hooks：
合并 use-content-data 和 use-mdx-content
统一状态管理模式
样式优化：
样式文件整合：
将 mdx/typography/styles.css 与主样式目录合并
考虑将 heading.css 和 markdown-link.css 合并到一个 markdown 样式文件
移除重复样式定义
类型定义优化：
统一类型定义：
将分散的 types.ts 文件集中到 src/types 目录
按模块划分类型定义文件
建立类型复用机制
性能优化建议：
实现组件懒加载：
对 features/home/enhanced-background.tsx 等大型组件
MDX 相关组件按需加载
优化数据结构：
拆分 navigation-data.ts
实现数据分页加载
代码质量优化：
统一组件命名规范
提取共用逻辑到工具函数
建立统一的错误处理机制
文件组织优化：
采用特性优先的目录结构
明确组件分类（UI、业务、布局）
统一文件命名规范