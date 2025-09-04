/**
 * Navbar 功能模块类型定义
 */

import type { ComponentType, ReactNode } from "react";

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

/** 侧边栏项目 */
export interface SidebarItem {
  id: string;
  title: string;
  href?: string;
  children?: SidebarItem[];
  isActive?: boolean;
  isExternal?: boolean;
  description?: string;
  icon?: ReactNode;
}

/** 侧边栏属性 */
export interface SidebarProps {
  /** 侧边栏项目列表 */
  items: SidebarItem[];
  /** 当前选中的项目ID */
  currentItem?: string;
  /** 项目点击回调 */
  onItemClick?: (itemId: string) => void;
  /** 自定义类名 */
  className?: string;
  /** 本地存储键前缀 */
  storageKey?: string;
  /** 是否显示全部选项 */
  showAllOption?: boolean;
  /** 全部选项的标题 */
  allOptionTitle?: string;
}

/** 基础导航项 */
export interface BaseNavItem {
  /** 导航项标识 */
  key: string;
  /** 显示标签 */
  label: string;
  /** 链接地址 */
  href?: string;
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

/** 基础搜索结果 */
export interface BaseSearchResult {
  /** 标题 */
  title: string;
  /** 路径 */
  path: string;
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

/** 导航栏搜索结果 */
export interface NavbarSearchResult extends BaseSearchResult {
  /** 结果类型 */
  type: "doc" | "blog" | "navigation" | "tool" | "command" | "history" | "link";
  /** 图标 */
  icon: ReactNode;
  /** 是否为外部链接 */
  isExternal?: boolean;
  /** 点击动作 */
  action?: () => void;
  /** 兼容旧用法：url 字段，等价于 path */
  url?: string;
}
