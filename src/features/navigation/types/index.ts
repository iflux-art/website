/**
 * Navigation 类型定义
 */

import type { ComponentType, ReactNode } from "react";

// ==================== 面包屑相关类型 ====================

/** 面包屑导航项 */
export interface BreadcrumbItem {
  /** 显示的标签文本 */
  label: string;
  /** 链接地址，如果不提供则显示为纯文本 */
  href?: string;
  /** 是否为当前页面 */
  isCurrent?: boolean;
}

/** 面包屑属性 */
export interface BreadcrumbProps {
  /** 面包屑导航项列表 */
  items: BreadcrumbItem[];
  /** 分隔符，默认为 "/" */
  separator?: string | React.ReactNode;
  /** 额外的CSS类名 */
  className?: string;
}

// ==================== 侧边栏相关类型 ====================

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

/** 侧边栏包装组件属性接口 */
export interface SidebarWrapperProps {
  children: ReactNode;
  config: SidebarConfig;
}

// ==================== 目录相关类型 ====================

/**
 * 目录标题
 */
export interface TocHeading {
  /** 标题ID */
  id: string;
  /** 标题文本 */
  text: string;
  /** 标题级别 */
  level: number;
}

/**
 * 目录 Props
 */
export interface TocProps {
  /** 标题列表 */
  headings: TocHeading[];
  /** 自定义类名 */
  className?: string;
  /** 卡片标题 */
  title?: string;
  /** 是否自适应高度 */
  adaptive?: boolean;
  /** 自适应偏移量 */
  adaptiveOffset?: number;
}

/**
 * 目录卡片 Props
 */
export interface TableOfContentsCardProps {
  /** 标题列表 */
  headings: TocHeading[];
  /** 自定义类名 */
  className?: string;
  /** 卡片标题 */
  title?: string;
}

// ==================== 分页相关类型 ====================

export interface NavDocItem {
  title: string;
  path: string;
  isNext?: boolean;
  [key: string]: unknown;
}

export interface DocPaginationProps {
  prevDoc?: NavDocItem | null;
  nextDoc?: NavDocItem | null;
}

// ==================== 基础导航类型 ====================

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

// ==================== 布局相关类型 ====================

/**
 * 侧边栏配置接口
 * 简化版本，只支持两种布局类型
 */
export interface SidebarConfig {
  /**
   * 侧边栏唯一标识符（可选）
   */
  id?: string;
  /**
   * 侧边栏内容
   */
  content: ReactNode;
  /**
   * 侧边栏位置
   */
  position: "left" | "right";
  /**
   * 是否粘性定位
   */
  sticky?: boolean;
  /**
   * 粘性定位的top值
   */
  stickyTop?: string;
  /**
   * 最大高度
   */
  maxHeight?: string;
  /**
   * 响应式显示设置
   */
  responsive?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
    hideOnDesktop?: boolean;
  };
}
