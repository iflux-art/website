/**
 * 通用缓存配置
 */
export const CACHE_CONFIG = {
  /** 默认缓存时间（5分钟） */
  DEFAULT_CACHE_TIME: 5 * 60 * 1000,

  /** 长缓存时间（1小时） */
  LONG_CACHE_TIME: 60 * 60 * 1000,

  /** 短缓存时间（1分钟） */
  SHORT_CACHE_TIME: 60 * 1000,
} as const;

/**
 * 通用Hook返回类型
 */
export interface HookResult<T> {
  /** 数据 */
  data: T | null;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 刷新数据 */
  refresh: () => Promise<void>;
}

/**
 * API路径配置
 */
export const API_PATHS = {
  BLOG: {
    POSTS: '/api/blog/posts',
    TAGS_COUNT: '/api/blog/tags/count',
    CATEGORIES: '/api/blog/categories',
    TIMELINE: '/api/blog/timeline',
  },
  DOCS: {
    CATEGORIES: '/api/docs/categories',
    CATEGORY: (category: string) => `/api/docs/categories/${encodeURIComponent(category)}`,
    META: (path: string) => `/api/docs/${encodeURIComponent(path)}/meta`,
    SIDEBAR: (category: string) => `/api/docs/sidebar/${encodeURIComponent(category)}`,
    CONTENT: (path: string) => `/api/docs/${encodeURIComponent(path)}`,
  },
} as const;
