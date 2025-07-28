/**
 * 缓存工具函数
 */

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

// 防抖的缓存更新函数
export const debouncedUpdateStorage = debounce((key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error(`Failed to save cache for key ${key}:`, err);
  }
}, 1000);

export type { CacheData, CacheOptions };
