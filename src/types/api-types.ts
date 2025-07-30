/**
 * API 相关类型定义
 * 包含API请求/响应数据结构
 */

/** API 请求状态 */
export interface LoadingState {
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error?: Error | string | null;
}

/** 异步操作结果 */
export interface AsyncResult<T> extends LoadingState {
  /** 数据 */
  data?: T;
  /** 刷新数据方法 */
  refresh?: () => Promise<void>;
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

/** 基础内容接口 */
export interface BaseContent {
  /** 唯一标识 */
  id: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 唯一标识符类型 */
export type ID = string;

/** 时间戳类型 */
export type Timestamp = string | Date;
