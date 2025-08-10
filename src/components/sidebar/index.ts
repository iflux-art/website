// 基础侧边栏组件
export { Sidebar } from "./sidebar";
export type { SidebarProps, SidebarItem } from "./sidebar";

// 文档侧边栏组件
export { DocsSidebar } from "./docs-sidebar";
export { DocsSidebarWrapper } from "./docs-sidebar-wrapper";
export type { DocsSidebarProps } from "./docs-sidebar";
export type { DocsSidebarWrapperProps } from "./docs-sidebar-wrapper";

// 全局文档相关（保持向后兼容）
export { getAllDocsStructure } from "./global-docs";
export { useGlobalDocs } from "./use-global-docs";
export type { GlobalDocsStructure, DocCategoryWithDocs } from "./global-docs";

// 旧组件名称的别名（保持向后兼容）
export { DocsSidebar as GlobalDocsSidebar } from "./docs-sidebar";
export { DocsSidebarWrapper as GlobalDocsSidebarWrapper } from "./docs-sidebar-wrapper";
export type { DocsSidebarProps as GlobalDocsSidebarProps } from "./docs-sidebar";
export type { DocsSidebarWrapperProps as GlobalDocsSidebarWrapperProps } from "./docs-sidebar-wrapper";
