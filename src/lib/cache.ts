/**
 * 通用缓存工具
 *
 * 用于缓存各种类型的数据，减少重复请求和处理
 */

// 缓存项接口
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// 缓存存储
const cacheStore = new Map<string, CacheItem<unknown>>();

// 默认缓存过期时间（毫秒）
const DEFAULT_CACHE_EXPIRY = 1000 * 60 * 30; // 30分钟

/**
 * 获取缓存数据
 *
 * @param key 缓存键
 * @param expiry 缓存过期时间（毫秒），默认30分钟
 * @returns 缓存的数据，如果缓存不存在或已过期则返回 null
 */
export function getCache<T>(key: string, expiry: number = DEFAULT_CACHE_EXPIRY): T | null {
  const cached = cacheStore.get(key);

  if (!cached) {
    return null;
  }

  // 检查缓存是否过期
  if (Date.now() - cached.timestamp > expiry) {
    cacheStore.delete(key);
    return null;
  }

  return cached.data as T;
}

/**
 * 设置缓存数据
 *
 * @param key 缓存键
 * @param data 数据
 */
export function setCache<T>(key: string, data: T): void {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * 清除缓存
 *
 * @param key 缓存键，如果不提供则清除所有缓存
 */
export function clearCache(key?: string): void {
  if (key) {
    cacheStore.delete(key);
  } else {
    cacheStore.clear();
  }
}

/**
 * 生成缓存键
 *
 * @param prefix 前缀
 * @param params 参数
 * @returns 缓存键
 */
export function generateCacheKey(prefix: string, params?: Record<string, unknown>): string {
  let key = prefix;

  if (params) {
    // 对参数进行排序，确保相同的参数生成相同的缓存键
    const sortedParams = Object.entries(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join('&');

    key = `${key}?${sortedParams}`;
  }

  return key;
}

/**
 * 带缓存的异步函数执行器
 *
 * @param key 缓存键
 * @param fn 异步函数
 * @param expiry 缓存过期时间（毫秒）
 * @param skipCache 是否跳过缓存
 * @returns 函数执行结果
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  expiry: number = DEFAULT_CACHE_EXPIRY,
  skipCache: boolean = false
): Promise<T> {
  // 如果没有设置跳过缓存，尝试从缓存中获取数据
  if (!skipCache) {
    const cachedData = getCache<T>(key, expiry);
    if (cachedData !== null) {
      return cachedData;
    }
  }

  // 执行函数获取数据
  const data = await fn();

  // 如果没有设置跳过缓存，将数据存入缓存
  if (!skipCache) {
    setCache(key, data);
  }

  return data;
}

// API 缓存相关函数
export const apiCache = {
  /**
   * 获取 API 缓存
   */
  get: <T>(key: string) => getCache<T>(key, 1000 * 60 * 30), // 30分钟

  /**
   * 设置 API 缓存
   */
  set: <T>(key: string, data: T) => setCache(key, data),

  /**
   * 清除 API 缓存
   */
  clear: (key?: string) => clearCache(key),

  /**
   * 生成 API 缓存键
   */
  generateKey: (path: string, params?: Record<string, unknown>) => generateCacheKey(path, params),

  /**
   * 带缓存的 fetch 请求
   */
  fetch: async <T>(
    path: string,
    params?: Record<string, unknown>,
    options?: RequestInit & { skipCache?: boolean }
  ): Promise<T> => {
    const cacheKey = generateCacheKey(path, params);

    return withCache(
      cacheKey,
      async () => {
        // 构建 URL
        let url = path;
        if (params) {
          const queryParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value));
            }
          });

          const queryString = queryParams.toString();
          if (queryString) {
            url = `${url}?${queryString}`;
          }
        }

        // 发送请求
        const response = await fetch(url, options);

        // 检查响应状态
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        // 解析响应数据
        return (await response.json()) as T;
      },
      1000 * 60 * 30, // 30分钟
      options?.skipCache
    );
  },
};

// MDX 缓存相关函数
export const mdxCache = {
  /**
   * 获取 MDX 缓存
   */
  get: (key: string) => getCache<string>(key, 1000 * 60 * 5), // 5分钟

  /**
   * 设置 MDX 缓存
   */
  set: (key: string, html: string) => setCache(key, html),

  /**
   * 清除 MDX 缓存
   */
  clear: (key?: string) => clearCache(key),

  /**
   * 生成 MDX 缓存键
   */
  generateKey: (content: string, options?: Record<string, unknown>) => {
    // 使用内容的哈希值作为缓存键
    const contentHash = hashString(content);

    // 如果有选项，将选项也包含在缓存键中
    if (options) {
      const optionsHash = hashString(JSON.stringify(options));
      return `${contentHash}-${optionsHash}`;
    }

    return contentHash;
  },
};

/**
 * 简单的字符串哈希函数
 *
 * @param str 要哈希的字符串
 * @returns 哈希值
 */
function hashString(str: string): string {
  let hash = 0;

  if (str.length === 0) {
    return hash.toString(16);
  }

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16);
}