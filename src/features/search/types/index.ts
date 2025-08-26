/**
 * 搜索相关类型定义
 */

export interface SearchResult {
  type: "link" | "blog" | "doc" | "tool" | "command" | "navigation" | "history";
  title: string;
  description?: string;
  url?: string;
  path?: string;
  tags?: string[];
  /** 摘要（用于高级搜索结果） */
  excerpt?: string;
  /** 相关性评分 */
  score?: number;
  /** 是否为外部链接 */
  isExternal?: boolean;
  /** 高亮信息 */
  highlights?: {
    title?: string;
    content?: string[];
  };
}

export interface SearchOptions {
  type?: "all" | "links" | "blog" | "doc" | "docs";
  limit?: number;
  includeContent?: boolean;
  useCache?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  type: string;
}
