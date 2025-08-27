/**
 * 通用布局组件导出
 * 集中导出所有通用布局组件，便于引用
 */

// 布局结构组件
export { AppGrid } from "./app-grid";
export { PageContainer, type PageContainerProps } from "./page-container";
export { ThreeColumnGrid, type ThreeColumnGridProps } from "./three-column-grid";
export {
  ThreeColumnLayout,
  type ThreeColumnLayoutProps,
  type SidebarConfig,
} from "./three-column-layout";

// 状态和错误处理
export { ProgressBarLoading } from "./progress-bar-loading";
export { NotFound } from "./not-found";

// 导航相关组件
export { Footer } from "./footer";
export { Breadcrumb } from "./breadcrumb";
export { Sidebar, SidebarWrapper } from "./sidebar";

// 配置信息
export { NAV_ITEMS, NAV_PATHS, NAV_DESCRIPTIONS, ADMIN_MENU_ITEMS } from "./navbar/nav-config";

// 客户端初始化组件
export { InitClient } from "./init-client";
