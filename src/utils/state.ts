/**
 * 状态管理工具函数
 * 提供统一的状态管理操作，减少重复代码
 */

import type { UseAsyncOptions } from "@/types";
import { executeAsyncOperation } from "@/utils/async";

/**
 * 创建标准化的状态操作函数
 */
export function createStandardStateActions<T>(
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setData: (data: T) => void
) {
  return {
    /**
     * 执行数据加载操作
     */
    loadData: async (
      fetchFn: () => Promise<T>,
      options: Omit<UseAsyncOptions<T>, "setLoading" | "setError"> = {}
    ): Promise<T | null> => {
      return await executeAsyncOperation(fetchFn, {
        setLoading,
        setError,
        onSuccess: setData,
        ...options,
      });
    },

    /**
     * 执行数据更新操作
     */
    updateData: async (
      updateFn: () => Promise<T>,
      options: Omit<UseAsyncOptions<T>, "setLoading" | "setError"> = {}
    ): Promise<T | null> => {
      return await executeAsyncOperation(updateFn, {
        setLoading,
        setError,
        onSuccess: setData,
        ...options,
      });
    },

    /**
     * 清除状态
     */
    clearState: () => {
      setLoading(false);
      setError(null);
      setData(undefined as unknown as T);
    },

    /**
     * 设置加载状态
     */
    setLoading,

    /**
     * 设置错误状态
     */
    setError,
  };
}

/**
 * 创建带过滤功能的状态管理器
 */
export function createFilteredStateManager<T>(
  items: T[],
  filterFn: (item: T, searchTerm: string) => boolean
) {
  return {
    /**
     * 根据搜索词过滤项目
     */
    filterItems: (searchTerm: string): T[] => {
      if (!searchTerm) {
        return items;
      }

      return items.filter(item => filterFn(item, searchTerm));
    },

    /**
     * 检查是否有数据
     */
    hasData: (): boolean => {
      return items.length > 0;
    },

    /**
     * 获取数据统计信息
     */
    getStats: () => ({
      totalCount: items.length,
    }),
  };
}

/**
 * 创建配置管理器
 */
export function createConfigManager<T>(
  defaultConfig: T,
  currentConfig: T,
  setConfig: (config: T) => void
) {
  return {
    /**
     * 更新配置
     */
    updateConfig: (partialConfig: Partial<T>): void => {
      const newConfig = {
        ...defaultConfig,
        ...currentConfig,
        ...partialConfig,
      } as T;

      setConfig(newConfig);
    },

    /**
     * 重置配置为默认值
     */
    resetConfig: (): void => {
      setConfig({ ...defaultConfig });
    },

    /**
     * 获取配置值
     */
    getConfig: (): T => {
      return currentConfig;
    },
  };
}
