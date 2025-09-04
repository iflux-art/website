/**
 * 统一数据缓存管理 Hook
 * 提供强大的缓存功能，包括数据验证、预取、缓存策略等
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CacheOptions } from "@/types";

/**
 * 增强版LRU缓存类
 */
class EnhancedLRUCache<T> {
  private cache: Map<string, { data: T; timestamp: number; lastAccessed: number }>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (item) {
      // 更新访问顺序和时间
      this.cache.delete(key);
      item.lastAccessed = Date.now();
      this.cache.set(key, item);
      return item.data;
    }
    return null;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      // 删除最久未使用的项
      const entries = Array.from(this.cache.entries());
      if (entries.length > 0) {
        entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
        const firstEntry = entries[0];
        if (firstEntry) {
          const oldestKey = firstEntry[0];
          this.cache.delete(oldestKey);
        }
      }
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  size(): number {
    return this.cache.size;
  }

  // 获取缓存统计信息
  getStats(): { totalItems: number; oldestItemAge: number; newestItemAge: number } {
    const now = Date.now();
    const timestamps = Array.from(this.cache.values()).map(item => item.timestamp);

    return {
      totalItems: this.cache.size,
      oldestItemAge: timestamps.length > 0 ? now - Math.min(...timestamps) : 0,
      newestItemAge: timestamps.length > 0 ? now - Math.max(...timestamps) : 0,
    };
  }
}

interface EnhancedCacheOptions<T> extends CacheOptions<T> {
  /** 缓存预热函数 */
  prefetch?: () => Promise<T>;
  /** 缓存策略 */
  strategy?: "cache-first" | "network-first" | "cache-only" | "network-only";
  /** 是否启用缓存预热 */
  enablePrefetch?: boolean;
  /** 缓存键生成函数 */
  keyGenerator?: (key: string, params?: Record<string, unknown>) => string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  lastAccessed: number;
}

// 创建内存缓存实例
const memoryCache = new EnhancedLRUCache<unknown>(200);

/**
 * 统一数据缓存Hook
 * 结合了基础缓存和高级缓存的功能
 */
export function useCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: EnhancedCacheOptions<T> = {}
) {
  const {
    prefix: optionsPrefix,
    expiry: optionsExpiry,
    useMemoryCache: optionsUseMemoryCache,
    useLocalStorage: optionsUseLocalStorage,
    maxRetries: optionsMaxRetries,
    retryDelay: optionsRetryDelay,
    validator: optionsValidator,
    strategy = "cache-first",
    prefetch,
    enablePrefetch = false,
    keyGenerator,
  } = options;

  // 设置默认值
  const finalPrefix = optionsPrefix ?? "app-cache:";
  const finalExpiry = optionsExpiry ?? 30 * 60 * 1000; // 默认30分钟
  const finalUseMemoryCache = optionsUseMemoryCache ?? true;
  const finalUseLocalStorage = optionsUseLocalStorage ?? true;
  const finalMaxRetries = optionsMaxRetries ?? 3;
  const finalRetryDelay = optionsRetryDelay ?? 1000;
  const finalValidator = optionsValidator ?? (() => true);

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fullKey = keyGenerator ? keyGenerator(key, undefined) : `${finalPrefix}${key}`;
  const initialLoadDone = useRef(false);
  const retryCount = useRef(0);

  // 从内存缓存获取数据
  const getFromMemoryCache = useCallback((): T | null => {
    if (!finalUseMemoryCache) return null;

    const cached = memoryCache.get(fullKey) as CacheEntry<T> | null;
    if (cached && Date.now() - cached.timestamp < finalExpiry && finalValidator(cached.data)) {
      return cached.data;
    }
    return null;
  }, [fullKey, finalExpiry, finalUseMemoryCache, finalValidator]);

  // 从本地存储获取数据
  const getFromLocalStorage = useCallback((): T | null => {
    if (!finalUseLocalStorage) return null;

    const stored = localStorage.getItem(fullKey);
    if (!stored) return null;

    try {
      const cached = JSON.parse(stored) as CacheEntry<T>;
      const now = Date.now();

      if (cached && now - cached.timestamp < finalExpiry && finalValidator(cached.data)) {
        // 更新内存缓存
        if (finalUseMemoryCache) {
          memoryCache.set(fullKey, cached);
        }
        return cached.data;
      }
    } catch {
      // 忽略解析错误
    }

    return null;
  }, [fullKey, finalExpiry, finalUseLocalStorage, finalUseMemoryCache, finalValidator]);

  // 保存数据到缓存
  const saveToCache = useCallback(
    (dataToCache: T) => {
      const now = Date.now();
      const cacheEntry: CacheEntry<T> = {
        data: dataToCache,
        timestamp: now,
        lastAccessed: now,
      };

      // 保存到内存缓存
      if (finalUseMemoryCache) {
        memoryCache.set(fullKey, cacheEntry);
      }

      // 保存到本地存储
      if (finalUseLocalStorage) {
        try {
          localStorage.setItem(fullKey, JSON.stringify(cacheEntry));
        } catch {
          // 忽略存储错误
        }
      }
    },
    [fullKey, finalUseMemoryCache, finalUseLocalStorage]
  );

  // 获取数据（根据策略）
  const getData = useCallback(async (): Promise<T | null> => {
    let cachedData: T | null = null;

    switch (strategy) {
      case "cache-first": {
        // 先从缓存获取
        cachedData = getFromMemoryCache() || getFromLocalStorage();
        if (cachedData) return cachedData;
        // 缓存没有则从网络获取
        break;
      }

      case "network-first": {
        // 先尝试从网络获取
        try {
          const networkData = await fetchFn();
          if (finalValidator(networkData)) {
            saveToCache(networkData);
            return networkData;
          }
        } catch {
          // 网络获取失败，回退到缓存
        }
        // 网络获取失败，从缓存获取
        cachedData = getFromMemoryCache() || getFromLocalStorage();
        if (cachedData) return cachedData;
        break;
      }

      case "cache-only": {
        // 只从缓存获取
        return getFromMemoryCache() || getFromLocalStorage();
      }

      case "network-only": {
        // 只从网络获取
        const networkData = await fetchFn();
        if (finalValidator(networkData)) {
          saveToCache(networkData);
          return networkData;
        }
        break;
      }
    }

    // 默认从网络获取
    const networkData = await fetchFn();
    if (finalValidator(networkData)) {
      saveToCache(networkData);
      return networkData;
    }

    return null;
  }, [strategy, getFromMemoryCache, getFromLocalStorage, fetchFn, finalValidator, saveToCache]);

  // 获取数据（带重试机制）
  const fetchData = useCallback(async (): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const result = await getData();

      if (result !== null) {
        setData(result);
        retryCount.current = 0;
        return result;
      } else {
        throw new Error("数据获取失败");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);

      // 重试逻辑
      if (retryCount.current < finalMaxRetries) {
        retryCount.current++;
        await new Promise(resolve =>
          setTimeout(resolve, finalRetryDelay * 2 ** (retryCount.current - 1))
        );
        return await fetchData();
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, [getData, finalMaxRetries, finalRetryDelay]);

  // 刷新数据
  const refetch = useCallback(async () => {
    try {
      await fetchData();
    } catch {
      // Failed to refetch data
    }
  }, [fetchData]);

  // 清除缓存
  const clearCache = useCallback(() => {
    if (finalUseMemoryCache) {
      memoryCache.delete(fullKey);
    }
    if (finalUseLocalStorage) {
      localStorage.removeItem(fullKey);
    }
    setData(null);
  }, [fullKey, finalUseMemoryCache, finalUseLocalStorage]);

  // 预取数据
  const prefetchData = useCallback(async () => {
    if (!prefetch) return;

    try {
      const prefetchedData = await prefetch();
      if (finalValidator(prefetchedData)) {
        saveToCache(prefetchedData);
      }
    } catch (err) {
      console.warn("Prefetch failed:", err);
    }
  }, [prefetch, finalValidator, saveToCache]);

  // 获取缓存统计信息
  const getCacheStats = useCallback(() => {
    if (finalUseMemoryCache) {
      return memoryCache.getStats();
    }
    return null;
  }, [finalUseMemoryCache]);

  // 初始化加载
  useEffect(() => {
    if (initialLoadDone.current) return;

    // 如果启用了预取，先进行预取
    if (enablePrefetch && prefetch) {
      void prefetchData();
    }

    void fetchData();
    initialLoadDone.current = true;
  }, [fetchData, prefetchData, enablePrefetch, prefetch]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    prefetch: prefetchData,
    getCacheStats,
  };
}

// 为了向后兼容，导出原来的名称
export const useAdvancedCache = useCache;
