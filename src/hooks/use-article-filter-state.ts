"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { BlogPost } from "@/features/blog/types";

/**
 * 筛选状态接口
 */
export interface FilterState {
  category: string | null;
  tag: string | null;
}

/**
 * 筛选 Hook 返回值接口
 */
export interface UseArticleFilterReturn {
  filterState: FilterState;
  setCategory: (category: string | null) => void;
  setTag: (tag: string | null) => void;
  clearFilters: () => void;
  filteredArticles: BlogPost[];
}

/**
 * 文章筛选状态管理 Hook
 *
 * 功能特性：
 * - 管理分类和标签筛选状态
 * - URL 查询参数同步功能，支持页面刷新保持筛选状态
 * - 根据选中的分类或标签过滤文章列表
 * - 支持筛选状态的清除
 */
export function useArticleFilterState(
  articles: BlogPost[],
): UseArticleFilterReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从 URL 参数初始化筛选状态
  const [filterState, setFilterState] = useState<FilterState>(() => ({
    category: searchParams.get("category") || null,
    tag: searchParams.get("tag") || null,
  }));

  // 同步 URL 参数变化到本地状态
  useEffect(() => {
    const category = searchParams.get("category") || null;
    const tag = searchParams.get("tag") || null;

    setFilterState((prev) => {
      if (prev.category !== category || prev.tag !== tag) {
        return { category, tag };
      }
      return prev;
    });
  }, [searchParams]);

  // 更新 URL 参数的通用函数
  const updateURL = useCallback(
    (newState: FilterState) => {
      const params = new URLSearchParams();

      if (newState.category) {
        params.set("category", newState.category);
      }

      if (newState.tag) {
        params.set("tag", newState.tag);
      }

      const queryString = params.toString();
      const newURL = queryString ? `/blog?${queryString}` : "/blog";

      router.push(newURL, { scroll: false });
    },
    [router],
  );

  // 设置分类筛选
  const setCategory = useCallback(
    (category: string | null) => {
      const newState: FilterState = {
        category,
        tag: null, // 选择分类时清除标签筛选
      };

      setFilterState(newState);
      updateURL(newState);
    },
    [updateURL],
  );

  // 设置标签筛选
  const setTag = useCallback(
    (tag: string | null) => {
      const newState: FilterState = {
        category: null, // 选择标签时清除分类筛选
        tag,
      };

      setFilterState(newState);
      updateURL(newState);
    },
    [updateURL],
  );

  // 清除所有筛选
  const clearFilters = useCallback(() => {
    const newState: FilterState = {
      category: null,
      tag: null,
    };

    setFilterState(newState);
    router.push("/blog", { scroll: false });
  }, [router]);

  // 根据筛选状态过滤文章
  const filteredArticles = useMemo(() => {
    if (!articles || articles.length === 0) {
      return [];
    }

    let filtered = articles;

    // 按分类筛选
    if (filterState.category) {
      filtered = filtered.filter(
        (article) => article.category === filterState.category,
      );
    }

    // 按标签筛选
    if (filterState.tag) {
      filtered = filtered.filter(
        (article) => article.tags?.includes(filterState.tag!) ?? false,
      );
    }

    return filtered;
  }, [articles, filterState]);

  return {
    filterState,
    setCategory,
    setTag,
    clearFilters,
    filteredArticles,
  };
}
