"use client";

import { useSafeTool } from "@/hooks/use-safe-state";

/**
 * 工具状态管理 Hook
 *
 * 使用安全状态管理，提供工具页面的状态和操作
 */
export function useToolState() {
  return useSafeTool();
}
