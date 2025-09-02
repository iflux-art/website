/**
 * 专用辅助工具函数导出
 */

export { createPageUrl, isMobileUserAgent } from "./url-helpers";
export { formatPublishTime, getLoadingText, getErrorText } from "./ui-helpers";
export { formatSegmentLabel, generateBreadcrumbs } from "./breadcrumb-helpers";
export { countWords } from "./text-helpers";
export { extractHeadings, type TocHeading } from "./extract-headings";

// 从 core/helpers 导入 debounceSync 函数以保持向后兼容性
export { debounceSync } from "../core/helpers";
