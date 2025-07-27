/**
 * 数据缓存管理 Hook
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LRUCache } from "@/hooks/cache/lru-cache";
import {
  CacheData,
  CacheOptions,
  debouncedUpdateStorage,
} from "@/hooks/cache/cache-utils";

// 创建内存缓存实例
const memoryCache = new LRUCache(100); // 默认最大缓存100项

/**
 * 使用数据缓存
 *
 * @param key 缓存键
 * @param fetchFn 获取数据的函数
 * @param options 缓存选项
 * @returns 缓存的数据和控制函数
 */
export function useCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = {},
) {
  const {
    prefix = "app-cache:",
    expiry = 30 * 60 * 1000, // 默认30分钟
    useMemoryCache = true,
    useLocalStorage = true,
    maxRetries = 3,
    retryDelay = 1000,
    validator = () => true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fullKey = `${prefix}${key}`;
  const initialLoadDone = useRef(false);
  const retryCount = useRef(0);

  // 从缓存获取数据
  const getFromCache = useCallback((): T | null => {
    const now = Date.now();

    // 检查内存缓存
    if (useMemoryCache) {
      const memoryCached = memoryCache.get(fullKey) as CacheData<T> | undefined;
      if (memoryCached && now - memoryCached.timestamp < expiry) {
        memoryCached.lastAccessed = now;
        return memoryCached.data;
      }
    }

    // 检查本地存储缓存
    if (useLocalStorage) {
      const stored = localStorage.getItem(fullKey);
      if (stored) {
        try {
          const cached = JSON.parse(stored) as CacheData<T>;
          if (
            cached &&
            now - cached.timestamp < expiry &&
            validator(cached.data)
          ) {
            // 更新内存缓存
            if (useMemoryCache) {
              memoryCache.set(fullKey, cached);
            }
            return cached.data;
          }
        } catch {
          // 忽略解析错误
        }
      }
    }

    return null;
  }, [fullKey, expiry, useMemoryCache, useLocalStorage, validator]);

  // 保存数据到缓存
  const saveToCache = useCallback(
    (data: T) => {
      const now = Date.now();
      const cacheData: CacheData<T> = {
        data,
        timestamp: now,
        lastAccessed: now,
      };

      // 保存到内存缓存
      if (useMemoryCache) {
        memoryCache.set(fullKey, cacheData);
      }

      // 保存到本地存储
      if (useLocalStorage) {
        debouncedUpdateStorage(fullKey, JSON.stringify(cacheData));
      }
    },
    [fullKey, useMemoryCache, useLocalStorage],
  );

  // 获取数据函数
  const fetchData = useCallback(async (): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();

      if (validator(result)) {
        setData(result);
        saveToCache(result);
        retryCount.current = 0;
        return result;
      } else {
        throw new Error("数据验证失败");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      // 重试逻辑
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        setTimeout(() => {
          fetchData();
        }, retryDelay);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, validator, saveToCache, maxRetries, retryDelay]);

  // 刷新数据
  const refetch = useCallback(async () => {
    try {
      await fetchData();
    } catch (err) {
      console.error("Failed to refetch data:", err);
    }
  }, [fetchData]);

  // 清除缓存
  const clearCache = useCallback(() => {
    if (useMemoryCache) {
      memoryCache.delete(fullKey);
    }
    if (useLocalStorage) {
      localStorage.removeItem(fullKey);
    }
    setData(null);
  }, [fullKey, useMemoryCache, useLocalStorage]);

  // 初始化加载
  useEffect(() => {
    if (initialLoadDone.current) return;

    const cachedData = getFromCache();
    if (cachedData !== null) {
      setData(cachedData);
    } else {
      refetch();
    }

    initialLoadDone.current = true;
  }, [getFromCache, refetch]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
  };
}

export type CacheHookResult<T> = ReturnType<typeof useCache<T>>;
