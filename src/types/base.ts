/**
 * 基础类型定义
 */

/**
 * 基础内容接口
 */
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
  date?: string;
}

/**
 * 基础分类接口
 */
export interface BaseCategory {
  /** 分类唯一标识 */
  id: string;
  /** 分类标题 */
  title: string;
  /** 分类描述 */
  description: string;
  /** 分类下的内容数量 */
  count?: number;
}

/**
 * 基础元数据接口
 */
export interface BaseMeta {
  [key: string]: string | unknown;
}

/**
 * 通用处理状态接口
 */
export interface ProcessingState {
  /** 是否正在处理中 */
  isProcessing: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 已处理数量 */
  processedCount: number;
  /** 总数量 */
  totalCount: number;
  /** 剩余任务数 */
  remainingTasks: number;
  /** 失败任务数 */
  failedTasks: number;
  /** 平均处理时间 */
  averageProcessingTime: number;
}
