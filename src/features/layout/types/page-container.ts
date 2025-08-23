/**
 * 页面容器和网格布局相关类型定义
 */

import type { ReactNode } from 'react';
import type { PageContainerConfig, SidebarConfig } from '@/types/page-types';

// AppGrid 相关类型定义
export interface AppGridProps {
  children?: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: 'small' | 'default' | 'large';
}

// PageContainer 相关类型定义
export interface PageContainerProps {
  /**
   * 页面内容
   */
  children: ReactNode;
  /**
   * 页面配置
   */
  config?: PageContainerConfig;
  /**
   * 侧边栏配置数组
   */
  sidebars?: SidebarConfig[];
  /**
   * 自定义类名
   */
  className?: string;
}

// ThreeColumnLayout 相关类型定义
export interface ThreeColumnLayoutProps {
  /**
   * 左侧边栏内容
   */
  leftSidebar?: ReactNode;
  /**
   * 主内容
   */
  children: ReactNode;
  /**
   * 右侧边栏内容
   */
  rightSidebar?: ReactNode;
  /**
   * 自定义类名
   */
  className?: string;
}

// 三栏网格布局相关类型定义
export interface ThreeColumnGridProps {
  children: ReactNode;
  sidebars: SidebarConfig[];
}

// 侧边栏包装组件相关类型定义
export interface SidebarWrapperProps {
  children: ReactNode;
  config: SidebarConfig;
}

// 网格列数样式映射类型
export type GridColsMap = {
  [K in 1 | 2 | 3 | 4 | 5]: string;
};

// 网格间距样式映射类型
export type GridGapMap = {
  [K in 'small' | 'default' | 'large']: string;
};
