/**
 * 内容数据获取配置选项
 */
export interface ContentOptions {
  /** 内容类型 */
  type?: 'blog' | 'docs' | 'journal';

  /** API请求的基础路径 */
  path?: string;

  /** 完整的API请求URL，如果提供则优先使用此URL而不是path */
  url?: string;

  /** 内容分类的唯一标识符 */
  category?: string | null;

  /** 数据缓存的持续时间，单位为毫秒 */
  cacheTime?: number;

  /** 是否完全禁用数据缓存功能 */
  disableCache?: boolean;

  /** API请求的查询参数 */
  params?: Record<string, string>;

  /** API请求的自定义头部信息 */
  headers?: HeadersInit;

  /** 是否启用数据自动刷新功能 */
  autoRefresh?: boolean;

  /** 数据自动刷新的时间间隔，单位为毫秒 */
  refreshInterval?: number;

  /** 组件挂载时是否立即请求数据 */
  initialFetch?: boolean;

  /** 触发数据重新获取的依赖项数组 */
  dependencies?: unknown[];
}

/**
 * 内容错误类型
 */
export interface ContentError {
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code?: string | number;
  /** 错误详情 */
  details?: unknown;
}

/**
 * 内容数据返回类型
 */
export interface ContentData<T> {
  /** 数据 */
  data: T | null;
  /** 刷新方法 */
  refresh: () => Promise<void>;
}
