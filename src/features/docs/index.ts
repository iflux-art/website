/**
 * Docs 功能模块统一导出
 * 集中管理文档功能的所有导出，便于外部引用
 */

// ==================== 组件导出 ====================
export {
  DocPageContainer,
  DocErrorHandler,
  DocsHomePage,
  DocsSidebar,
  DocsSidebarCard,
  DocsSidebarWrapper,
  useGlobalDocs,
  getAllDocsStructure,
  resolveDocumentPath,
  type GlobalDocsStructure,
  type DocCategoryWithDocs,
} from "./components";

// ==================== Hooks 导出 ====================
export {
  useDocCategories,
  useDocMeta,
  useDocContent,
} from "./hooks";

// ==================== 工具函数导出 ====================
export {
  getDirectoryTitle,
  getFirstDocInDirectory,
  createDocBreadcrumbsServer,
  countWords,
  resolveDocPath,
  isRedirectLoop,
} from "./lib";

// ==================== 类型定义导出 ====================
export type {
  DocCategory,
  DocContentBase,
  DocFrontmatter,
  DocItem,
  DocTreeNode,
  DocNavBase,
  SidebarItem,
  NavDocItem,
  DocListItem,
  DocContentResult,
} from "./types";
