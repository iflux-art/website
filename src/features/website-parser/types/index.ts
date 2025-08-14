/**
 * 网址解析相关类型定义
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

export interface ParseOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  userAgent?: string;
}

export interface ParseResult {
  success: boolean;
  data?: WebsiteMetadata;
  error?: string;
}

export interface CacheItem {
  data: WebsiteMetadata;
  timestamp: number;
}
