/**
 * 数据缓存管理 Hook
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface CacheOptions {
  /** 缓存键前缀 */
  prefix?: string;
  /** 缓存过期时间（毫秒） */
  expiry?: number;
  /** 是否使用内存缓存 */
  useMemoryCache?: boolean;
  /** 是否使用本地存储缓存 */
  useLocalStorage?: boolean;
}

interface CacheStore {
  [key: string]: {
    data: unknown;
    timestamp: number;
  };
}

interface CacheData<T> {
  data: T;
  timestamp: number;
}

// 内存缓存对象
const memoryCache: CacheStore = {};

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
export function useCache<T>(key: string, fetchFn: () => Promise<T>, options: CacheOptions = {}) {
  const {
    prefix = 'app-cache:',
    expiry = 30 * 60 * 1000, // 默认30分钟
    useMemoryCache = true,
    useLocalStorage = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fullKey = `${prefix}${key}`;
  const initialLoadDone = useRef(false);

  // 从缓存获取数据
  const getFromCache = useCallback((): T | null => {
    const now = Date.now();

    // 检查内存缓存
    if (useMemoryCache) {
      const memoryCached = memoryCache[fullKey];
      if (memoryCached && now - memoryCached.timestamp < expiry) {
        return memoryCached.data as T;
      }
    }

    // 检查本地存储缓存
    if (useLocalStorage) {
      const stored = localStorage.getItem(fullKey);
      if (stored) {
        try {
          const cached = JSON.parse(stored) as CacheData<T>;
          if (now - cached.timestamp < expiry) {
            // 更新内存缓存
            if (useMemoryCache) {
              memoryCache[fullKey] = { data: cached.data, timestamp: cached.timestamp };
            }
            return cached.data;
          }
        } catch (err) {
          console.error(`Failed to parse cache for key ${fullKey}:`, err);
        }
      }
    }

    return null;
  }, [fullKey, expiry, useMemoryCache, useLocalStorage]);

  // 更新缓存
  const updateCache = useCallback(
    (newData: T) => {
      const timestamp = Date.now();
      const cacheData = {
        data: newData,
        timestamp,
      };

      // 更新内存缓存
      if (useMemoryCache) {
        memoryCache[fullKey] = cacheData;
      }

      // 更新本地存储缓存
      if (useLocalStorage) {
        try {
          localStorage.setItem(fullKey, JSON.stringify(cacheData));
        } catch (err) {
          console.error(`Failed to save cache for key ${fullKey}:`, err);
        }
      }

      setData(newData);
    },
    [fullKey, useMemoryCache, useLocalStorage]
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
      } catch (err) {
        console.error(`Failed to fetch data for key ${fullKey}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    },
    [fullKey, fetchFn, getFromCache, updateCache]
  );

  // 初始加载
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchData();
    }
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: (force: boolean = true) => fetchData(force),
  };
}
