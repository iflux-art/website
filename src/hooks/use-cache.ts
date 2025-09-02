/**
 * 数据缓存管理 Hook
 */

"use client";

import { debounceSync } from "@/utils/core/helpers";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * LRU 缓存类
 */
class LRUCache {
  private cache: Map<string, unknown>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): unknown {
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

  has(key: string): boolean {
    return this.cache.has(key);
  }

  size(): number {
    return this.cache.size;
  }
}

interface CacheData<T> {
  data: T;
  timestamp: number;
  lastAccessed: number;
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

// 创建内存缓存实例，增加缓存大小
const memoryCache = new LRUCache(200); // 增加到200项

// 防抖的缓存更新函数，减少更新频率
const debouncedUpdateStorage = debounceSync((key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Failed to save cache
  }
}, 2000); // 增加到2秒防抖

/**
 * 从内存缓存获取数据
 */
function getFromMemoryCache<T>(fullKey: string, expiry: number): T | null {
  const memoryCached = memoryCache.get(fullKey) as CacheData<T> | undefined;
  if (memoryCached && Date.now() - memoryCached.timestamp < expiry) {
    memoryCached.lastAccessed = Date.now();
    return memoryCached.data;
  }
  return null;
}

/**
 * 从本地存储获取数据
 */
function getFromLocalStorage<T>(
  fullKey: string,
  expiry: number,
  validator: (data: unknown) => boolean,
  useMemoryCache: boolean
): T | null {
  const stored = localStorage.getItem(fullKey);
  if (!stored) {
    return null;
  }

  try {
    const cached = JSON.parse(stored) as CacheData<T>;
    const now = Date.now();

    if (cached && now - cached.timestamp < expiry && validator(cached.data)) {
      // 更新内存缓存
      if (useMemoryCache) {
        memoryCache.set(fullKey, cached);
      }
      return cached.data;
    }
  } catch {
    // 忽略解析错误
  }

  return null;
}

/**
 * 缓存获取器配置
 */
interface CacheGetterConfig {
  fullKey: string;
  expiry: number;
  useMemoryCache: boolean;
  useLocalStorage: boolean;
  validator: (data: unknown) => boolean;
}

/**
 * 创建缓存获取函数
 */
function createCacheGetter<T>(config: CacheGetterConfig) {
  const { fullKey, expiry, useMemoryCache, useLocalStorage, validator } = config;

  return (): T | null => {
    // 检查内存缓存
    if (useMemoryCache) {
      const memoryData = getFromMemoryCache<T>(fullKey, expiry);
      if (memoryData) {
        return memoryData;
      }
    }

    // 检查本地存储缓存
    if (useLocalStorage) {
      return getFromLocalStorage<T>(fullKey, expiry, validator, useMemoryCache);
    }

    return null;
  };
}

/**
 * 缓存保存器配置
 */
interface CacheSaverConfig {
  fullKey: string;
  useMemoryCache: boolean;
  useLocalStorage: boolean;
}

/**
 * 创建缓存保存函数
 */
function createCacheSaver<T>(config: CacheSaverConfig) {
  const { fullKey, useMemoryCache, useLocalStorage } = config;

  return (data: T) => {
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
  };
}

/**
 * 数据获取器配置
 */
interface DataFetcherConfig<T> {
  fetchFn: () => Promise<T>;
  validator: (data: unknown) => boolean;
  saveToCache: (data: T) => void;
  maxRetries: number;
  retryDelay: number;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setData: (data: T) => void;
  retryCount: React.MutableRefObject<number>;
}

/**
 * 创建数据获取函数
 */
function createDataFetcher<T>(config: DataFetcherConfig<T>) {
  const {
    fetchFn,
    validator,
    saveToCache,
    maxRetries,
    retryDelay,
    setLoading,
    setError,
    setData,
    retryCount,
  } = config;

  return async (): Promise<T> => {
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
          void createDataFetcher(config)();
        }, retryDelay);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };
}

/**
 * 使用数据缓存
 *
 * @param key 缓存键
 * @param fetchFn 获取数据的函数
 * @param options 缓存选项
 * @returns 缓存的数据和控制函数
 */
export function useCache<T>(key: string, fetchFn: () => Promise<T>, options: CacheOptions = {}) {
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

  const getFromCache = createCacheGetter<T>({
    fullKey,
    expiry,
    useMemoryCache,
    useLocalStorage,
    validator,
  });
  const saveToCache = createCacheSaver<T>({
    fullKey,
    useMemoryCache,
    useLocalStorage,
  });
  const fetchData = createDataFetcher({
    fetchFn,
    validator,
    saveToCache,
    maxRetries,
    retryDelay,
    setLoading,
    setError,
    setData,
    retryCount,
  });

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
      void refetch();
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
