/**
 * 内容相关类型定义
 */

/**
 * 内容加载选项类型
 */
export interface ContentLoadOptions {
  /** 是否强制刷新缓存 */
  forceRefresh?: boolean;
  /** 其他可扩展选项 */
  [key: string]: any;
}
