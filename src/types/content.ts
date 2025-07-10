/**
 * 内容相关类型定义
 */

/**
 * 导航文档项目接口
 */
export interface NavDocItem {
  title: string;
  path: string; // Full path, e.g., /docs/category/doc-name
}

/**
 * 内容加载选项类型
 */
export interface ContentOptions {
  /** 是否强制刷新缓存 */
  forceRefresh?: boolean;
  /** 其他可扩展选项 */
  [key: string]: any;
}
