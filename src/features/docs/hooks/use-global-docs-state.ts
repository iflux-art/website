/**
 * 全局文档相关钩子函数 (使用 Zustand)
 * @module hooks/use-global-docs-state
 */

"use client";

import { useCallback, useEffect } from "react";
import type { GlobalDocsStructure } from "@/features/docs/components/global-docs";
import { useDocsGlobalStructureStore } from "@/stores";
import type { DocsGlobalStructureStore } from "@/stores/docs-global-structure-store";

// 定义selector函数，避免每次创建新对象
const useGlobalDocsStateSelector = (state: DocsGlobalStructureStore) => state;

export interface UseGlobalDocsStateResult {
  /** 全局文档结构数据 */
  structure: GlobalDocsStructure | null;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 重新获取数据 */
  refetch: () => Promise<void>;
  /** 缓存是否有效 */
  isCacheValid: boolean;
  /** 文档分类 */
  categories: GlobalDocsStructure["categories"] | null;
  /** 所有文档 */
  allDocs: Array<{
    id: string;
    title: string;
    path: string;
    category: string;
  }> | null;
}

/**
 * 使用全局文档结构 (使用 Zustand)
 *
 * 获取所有文档的完整结构，用于全局导航
 *
 * @returns 全局文档结构和加载状态
 */
export function useGlobalDocsState(): UseGlobalDocsStateResult {
  // 从 Zustand store 获取状态和动作 - 选择性订阅
  const store = useDocsGlobalStructureStore(useGlobalDocsStateSelector);

  // 解构需要的状态和动作
  const {
    structure,
    loading,
    error,
    isCacheValid,
    categories,
    allDocs,
    setStructure,
    setLoading,
    setError,
    setTimestamp,
  } = store;

  const fetchGlobalDocs = useCallback(async () => {
    try {
      // 只有在没有数据或缓存无效时才重新获取数据
      if (structure && isCacheValid) {
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetch("/api/docs/global-structure");

      if (!response.ok) {
        throw new Error(`Failed to fetch global docs structure: ${response.statusText}`);
      }

      const data: GlobalDocsStructure = (await response.json()) as GlobalDocsStructure;
      setStructure(data);

      // Update timestamp
      setTimestamp(Date.now());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching global docs structure:", err);
    } finally {
      setLoading(false);
    }
  }, [structure, isCacheValid, setStructure, setLoading, setError, setTimestamp]);

  useEffect(() => {
    void fetchGlobalDocs();
  }, [fetchGlobalDocs]);

  return {
    structure,
    loading,
    error,
    refetch: fetchGlobalDocs,
    isCacheValid,
    categories,
    allDocs,
  };
}
