import type { ReactNode } from 'react';
import type { BreadcrumbItem } from './content-types';

/**
 * 页面布局类型枚举
 */
export type PageLayoutType =
  | 'three-column' // 三栏布局：左侧边栏 + 主内容 + 右侧边栏（导航、博客、文档页面）
  | 'full-width'; // 全屏布局：铺满整个容器（首页、友链、关于、管理后台）

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
   * 侧边栏内容
   */
  content: ReactNode;
  /**
   * 侧边栏位置
   */
  position: 'left' | 'right';
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

/**
 * 页面导航配置接口
 */
export interface PageNavigationConfig {
  /**
   * 面包屑导航
   */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * 上一页
   */
  previousPage?: {
    title: string;
    href: string;
  };
  /**
   * 下一页
   */
  nextPage?: {
    title: string;
    href: string;
  };
}

/**
 * 页面元数据生成器选项
 */
export interface PageMetadataOptions {
  /**
   * 页面标题
   */
  title: string;
  /**
   * 页面描述
   */
  description?: string;
  /**
   * 关键词
   */
  keywords?: string[];
  /**
   * 作者
   */
  author?: string;
  /**
   * 页面类型
   */
  type?: 'website' | 'article' | 'blog';
  /**
   * 发布时间
   */
  publishedTime?: string;
  /**
   * 修改时间
   */
  modifiedTime?: string;
  /**
   * 图片URL
   */
  image?: string;
  /**
   * 页面URL
   */
  url?: string;
}

/**
 * 加载状态类型
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * 页面状态接口
 */
export interface PageState {
  /**
   * 加载状态
   */
  loading: LoadingState;
  /**
   * 错误信息
   */
  error?: string | null;
  /**
   * 数据
   */
  data?: any;
}
