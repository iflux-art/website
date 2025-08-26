/**
 * 全局文档相关钩子函数
 * @module hooks/use-global-docs
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import type { GlobalDocsStructure } from "./global-docs";

export interface UseGlobalDocsResult {
  /** 全局文档结构数据 */
  structure: GlobalDocsStructure | null;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 重新获取数据 */
  refetch: () => Promise<void>;
}

/**
 * 使用全局文档结构
 *
 * 获取所有文档的完整结构，用于全局导航
 *
 * @returns 全局文档结构和加载状态
 */
// Cache object to store the global docs structure
let globalDocsCache: {
  data: GlobalDocsStructure | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

// Cache validity period (5 minutes)
const CACHE_VALIDITY_MS = 5 * 60 * 1000;

export function useGlobalDocs(): UseGlobalDocsResult {
  const [structure, setStructure] = useState<GlobalDocsStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalDocs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache validity
      const now = Date.now();
      if (globalDocsCache.data && now - globalDocsCache.timestamp < CACHE_VALIDITY_MS) {
        setStructure(globalDocsCache.data);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/docs/global-structure");

      if (!response.ok) {
        throw new Error(`Failed to fetch global docs structure: ${response.statusText}`);
      }

      const data: GlobalDocsStructure = (await response.json()) as GlobalDocsStructure;
      setStructure(data);

      // Update cache
      globalDocsCache = {
        data,
        timestamp: Date.now(),
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching global docs structure:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGlobalDocs();
  }, [fetchGlobalDocs]);

  return {
    structure,
    loading,
    error,
    refetch: fetchGlobalDocs,
  };
}
