/**
 * 通用布局组件导出
 * 集中导出所有通用布局组件，便于引用
 */

// 布局结构组件
export { AppGrid } from "./app-grid";
export { PageContainer, type PageContainerProps } from "./page-container";
export {
  ThreeColumnGrid,
  type ThreeColumnGridProps,
} from "./three-column-grid";
export {
  ThreeColumnLayout,
  type ThreeColumnLayoutProps,
  type SidebarConfig,
} from "./three-column-layout";

// 新增的多布局组件和响应式网格组件
export { MultiLayout, ThreeColumnLayout as MultiColumnLayout } from "./multi-layout";
export { ResponsiveGrid, ThreeColumnGrid as FlexibleGrid } from "./responsive-grid";

// 状态和错误处理
export { ProgressBarLoading } from "./progress-bar-loading";
export { NotFound } from "./not-found";

// 导航相关组件
export { Footer } from "./footer";
export { Breadcrumb } from "@/features/navigation";
export { Sidebar, SidebarWrapper } from "@/features/navigation";

// 配置信息
export {
  NAV_ITEMS,
  NAV_PATHS,
  NAV_DESCRIPTIONS,
} from "@/features/navbar/components/nav-config";

// 客户端初始化组件
export { InitClient } from "./init-client";
