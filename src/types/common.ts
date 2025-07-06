/**
 * 通用基础类型定义
 * 所有其他类型文件的基础类型来源
 */

import type { ReactNode, ComponentType, CSSProperties } from "react";

// ==================== 基础值类型 ====================

/** 基础标识符类型 */
export type ID = string;

/** 时间戳类型 */
export type Timestamp = string | Date;

/** URL 类型 */
export type URL = string;

/** 颜色值类型 */
export type Color = string;

// ==================== 基础组件类型 ====================

/** 基础组件属性 */
export interface BaseComponentProps {
  /** 子元素 */
  children?: ReactNode;
  /** CSS 类名 */
  className?: string;
  /** 元素 ID */
  id?: string;
  /** 内联样式 */
  style?: CSSProperties;
}

/** 可点击组件属性 */
export interface ClickableProps extends BaseComponentProps {
  /** 点击事件处理函数 */
  onClick?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
}

/** 表单组件属性 */
export interface FormComponentProps extends BaseComponentProps {
  /** 表单字段名称 */
  name?: string;
  /** 是否必填 */
  required?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 占位符文本 */
  placeholder?: string;
}

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

// ==================== API 相关类型 ====================

/** API 响应基础结构 */
export interface ApiResponse<T = unknown> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 错误信息 */
  error?: string;
  /** 错误代码 */
  code?: string | number;
  /** 响应消息 */
  message?: string;
}

/** API 错误类型 */
export interface ApiError {
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code?: string | number;
  /** 错误详情 */
  details?: unknown;
  /** 错误堆栈 */
  stack?: string;
}

// ==================== 配置相关类型 ====================

/** 缓存配置 */
export interface CacheConfig {
  /** 默认缓存时间（毫秒） */
  defaultTtl: number;
  /** 长缓存时间（毫秒） */
  longTtl: number;
  /** 短缓存时间（毫秒） */
  shortTtl: number;
}

/** 主题配置 */
export interface ThemeConfig {
  /** 默认主题 */
  defaultTheme: "light" | "dark" | "system";
  /** 是否启用主题切换 */
  enableToggle: boolean;
  /** 主题存储键名 */
  storageKey: string;
}

// ==================== 导航相关类型 ====================

/** 导航项基础接口 */
export interface BaseNavItem {
  /** 导航项标识 */
  key: string;
  /** 显示标签 */
  label: string;
  /** 链接地址 */
  href?: URL;
  /** 图标 */
  icon?: ComponentType<{ className?: string }> | ReactNode;
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

// ==================== 搜索相关类型 ====================

/** 搜索结果基础接口 */
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

// ==================== 工具函数类型 ====================

/** 深度只读类型 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/** 可选字段类型 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 必需字段类型 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** 排除 null 和 undefined */
export type NonNullable<T> = T extends null | undefined ? never : T;
