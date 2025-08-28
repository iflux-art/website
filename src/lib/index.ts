/**
 * 工具函数统一导出
 * 整合所有通用工具函数，避免重复实现
 */

// ==================== 元数据和SEO工具函数 ====================
export {
  generateViewport,
  generateMetadata,
  generateArticleMetadata,
  generateProfileMetadata,
} from "./metadata/metadata";
export {
  generateDocsMetadata,
  generateSEOMetadata,
} from "./metadata/seo-utils"; // 基础元数据生成函数和SEO工具函数

// ==================== API工具函数 ====================
// 从 api-utils 导出
export type {
  ApiErrorType,
  ApiErrorResponse,
  ApiSuccessResponse,
  CacheConfig,
} from "./api/api-utils";
export {
  createApiError,
  createApiSuccess,
  ApiErrors,
  isValidUrl,
  validateRequiredFields,
  withErrorHandling,
} from "./api/api-utils";

// 从 api-middleware 导出
export type {
  LoggingOptions,
  ValidationOptions,
  MiddlewareResult,
} from "./api/api-middleware";
export {
  withLogging,
  withValidation,
  withCORS,
} from "./api/api-middleware";

// 从 api-paths 导出
export {
  CONTENT_API_PATHS,
  BLOG_API_PATHS,
  USER_API_PATHS,
  SEARCH_API_PATHS,
  ANALYTICS_API_PATHS,
  NOTIFICATION_API_PATHS,
  API_PATHS,
} from "./api/api-paths";

// ==================== 错误处理工具函数 ====================
export type { ErrorInfo, LogOptions } from "./error/error-utils";
export {
  classifyError,
  logError,
  handleContentError,
  handleNetworkError,
  getUserFriendlyMessage,
  handleComponentError,
} from "./error/error-utils"; // 统一错误处理工具

// ==================== 布局工具函数 ====================
// 页面容器和网格布局工具函数（直接从布局模块导入）
export {
  getMainContentClasses,
  getSidebarClasses,
  DEFAULT_SIDEBAR_CONFIG,
  THREE_COLUMN_LAYOUT_CONFIG,
  gridColsMap,
  gridGapMap,
} from "@/lib/layout/layout-utils";
export type { GridColsMap, GridGapMap } from "@/types";
