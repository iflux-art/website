/**
 * 数据缓存管理 Hook
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";

function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number,
): T {
  let timer: NodeJS.Timeout | null = null;
  return ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  }) as T;
}

interface CacheOptions {
  /** 缓存键前缀 */
  prefix?: string;
  /** 缓存过期时间（毫秒） */
  expiry?: number;
  /** 是否使用内存缓存 */
  useMemoryCache?: boolean;
  /** 是否使用本地存储缓存 */
  useLocalStorage?: boolean;
  /** 最大重试次数 */
  maxRetries?: number;
  /** 重试延迟（毫秒） */
  retryDelay?: number;
  /** 内存缓存最大数量 */
  maxCacheSize?: number;
  /** 数据验证函数 */
  validator?: (data: unknown) => boolean;
}

interface CacheData<T> {
  data: T;
  timestamp: number;
  lastAccessed: number;
}

class LRUCache {
  private cache: Map<string, unknown>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): unknown | undefined {
    const item = this.cache.get(key);
    if (item) {
      // 更新访问顺序
      this.cache.delete(key);
      this.cache.set(key, item);
    }
    return item;
  }

  set(key: string, value: unknown): void {
    if (this.cache.size >= this.maxSize) {
      // 删除最久未使用的项
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// 创建内存缓存实例
const memoryCache = new LRUCache(100); // 默认最大缓存100项

/**
 * 使用数据缓存
 *
 * @param key 缓存键
 * @param fetchFn 获取数据的函数
 * @param options 缓存选项
 * @returns 缓存的数据和刷新函数
 *
 * @example
 * ```tsx
 * const { data, loading, refetch } = useCache(
 *   'my-data',
 *   async () => {
 *     const response = await fetch('/api/data');
 *     return response.json();
 *   },
 *   { expiry: 5 * 60 * 1000 } // 5分钟过期
 * );
 * ```
 */
// 清理过期缓存的函数
const cleanExpiredCache = (expiry: number): void => {
  const now = Date.now();

  // 清理 localStorage
  const length = localStorage.length;
  for (let i = 0; i < length; i++) {
    const key = localStorage.key(i);
    // 处理空值和类型检查
    if (typeof key !== "string") continue;
    if (!key.startsWith("app-cache:")) continue;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) continue;

      const cached = JSON.parse(stored);
      if (
        !cached ||
        typeof cached.timestamp !== "number" ||
        now - cached.timestamp > expiry
      ) {
        localStorage.removeItem(key);
      }
    } catch {
      localStorage.removeItem(key);
    }
  }
};

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

  // 防抖的缓存更新函数
  const debouncedUpdateStorage = useCallback(
    debounce((key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.error(`Failed to save cache for key ${key}:`, err);
      }
    }, 1000),
    [],
  );

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
          if (now - cached.timestamp < expiry && validator(cached.data)) {
            // 更新内存缓存
            if (useMemoryCache) {
              memoryCache.set(fullKey, {
                ...cached,
                lastAccessed: now,
              });
            }
            return cached.data;
          }
        } catch (err) {
          console.error(`Failed to parse cache for key ${fullKey}:`, err);
          localStorage.removeItem(fullKey);
        }
      }
    }

    return null;
  }, [fullKey, expiry, useMemoryCache, useLocalStorage, validator]);

  // 更新缓存
  const updateCache = useCallback(
    (newData: T) => {
      if (!validator(newData)) {
        throw new Error("Invalid data format");
      }

      const timestamp = Date.now();
      const cacheData = {
        data: newData,
        timestamp,
        lastAccessed: timestamp,
      };

      // 更新内存缓存
      if (useMemoryCache) {
        memoryCache.set(fullKey, cacheData);
      }

      // 更新本地存储缓存
      if (useLocalStorage) {
        debouncedUpdateStorage(fullKey, JSON.stringify(cacheData));
      }

      setData(newData);
    },
    [
      fullKey,
      useMemoryCache,
      useLocalStorage,
      validator,
      debouncedUpdateStorage,
    ],
  );

  // 获取新数据
  const fetchData = useCallback(
    async (force: boolean = false) => {
      if (!force) {
        const cached = getFromCache();
        if (cached) {
          setData(cached);
          return;
        }
      }

      setLoading(true);
      try {
        const newData = await fetchFn();
        updateCache(newData);
        setError(null);
        retryCount.current = 0;
      } catch (err) {
        console.error(`Failed to fetch data for key ${fullKey}:`, err);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        // 重试逻辑
        if (retryCount.current < maxRetries) {
          retryCount.current++;
          setTimeout(() => {
            fetchData(force);
          }, retryDelay * retryCount.current);
        }
      } finally {
        setLoading(false);
      }
    },
    [fullKey, fetchFn, getFromCache, updateCache, maxRetries, retryDelay],
  );

  // 初始加载
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchData();
    }
  }, [fetchData]);

  // 定期清理过期缓存
  useEffect(() => {
    const cleanup = setInterval(() => {
      cleanExpiredCache(expiry);
    }, expiry);

    return () => clearInterval(cleanup);
  }, [expiry]);

  return {
    data,
    loading,
    error,
    refetch: (force: boolean = true) => fetchData(force),
    clearCache: () => {
      if (useMemoryCache) {
        memoryCache.delete(fullKey);
      }
      if (useLocalStorage) {
        localStorage.removeItem(fullKey);
      }
      setData(null);
    },
  };
}

export type CacheHookResult<T> = ReturnType<typeof useCache<T>>;
