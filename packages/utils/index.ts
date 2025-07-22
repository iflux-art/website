/**
 * 工具函数统一导出
 */

// 样式工具
export { cn } from "packages/utils/helpers";

// 文本处理工具
export { countWords, formatReadingTime, slugify } from "packages/utils/text";

// DOM 操作工具
export {
  scrollToElement,
  isElementInViewport,
  getElementPosition,
} from "./dom";

// 路由工具
export { buildTagLink, buildCategoryLink } from "packages/utils/route";

// 验证工具
export * from "packages/utils/validation";

// 现有的通用辅助函数
export * from "packages/utils/helpers";
