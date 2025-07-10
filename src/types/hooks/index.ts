/**
 * Hooks 类型聚合导出
 */

// 通用Hook返回类型
export interface HookResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

// 内容数据 Hooks
export * from "./content-hooks";

// 滚动监听 Hooks
export * from "./scroll-hooks";

// UI 相关 Hooks
export * from "./ui-hooks";
