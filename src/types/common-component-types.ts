/**
 * 面包屑导航项接口
 */
export interface BreadcrumbItem {
  /**
   * 显示的标签文本
   */
  label: string;
  /**
   * 链接地址，如果不提供则显示为纯文本
   */
  href?: string;
}

// ContentDisplay 相关类型
export type ContentType = "blog" | "docs";
