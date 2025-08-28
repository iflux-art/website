/**
 * API工具函数导出
 */

// 从 api-utils 导出
export type {
  ApiErrorType,
  ApiErrorResponse,
  ApiSuccessResponse,
  CacheConfig,
} from "./api-utils";
export {
  createApiError,
  createApiSuccess,
  ApiErrors,
  isValidUrl,
  validateRequiredFields,
  withErrorHandling,
} from "./api-utils";

// 从 api-middleware 导出
export type {
  LoggingOptions,
  ValidationOptions,
  MiddlewareResult,
} from "./api-middleware";
export {
  withLogging,
  withValidation,
  withCORS,
} from "./api-middleware";

// 从 api-paths 导出
export {
  CONTENT_API_PATHS,
  BLOG_API_PATHS,
  USER_API_PATHS,
  SEARCH_API_PATHS,
  ANALYTICS_API_PATHS,
  NOTIFICATION_API_PATHS,
  API_PATHS,
} from "./api-paths";
