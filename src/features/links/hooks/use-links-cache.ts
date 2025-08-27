/**
 * 链接数据缓存管理 Hook
 * 提供更精细的链接数据缓存控制和管理功能
 */

import { useCallback } from "react";
import { clearCategoryCache, preloadCriticalCategories } from "@/features/links/lib";
import type { CategoryId } from "@/features/links/types";

/**
 * 链接数据缓存管理 Hook 返回值接口
 */
interface UseLinksCacheReturn {
  /**
   * 清除指定分类的缓存
   * @param categoryId 分类ID，如果不提供则清除所有缓存
   */
  clearCache: (categoryId?: CategoryId) => void;

  /**
   * 预加载关键分类数据
   */
  preloadCritical: () => Promise<void>;

  /**
   * 刷新指定分类的数据
   * @param categoryId 分类ID
   */
  refreshCategory: (categoryId: CategoryId) => void;
}

/**
 * 链接数据缓存管理 Hook
 * 提供缓存控制、预加载和刷新功能
 */
export function useLinksCache(): UseLinksCacheReturn {
  /**
   * 清除缓存
   */
  const clearCache = useCallback((categoryId?: CategoryId) => {
    clearCategoryCache(categoryId);
  }, []);

  /**
   * 预加载关键分类
   */
  const preloadCritical = useCallback(async () => {
    await preloadCriticalCategories();
  }, []);

  /**
   * 刷新指定分类的数据
   */
  const refreshCategory = useCallback((categoryId: CategoryId) => {
    // 清除该分类的缓存
    clearCategoryCache(categoryId);

    // 触发重新加载（实际的重新加载会在下次请求数据时发生）
    // 这里可以考虑添加事件系统通知相关组件重新加载数据
  }, []);

  return {
    clearCache,
    preloadCritical,
    refreshCategory,
  };
}
