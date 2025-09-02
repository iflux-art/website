/**
 * API工具模块导出
 */

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
  withErrorHandling,
} from "./api-utils";

// 从 cache-utils 导出
export {
  CACHE_CONFIG,
  generateCacheControl,
  setCacheHeaders,
  getCacheStrategy,
} from "./cache-utils";

// 从 api-client 导出
export type { ApiResponse } from "./api-client";
export {
  apiRequest,
  get,
  post,
  put,
  del,
  patch,
} from "./api-client";
