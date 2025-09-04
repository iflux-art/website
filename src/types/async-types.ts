/**
 * 异步操作相关类型定义
 */

export interface UseAsyncOptions<T> {
  /** 设置加载状态的函数 */
  setLoading?: (loading: boolean) => void;
  /** 设置错误信息的函数 */
  setError?: (error: string | null) => void;
  /** 操作成功时的回调函数 */
  onSuccess?: (data: T) => void;
  /** 操作失败时的回调函数 */
  onError?: (error: unknown) => void;
  /** 内容类型（用于错误处理） */
  contentType?: "blog" | "docs" | "links";
  /** 内容ID（用于错误处理） */
  contentId?: string;
  /** 数据验证函数 */
  validator?: (data: T) => boolean;
}

export interface AsyncOperationResult<T> {
  /** 操作结果数据 */
  data: T | null;
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 重新执行操作的函数 */
  refetch: () => Promise<T | null>;
}

/**
 * 缓存选项类型定义
 */
export interface CacheOptions<T> {
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
  validator?: (data: T) => boolean;
}
