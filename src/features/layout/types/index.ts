/**
 * Layout 功能相关类型定义
 */

import type { ReactNode } from 'react';

// AppGrid 组件 Props 类型
export interface AppGridProps {
  /**
   * 子元素
   */
  children?: ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 列数
   * @default 3
   */
  columns?: 1 | 2 | 3 | 4 | 5;

  /**
   * 网格间距
   * @default "default"
   */
  gap?: 'small' | 'default' | 'large';
}

// Sidebar 相关类型
export interface SidebarItem {
  id: string;
  title: string;
  href?: string;
  children?: SidebarItem[];
  isActive?: boolean;
  isExternal?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

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
