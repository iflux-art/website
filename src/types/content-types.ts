/**
 * 内容相关类型定义
 *
 * 包含跨功能模块使用的内容类型。
 * 这些类型从功能模块中提升到全局类型目录，供多个功能模块共享使用。
 *
 * 主要类型：
 * - BreadcrumbItem: 面包屑导航项
 * - Heading: 文档标题结构
 *
 * @author 系统重构
 * @since 2024
 */

/** 面包屑导航项 */
export interface BreadcrumbItem {
  /** 显示的标签文本 */
  label: string;
  /** 链接地址，如果不提供则显示为纯文本 */
  href?: string;
  /** 是否为当前页面 */
  isCurrent?: boolean;
}

/** 文档标题结构 */
export interface Heading {
  level: number;
  text: string;
  id: string;
}
