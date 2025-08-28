/**
 * Links 功能模块统一导出
 * 集中管理链接功能的所有导出，便于外部引用
 */

// ==================== 组件导出 ====================
export {
  LinksSidebar,
  LinksSidebarCard,
  LinksContent,
  LinksForm,
  DataTable,
  LinkCard,
  LinksPageContainer,
  ProfilePageContainer,
  getTableColumns,
  getTableActions,
  getPageActions,
} from "./components";
export type { LinksContentProps, LinksSidebarProps } from "./components";

// ==================== Hooks 导出 ====================
export { useLinksData } from "./hooks";

// ==================== 工具函数导出 ====================
export {
  loadAllLinksData,
  generateCategoriesData,
  categoryStructure,
} from "./lib";

// ==================== 类型定义导出 ====================
export type {
  CategoryId,
  LinksSubCategory,
  LinksCategory,
  LinksItem,
  LinksFormData,
} from "./types";
