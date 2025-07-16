/**
 * 数据状态类型定义
 * 包含加载状态、分页、内容基础类型等
 */

import type { ID, Timestamp, URL } from "packages/src/types/base-types";

// ==================== 数据状态类型 ====================

/** 加载状态 */
export interface LoadingState {
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: Error | string | null;
}

/** 异步操作结果 */
export interface AsyncResult<T> extends LoadingState {
  /** 数据 */
  data: T | null;
  /** 刷新数据方法 */
  refresh: () => Promise<void>;
}

/** 分页信息 */
export interface PaginationInfo {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总数量 */
  total: number;
  /** 总页数 */
  totalPages: number;
  /** 是否有下一页 */
  hasNext: boolean;
  /** 是否有上一页 */
  hasPrev: boolean;
}

/** 分页数据 */
export interface PaginatedData<T> {
  /** 数据列表 */
  items: T[];
  /** 分页信息 */
  pagination: PaginationInfo;
}

// ==================== 内容基础类型 ====================

/** 基础 Frontmatter 类型 */
export interface BaseFrontmatter {
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 发布日期 */
  date?: Timestamp;
  /** 标签列表 */
  tags?: string[];
  /** 是否为草稿 */
  draft?: boolean;
  /** 分类 */
  category?: string;
  /** 作者 */
  author?: string;
  /** 封面图片 */
  image?: URL;
  /** URL 路径 */
  slug?: string;
  /** 最后修改时间 */
  lastModified?: Timestamp;
  /** 字数统计 */
  wordCount?: number;
  /** SEO 相关数据 */
  seo?: Record<string, unknown>;
}

/** 基础内容接口 */
export interface BaseContent {
  /** 唯一标识（URL路径） */
  slug: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 标签列表 */
  tags?: string[];
  /** 发布日期 */
  date?: Timestamp;
  /** 分类 */
  category?: string;
}

/** 基础分类接口 */
export interface BaseCategory {
  /** 分类唯一标识 */
  id: ID;
  /** 分类标题 */
  title: string;
  /** 分类描述 */
  description: string;
  /** 分类下的内容数量 */
  count?: number;
  /** 排序权重 */
  order?: number;
}

// ==================== 导航基础类型 ====================

/** 基础导航项 */
export interface BaseNavItem {
  /** 导航项标识 */
  key: string;
  /** 显示标签 */
  label: string;
  /** 链接地址 */
  href?: URL;
  /** 图标 */
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  /** 是否为外部链接 */
  external?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}

/** 嵌套导航项 */
export interface NestedNavItem extends BaseNavItem {
  /** 子导航项 */
  children?: NestedNavItem[];
  /** 是否默认展开 */
  defaultOpen?: boolean;
}

// ==================== 搜索基础类型 ====================

/** 基础搜索结果 */
export interface BaseSearchResult {
  /** 标题 */
  title: string;
  /** 路径 */
  path: URL;
  /** 摘要 */
  excerpt: string;
  /** 类型 */
  type: string;
  /** 相关性评分 */
  score?: number;
  /** 高亮信息 */
  highlights?: {
    title?: string;
    content?: string[];
  };
}
