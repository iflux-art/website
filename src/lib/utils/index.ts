/**
 * 工具函数统一导出
 */

// 样式工具
export { cn } from "@/lib/utils/helpers";

// 文本处理工具
export { countWords, formatReadingTime, slugify } from "@/lib/utils/text";

// DOM 操作工具
export {
  scrollToElement,
  isElementInViewport,
  getElementPosition,
} from "./dom";

// 路由工具
export { buildTagLink, buildCategoryLink } from "@/lib/utils/route";

// 验证工具
export * from "@/lib/utils/validation";

// 现有的通用辅助函数
export * from "@/lib/utils/helpers";
