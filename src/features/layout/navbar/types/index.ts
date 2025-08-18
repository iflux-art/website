/**
 * 导航和搜索相关类型定义
 */

import type { ReactNode, ComponentType } from "react";
import type { URL } from "@/types";

/** 基础导航项 */
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

/** 搜索结果 */
export interface SearchResult extends BaseSearchResult {
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
