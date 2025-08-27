/**
 * 全局共享 Hooks 统一导出
 * 仅导出位于 src/hooks 目录下的共享 hooks
 * 功能特定的 hooks 应从各自的功能模块导出
 */

// ==================== 缓存相关 Hooks ====================
export { useCache } from "./use-cache";

// ==================== 内容数据 Hooks ====================
export { useContentData } from "./use-content-data";
export type {
  HookResult,
  ContentLoadOptions,
} from "./use-content-data";

// ==================== SSR 相关 Hooks ====================
export { useMounted } from "./use-mounted";

// ==================== 标题观察 Hooks ====================
export { useHeadingObserver } from "./use-heading-observer";
export type { Heading } from "@/types";
