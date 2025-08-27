"use client";

import { loadAllLinksData } from "@/features/links/lib";
import { useEffect, useMemo, useRef } from "react";
import { useCategories } from "./use-categories";
import { useFilterState } from "./use-filter-state";
import { useLinksDataStore } from "@/stores";
import type { LinksDataStore } from "@/stores/links-data-store";
import type { LinksItem } from "@/features/links/types";

// 导入新的缓存管理Hook
import { useLinksCache } from "./use-links-cache";

// 定义selector函数，避免每次创建新对象
const useLinksDataSelector = (state: LinksDataStore) => state;

// 创建一个全局的Promise缓存，用于请求去重
const fetchPromiseCache = new Map<string, Promise<LinksItem[]>>();

// 错误重试配置
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * 带重试机制的数据加载函数
 */
async function loadWithRetry(
  loadFn: () => Promise<LinksItem[]>,
  retries = 0
): Promise<LinksItem[]> {
  try {
    return await loadFn();
  } catch (error) {
    if (retries < MAX_RETRIES) {
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * 2 ** retries));
      return loadWithRetry(loadFn, retries + 1);
    }
    throw error;
  }
}

/**
 * 生成请求缓存键
 */
function generateRequestKey(): string {
  return `links_data_${Date.now()}`;
}

export function useLinksData() {
  // 使用 Zustand store 管理链接数据状态
  const store = useLinksDataStore(useLinksDataSelector);

  // 使用新的缓存管理Hook
  const { clearCache } = useLinksCache();

  // 解构需要的状态和动作
  const { items, loading, error, filteredItems, setItems, setLoading, setError } = store;

  // 使用共享的分类数据 hook
  const { getCategoryName: getCategoryNameFromHook, getFilteredCategories } = useCategories();

  // 使用useRef来存储请求状态，避免重复请求
  const isFetchingRef = useRef(false);
  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    async function fetchData() {
      // 检查是否已经在请求中
      if (isFetchingRef.current) {
        return;
      }

      // 只有在没有数据或有错误时才重新获取数据
      if (items.length > 0 && !error) {
        return;
      }

      // 设置正在请求状态
      isFetchingRef.current = true;
      setLoading(true);

      // 生成请求键用于缓存
      const requestKey = generateRequestKey();

      try {
        // 检查是否有正在进行的相同请求
        let fetchPromise = fetchPromiseCache.get(requestKey);
        if (!fetchPromise) {
          // 创建新的请求Promise并缓存
          fetchPromise = loadWithRetry(async () => {
            // 创建AbortController用于取消请求
            fetchControllerRef.current = new AbortController();

            // 加载数据
            const itemsData = await loadAllLinksData(requestKey);
            return itemsData;
          });

          // 缓存Promise
          fetchPromiseCache.set(requestKey, fetchPromise);

          // 设置缓存过期时间
          setTimeout(
            () => {
              fetchPromiseCache.delete(requestKey);
            },
            5 * 60 * 1000
          ); // 5分钟过期
        }

        // 等待数据加载完成
        const itemsData = await fetchPromise;
        setItems(itemsData);

        // 清除缓存的Promise
        fetchPromiseCache.delete(requestKey);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    }

    void fetchData();

    // 清理函数
    return () => {
      // 取消正在进行的请求
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
      isFetchingRef.current = false;
    };
  }, [items.length, error, setItems, setLoading, setError]);

  // 使用共享的分类过滤函数
  const filteredCategories = useMemo(() => getFilteredCategories(), [getFilteredCategories]);

  // 使用useFilterState处理分类和标签过滤
  // 修改：传入 filteredItems 而不是 categoryFilteredItems，确保分类筛选基于所有可用的链接数据
  const {
    filteredItems: stateFilteredItems,
    selectedCategory,
    selectedTag,
    handleTagChange: handleTagClick,
    handleCategoryChange,
    filteredTags: sortedTags,
  } = useFilterState(filteredItems);

  const handleCategoryClick = (categoryId: string) => {
    handleCategoryChange(categoryId);
  };

  // 使用共享的分类名称获取函数
  const getCategoryName = getCategoryNameFromHook;

  // 计算总数 - 使用派生状态
  const totalFilteredCount = useMemo(() => stateFilteredItems.length, [stateFilteredItems]);

  return {
    items: stateFilteredItems, // 返回过滤后的数据（用于链接导航页面）
    allItems: items, // 返回所有原始数据（用于友链和关于页面）
    categories: filteredCategories, // 返回过滤后的分类
    selectedCategory,
    selectedTag,
    filteredItems: stateFilteredItems, // 经过分类筛选的数据
    sortedTags,
    totalFilteredCount,
    loading,
    error,
    handleCategoryClick,
    handleTagClick,
    getCategoryName,
    // 提供刷新数据的方法
    refreshData: () => {
      // 清除所有缓存并重新加载数据
      clearCache();
      setItems([]); // 清空现有数据触发重新加载
    },
  };
}
