/**
 * Layout 功能相关类型定义
 */

import type { ReactNode } from 'react';

// Sidebar 相关类型
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

// 导出页面容器相关类型
export * from './page-container';
