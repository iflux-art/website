import type { ReactNode } from "react";

/**
 * 页面布局类型枚举
 * 简化为只支持一种布局类型：宽布局（默认网格布局）
 */
export type PageLayoutType = "full-width"; // 宽布局：默认网格布局

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
