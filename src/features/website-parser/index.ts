/**
 * Website Parser 功能模块统一导出
 */

// ==================== 类型定义导出 ====================
export type {
  WebsiteMetadata,
  CacheItem,
  ParseOptions,
  ParseResult,
} from "./types";

// ==================== 工具函数导出 ====================
export {
  parseWebsite,
  parseWebsites,
  clearCache,
  getCacheSize,
} from "./lib/parser";

// ==================== Hooks 导出 ====================
export { useWebsiteParser } from "./hooks";
