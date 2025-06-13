/**
 * @file 集中管理hooks相关的类型定义
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
  author?: string;
}

export interface NavigationCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

export interface Link {
  title: string;
  description: string;
  url: string;
  tags?: string[];
}

export interface Subcategory {
  title: string;
  links: Link[];
}

/**
 * 内容数据获取配置选项
 * @interface ContentOptions
 */
export interface ContentOptions {
  /** 
   * 内容类型
   * @required
   */
  type: 'blog' | 'docs';

  /** 
   * API请求的基础路径
   * @required
   */
  path: string;

  /**
   * 完整的API请求URL，如果提供则优先使用此URL而不是path
   * @optional
   */
  url?: string;

  /**
   * 内容分类的唯一标识符
   * @optional
   */
  category?: string | null;

  /**
   * 数据缓存的持续时间，单位为毫秒
   * @optional
   */
  cacheTime?: number;

  /**
   * 是否完全禁用数据缓存功能
   * @optional
   */
  disableCache?: boolean;

  /**
   * API请求的查询参数
   * @optional
   */
  params?: Record<string, string>;

  /**
   * API请求的自定义头部信息
   * @optional
   */
  headers?: HeadersInit;

  /**
   * 请求超时时间，单位为毫秒
   * @optional
   */
  timeout?: number;

  /**
   * 请求失败时的重试次数
   * @optional
   */
  retries?: number;

  /**
   * 是否启用数据自动刷新功能
   * @optional
   */
  autoRefresh?: boolean;

  /**
   * 数据自动刷新的时间间隔，单位为毫秒
   * @optional
   */
  refreshInterval?: number;

  /**
   * 组件挂载时是否立即请求数据
   * @optional
   */
  initialFetch?: boolean;

  /**
   * 自定义错误提示信息
   * @optional
   */
  errorMessage?: string;

  /**
   * 触发数据重新获取的依赖项数组
   * @optional
   */
  dependencies?: unknown[];
}

export interface ContentError {
  message: string;
  code?: string | number;
  details?: unknown;
}

export interface ContentData<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}