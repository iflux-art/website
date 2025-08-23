/**
 * 网站元数据接口
 */
export interface WebsiteMetadata {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
  author?: string;
  siteName?: string;
  type?: string;
  url?: string;
  language?: string;
}

/**
 * 缓存项接口
 */
export interface CacheItem {
  data: WebsiteMetadata;
  timestamp: number;
}

/**
 * 网站解析选项
 */
export interface ParseOptions {
  timeout?: number;
  useCache?: boolean;
  cacheMaxAge?: number;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * 解析结果接口
 */
export interface ParseResult {
  success: boolean;
  data?: WebsiteMetadata;
  error?: string;
  fromCache?: boolean;
}
