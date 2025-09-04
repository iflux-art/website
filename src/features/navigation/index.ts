/**
 * Navigation 功能模块统一导出
 *
 * 包含面包屑、目录、侧边栏、分页等导航相关功能的公共组件、类型、工具函数等
 */

// 类型导出
export type {
  // 面包屑相关类型
  BreadcrumbItem,
  BreadcrumbProps,
  // 侧边栏相关类型
  SidebarItem,
  SidebarProps,
  SidebarWrapperProps,
  // 目录相关类型
  TocHeading,
  TocProps,
  TableOfContentsCardProps,
  // 分页相关类型
  NavDocItem,
  DocPaginationProps,
  // 基础导航类型
  BaseNavItem,
  NestedNavItem,
  BaseSearchResult,
  // 布局相关类型
  SidebarConfig,
} from "./types";

// 组件导出
export {
  // 面包屑组件
  Breadcrumb,
} from "./components/breadcrumb";

export {
  // 侧边栏组件
  Sidebar,
  SidebarWrapper,
} from "./components/sidebar";

export {
  // 目录组件
  TableOfContents,
  TableOfContentsCard,
} from "./components/toc";

export {
  // 分页组件
  DocPagination,
} from "./components/pagination";

// Hooks 导出
// export {} from "./hooks";

// 工具函数导出
// export {} from "./lib";
