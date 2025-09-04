/**
 * 内容功能模块统一导出
 *
 * 包含博客和文档等内容相关功能的公共组件、类型、工具函数等
 */

// 类型导出
export type {
  ContentItem,
  ContentCategory,
  ContentSearchResult,
  ContentSearchParams,
  ContentStats,
  ContentPageState,
} from "./types";

// 工具函数导出
export {
  formatDate,
  calculateReadingTime,
  formatNumber,
  debounce,
  throttle,
  groupByCategory,
  groupByTag,
  sortContent,
} from "./lib";

// Hooks 导出
export {
  useContentSearch,
  useContentPagination,
  useContentFilter,
} from "./hooks";

// 组件导出
export {
  ContentCard,
  ContentList,
  // MDX 组件
  ClientMDXRenderer,
  MDXComponents,
  MDXImg,
  MDXLink,
  MDXBlockquote,
  MDXCode,
  MDXPre,
  // 内容展示组件
  ContentDisplay,
  DocPagination,
  // 代码高亮组件
  CodeBlock,
} from "./components";

// 组件类型导出
export type {
  ContentCardProps,
  ContentListProps,
  // 代码高亮组件类型
  CodeBlockProps,
} from "./components";
