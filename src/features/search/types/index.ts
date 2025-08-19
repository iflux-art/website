/**
 * 搜索相关类型定义
 */

export interface SearchResult {
  type: 'link' | 'blog' | 'doc' | 'tool' | 'command' | 'navigation' | 'history';
  title: string;
  description?: string;
  url?: string;
  path?: string;
  tags?: string[];
}

export interface SearchOptions {
  type?: 'all' | 'links' | 'blog' | 'doc';
  limit?: number;
  includeContent?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  type: string;
}
