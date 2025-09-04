import type { ReactNode } from "react";

/**
 * 页面布局类型枚举
 */
export type PageLayoutType =
  | "narrow" // 窄布局：占中间的8列（友链、关于页面）
  | "double-sidebar" // 双侧栏布局：左右侧栏各占2列，中间主内容区占6列（博客列表、博客详情、文档详情页、导航页面）
  | "full-width"; // 宽布局：占满全部的12列（首页）

/**
 * 页面容器配置接口
 */
export interface PageContainerConfig {
  /**
   * 布局类型
   */
  layout?: PageLayoutType;
  /**
   * 是否显示页面头部
   */
  showHeader?: boolean;
  /**
   * 是否显示页面footer
   */
  showFooter?: boolean;
  /**
   * 自定义容器类名
   */
  className?: string;
  /**
   * 最小高度设置
   */
  minHeight?: string;
}

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

/**
 * NotFound组件属性接口
 */
export interface NotFoundProps {
  /**
   * 错误代码，默认为 '404'
   */
  code?: string;
  /**
   * 错误标题
   */
  title?: string;
  /**
   * 错误描述
   */
  description?: string;
  /**
   * 返回按钮文本
   */
  buttonText?: string;
  /**
   * 返回链接地址
   */
  backUrl?: string;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 是否显示图标
   */
  showIcon?: boolean;
}

/**
 * 页面属性接口
 */
export interface PageProps {
  /**
   * 页面参数
   */
  params?: Record<string, string | string[]>;
  /**
   * 搜索参数
   */
  searchParams?: Record<string, string | string[] | undefined>;
}

/**
 * 页面布局属性接口
 */
export interface PageLayoutProps extends PageProps {
  /**
   * 页面内容
   */
  children: ReactNode;
  /**
   * 页面配置
   */
  config?: PageContainerConfig;
  /**
   * 侧边栏配置
   */
  sidebars?: SidebarConfig[];
  /**
   * 页面标题
   */
  title?: string;
  /**
   * 页面描述
   */
  description?: string;
}

// ==================== 页面容器和网格布局相关类型 ====================

/**
 * AppGrid 相关类型定义
 */
export interface AppGridProps {
  children?: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: "small" | "default" | "large";
  rowGap?: string; // 新增：行间距
  columnGap?: string; // 新增：列间距
}

/**
 * PageContainer 组件属性接口
 */
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

/**
 * ThreeColumnLayout 组件属性接口
 */
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

/**
 * 三栏网格布局组件属性接口
 */
export interface ThreeColumnGridProps {
  children: ReactNode;
  sidebars: SidebarConfig[];
}

/**
 * 侧边栏包装组件属性接口
 */
export interface SidebarWrapperProps {
  children: ReactNode;
  config: SidebarConfig;
}

/**
 * 网格列数样式映射类型
 */
export type GridColsMap = {
  [K in 1 | 2 | 3 | 4 | 5]: string;
};

/**
 * 网格间距样式映射类型
 */
export type GridGapMap = {
  [K in "small" | "default" | "large"]: string;
};
