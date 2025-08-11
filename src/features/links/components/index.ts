/**
 * Links 功能组件统一导出
 */

// 链接相关组件
export { LinksSidebar } from "./links/links-sidebar";
export { LinksContent } from "./links/links-content";
export { LinksForm } from "./links/links-form";
export { DataTable } from "./links/data-table";
export { LinkCard } from "./link-card";

// 表格配置
export {
  getTableColumns,
  getTableActions,
  getPageActions,
} from "./links/table-config";

// 导出类型
export type { LinksContentProps } from "./links/links-content";
export type { LinksSidebarProps } from "./links/links-sidebar";
