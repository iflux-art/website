/**
 * 内容展示相关类型定义
 */

/** 面包屑导航项 */
export interface BreadcrumbItem {
  /** 显示的标签文本 */
  label: string;
  /** 链接地址，如果不提供则显示为纯文本 */
  href?: string;
}
