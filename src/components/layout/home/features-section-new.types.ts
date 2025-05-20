/**
 * features-section-new 组件类型定义
 */

import { ReactNode } from "react";

/**
 * 特性卡片组件属性
 */
export interface FeatureCardProps {
  /**
   * 图标
   */
  icon?: ReactNode;
  
  /**
   * 标题
   */
  title: string;
  
  /**
   * 描述
   */
  description: string;
  
  /**
   * 链接
   */
  href: string;
  
  /**
   * 索引（用于动画延迟）
   */
  index: number;
  
  /**
   * 是否使用简单样式
   */
  simple?: boolean;
}

/**
 * 特性展示区组件属性
 */
export interface FeaturesSectionProps {
  /**
   * 自定义类名
   */
  className?: string;
  
  /**
   * 是否使用简单样式
   * @default false
   */
  simple?: boolean;
  
  /**
   * 自定义标题
   * @default "探索我们的功能"
   */
  title?: string;
  
  /**
   * 自定义副标题
   * @default "全面的功能和资源，满足您的各种需求"
   */
  subtitle?: string;
}
