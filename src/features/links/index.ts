/**
 * 链接功能模块导出
 */

// 从 components 导出
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

export type {
  LinksContentProps,
  LinksSidebarProps,
} from "./components";

// 从 hooks 导出
export {
  useLinksData,
  useCategories,
  useFilterState,
} from "./hooks";

// 从 lib 导出
export {
  loadAllLinksData,
  generateCategoriesData,
  categoryStructure,
  clearCategoryCache,
  preloadCriticalCategories,
} from "./lib";

// 从 types 导出
export type {
  CategoryId,
  LinksSubCategory,
  LinksCategory,
  LinksItem,
  LinksFormData,
} from "./types";

// 从 services 导出
export {
  linkService,
  linkDataService,
} from "./services";

export type {
  LinkService,
  LinkDataService,
} from "./services";
