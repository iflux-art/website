/**
 * 内容相关公共 Hooks
 */

import { useState, useCallback } from "react";
import type { ContentSearchParams, ContentPageState } from "../types";

/**
 * 内容搜索参数 Hook
 * @param initialParams 初始搜索参数
 * @returns 搜索参数和更新函数
 */
export function useContentSearch(initialParams: Partial<ContentSearchParams> = {}) {
  const [searchParams, setSearchParams] = useState<ContentSearchParams>({
    query: "",
    limit: 10,
    type: "all",
    ...initialParams,
  });

  const updateSearch = useCallback((params: Partial<ContentSearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  }, []);

  return {
    searchParams,
    updateSearch,
  };
}

/**
 * 内容分页状态 Hook
 * @param initialPageState 初始分页状态
 * @returns 分页状态和更新函数
 */
export function useContentPagination(initialPageState: Partial<ContentPageState> = {}) {
  const [pageState, setPageState] = useState<ContentPageState>({
    page: 1,
    limit: 10,
    ...initialPageState,
  });

  const updatePage = useCallback((page: number) => {
    setPageState(prev => ({ ...prev, page }));
  }, []);

  const updateLimit = useCallback((limit: number) => {
    setPageState(prev => ({ ...prev, limit, page: 1 })); // 重置到第一页
  }, []);

  const resetPagination = useCallback(() => {
    setPageState({
      page: 1,
      limit: 10,
      ...initialPageState,
    });
  }, [initialPageState]);

  return {
    pageState,
    updatePage,
    updateLimit,
    resetPagination,
  };
}

/**
 * 内容筛选状态 Hook
 * @param initialFilters 初始筛选条件
 * @returns 筛选状态和更新函数
 */
export function useContentFilter(initialFilters: Partial<ContentPageState> = {}) {
  const [filters, setFilters] = useState<ContentPageState>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const updateFilter = useCallback((filter: Partial<ContentPageState>) => {
    setFilters(prev => ({ ...prev, ...filter }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      ...initialFilters,
    });
  }, [initialFilters]);

  return {
    filters,
    updateFilter,
    clearFilters,
  };
}
