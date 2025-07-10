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

// 清理过期缓存的函数
export const cleanExpiredCache = (expiry: number): void => {
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

// 防抖的缓存更新函数
export const debouncedUpdateStorage = debounce((key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error(`Failed to save cache for key ${key}:`, err);
  }
}, 1000);

export type { CacheData, CacheOptions };
