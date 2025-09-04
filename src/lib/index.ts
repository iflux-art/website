/**
 * 工具函数统一导出
 */

// API工具
export {
  createApiSuccess,
  withValidation,
  withRateLimit,
  runMiddleware,
  withPublicApi,
  withErrorHandling,
  isValidUrl,
  validateRequiredFields,
} from "./api";

// 错误处理工具
export type { ErrorInfo, LogOptions } from "./error";
export {
  classifyError,
  logError,
  handleContentError,
  handleNetworkError,
  getUserFriendlyMessage,
  handleComponentError,
} from "./error";

// 布局工具
export { getContainerClassName } from "./layout/layout-utils";

// 异步操作工具
export { executeAsyncOperation, executeWithRetry } from "@/utils/async";

// 状态管理工具
export {
  createStandardStateActions,
  createFilteredStateManager,
  createConfigManager,
} from "@/utils/state";

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
} from "./metadata/seo-utils";

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
  ApiErrors,
  withErrorHandling as apiWithErrorHandling,
} from "./api/api-utils";

// 从 api-middleware 导出
export type {
  LoggingOptions,
  ValidationOptions,
  MiddlewareResult,
} from "./api/api-middleware";
export {
  withLogging,
  withValidation as apiWithValidation,
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
