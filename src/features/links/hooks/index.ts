"use client";

import { loadAllLinksData } from "@/features/links/lib";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCategories } from "./use-categories";
import { useFilterState } from "./use-filter-state";
import { useLinksDataStore } from "@/stores/links-data-store.standard";
import type { LinksDataStore } from "@/stores/links-data-store.standard";
import type { LinksItem } from "@/features/links/types";

// 导入新的缓存管理Hook
import { useLinksCache } from "./use-links-cache";

// 定义selector函数，避免每次创建新对象
// 只选择基本状态，避免选择派生状态以防止无限循环
const useLinksDataSelector = (state: LinksDataStore) => state;

export function useLinksData() {
  // 使用 Zustand store 管理链接数据状态
  const store = useLinksDataStore(useLinksDataSelector);

  // 直接状态管理的备份
  const [directItems, setDirectItems] = useState<LinksItem[]>([]);
  const [isDirectLoading, setIsDirectLoading] = useState(false);

  // 使用新的缓存管理Hook
  const { clearCache } = useLinksCache();

  // 解构需要的状态和动作
  const { items, loading, error, setItems, setLoading, setError, resetState } = store;

  // 使用共享的分类数据 hook
  const { getFilteredCategories, getCategoryName: getCategoryNameFromHook } = useCategories();

  // 使用useRef来存储请求状态，避免重复请求
  const isFetchingRef = useRef(false);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const initialLoadAttemptedRef = useRef(false);

  // 添加强制刷新状态
  const [forceRefresh, setForceRefresh] = useState(false);

  // 尝试直接加载数据作为备份
  useEffect(() => {
    async function loadDirectData() {
      if (directItems.length > 0 && !forceRefresh) {
        return;
      }

      try {
        console.log("=== 直接加载链接数据 ===");
        setIsDirectLoading(true);
        const data = await loadAllLinksData(`direct-${Date.now()}`);
        console.log("直接加载完成，数据条目数:", data.length);
        setDirectItems(data);
      } catch (err) {
        console.error("直接加载数据失败:", err);
      } finally {
        setIsDirectLoading(false);
        setForceRefresh(false);
      }
    }

    void loadDirectData();
  }, [directItems, forceRefresh]); // 修复：使用完整依赖而不是directItems.length

  useEffect(() => {
    async function fetchData() {
      // 检查是否已经尝试过初始加载
      if (initialLoadAttemptedRef.current && items.length > 0 && !forceRefresh) {
        return;
      }

      // 检查是否已经在请求中
      if (isFetchingRef.current) {
        return;
      }

      // 设置已尝试初始加载
      initialLoadAttemptedRef.current = true;

      // 设置正在请求状态
      isFetchingRef.current = true;
      setLoading(true);

      // 生成请求键用于缓存
      const requestKey = generateRequestKey();

      try {
        // 检查是否有正在进行的相同请求
        let fetchPromise = fetchPromiseCache.get(requestKey);
        if (!fetchPromise) {
          console.log("=== 开始通过store加载链接数据 ===");
          // 创建新的请求Promise并缓存
          fetchPromise = loadWithRetry(async () => {
            // 创建AbortController用于取消请求
            fetchControllerRef.current = new AbortController();

            // 加载数据
            const itemsData = await loadAllLinksData(requestKey);
            console.log("加载完成，数据条目数:", itemsData.length);
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

        // 如果没有数据但有备份数据，使用备份数据
        if (itemsData.length === 0 && directItems.length > 0) {
          console.log("使用备份数据:", directItems.length);
          setItems(directItems);
        } else {
          setItems(itemsData);
        }

        // 清除缓存的Promise
        fetchPromiseCache.delete(requestKey);
      } catch (err) {
        console.error("加载数据失败:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        // 如果有备份数据，使用备份数据
        if (directItems.length > 0) {
          console.log("加载失败，使用备份数据:", directItems.length);
          setItems(directItems);
        }
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setForceRefresh(false);
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
  }, [items, setItems, setLoading, setError, forceRefresh, directItems]); // 修复：使用完整依赖而不是长度

  // 使用共享的分类过滤函数
  const filteredCategories = useMemo(() => getFilteredCategories(), [getFilteredCategories]);

  // 决定使用哪些数据进行过滤
  const dataToFilter = useMemo(() => {
    // 如果store中有数据，优先使用store中的数据
    if (items && items.length > 0) {
      return items;
    }

    // 如果store中没有数据但有直接加载的数据，使用直接加载的数据
    if (directItems && directItems.length > 0) {
      return directItems;
    }

    // 都没有数据，返回空数组
    return [];
  }, [items, directItems]); // 修复：使用完整依赖而不是长度

  // 使用useFilterState处理分类和标签过滤
  const {
    filteredItems: stateFilteredItems,
    selectedCategory,
    selectedTag,
    handleTagChange: handleTagClick,
    handleCategoryChange,
    filteredTags: sortedTags,
  } = useFilterState(dataToFilter);

  const handleCategoryClick = (categoryId: string) => {
    handleCategoryChange(categoryId);
  };

  // 使用共享的分类名称获取函数
  const getCategoryName = getCategoryNameFromHook;

  // 计算总数 - 使用派生状态
  const totalFilteredCount = useMemo(() => stateFilteredItems.length, [stateFilteredItems]);

  // 结合状态
  const combinedLoading = loading || isDirectLoading;

  // 确保返回正确的过滤后数据
  const effectiveFilteredItems = useMemo(() => {
    // 如果有选中的分类，返回经过分类筛选的数据
    if (selectedCategory) {
      return stateFilteredItems;
    }

    // 如果没有选中的分类，返回所有非特殊分类的数据
    return (items.length > 0 ? items : directItems).filter(
      item => item.category !== "friends" && item.category !== "profile"
    );
  }, [stateFilteredItems, selectedCategory, items, directItems]); // 修复：使用完整依赖而不是长度

  // 计算派生状态 - 过滤后的项目
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category !== "friends" && item.category !== "profile");
  }, [items]); // 修复：使用完整依赖而不是items.length

  // 计算分类计数
  const categoriesCount = useMemo(() => {
    const count: Record<string, number> = {};
    items.forEach(item => {
      if (item.category) {
        count[item.category] = (count[item.category] || 0) + 1;
      }
    });
    return count;
  }, [items]); // 修复：使用完整依赖而不是items.length

  // 计算标签计数
  const tagsCount = useMemo(() => {
    const count: Record<string, number> = {};
    items.forEach(item => {
      item.tags?.forEach(tag => {
        count[tag] = (count[tag] || 0) + 1;
      });
    });
    return count;
  }, [items]); // 修复：使用完整依赖而不是items.length

  return {
    items: effectiveFilteredItems, // 返回过滤后的数据（用于链接导航页面）
    allItems: items.length > 0 ? items : directItems, // 返回所有原始数据
    categories: filteredCategories, // 返回过滤后的分类
    selectedCategory,
    selectedTag,
    filteredItems: effectiveFilteredItems, // 经过分类筛选的数据
    sortedTags,
    totalFilteredCount,
    loading: combinedLoading,
    error,
    handleCategoryClick,
    handleTagClick,
    getCategoryName,
    // 派生状态
    filteredItemsDerived: filteredItems,
    categoriesCount,
    tagsCount,
    // 提供刷新数据的方法
    refreshData: () => {
      // 清除所有缓存并重新加载数据
      clearCache();
      resetState(); // 重置状态使用正确的方法名
      setItems([]);
      setForceRefresh(true);
    },
  };
}

// 添加导出语句
export { useCategories, useFilterState };

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
