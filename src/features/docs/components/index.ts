/**
 * Docs 功能组件统一导出
 */

// 文档相关组件
export { DocsSidebarWrapper } from "./docs-sidebar-wrapper";
export { DocsSidebarCard } from "./docs-sidebar-card";
export { DocsSidebar } from "./docs-sidebar";
export { useGlobalDocs } from "./use-global-docs";
export {
  getAllDocsStructure,
  resolveDocumentPath,
  type GlobalDocsStructure,
  type DocCategoryWithDocs,
} from "./global-docs";

// 文档首页组件
export { DocsHomePage } from "./docs-home-page";

// 文档页面容器组件
export { DocPageContainer } from "./doc-page-container";

// 文档错误处理组件
export { DocErrorHandler } from "./doc-error-handler";
