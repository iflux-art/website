/**
 * 全局文档相关钩子函数
 * @module hooks/use-global-docs
 */

"use client";

import { useState, useEffect } from "react";
import { GlobalDocsStructure } from "@/components/sidebar/global-docs";

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
export function useGlobalDocs(): UseGlobalDocsResult {
  const [structure, setStructure] = useState<GlobalDocsStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalDocs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/docs/global-structure");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch global docs structure: ${response.statusText}`,
        );
      }

      const data = await response.json();
      setStructure(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching global docs structure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalDocs();
  }, []);

  return {
    structure,
    loading,
    error,
    refetch: fetchGlobalDocs,
  };
}
