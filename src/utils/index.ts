/**
 * 工具函数统一导出
 * 整合所有通用工具函数，避免重复实现
 */

// ==================== 核心工具函数 ====================
export { cn } from "./core/utils";
export { debounce, debounceSync, filterUndefinedValues } from "./core/helpers";

// ==================== 专用辅助工具函数 ====================
export {
  validatePageParams,
  safeJsonParse,
} from "./helpers/validation-helpers";
export { createPageUrl, isMobileUserAgent } from "./helpers/url-helpers";
export {
  formatPublishTime,
  getLoadingText,
  getErrorText,
} from "./helpers/ui-helpers";
export {
  formatSegmentLabel,
  generateBreadcrumbs,
} from "./helpers/breadcrumb-helpers";
export { countWords } from "./helpers/text-helpers";
export { extractHeadings, type TocHeading } from "./helpers/extract-headings";
