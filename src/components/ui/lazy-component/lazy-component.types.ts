/**
 * lazy-component 组件类型定义
 */

import React, { ComponentType, ReactNode } from "react";

export interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: ReactNode;
  props?: Record<string, any>;
  fadeIn?: boolean;
  fadeInDuration?: number;
  delayLoad?: number;
  threshold?: number;
  className?: string;
}

export interface LazyComponentOptions {
  /** 自定义加载占位符 */
  fallback?: ReactNode;
  /** 是否启用淡入效果 */
  fadeIn?: boolean;
  /** 淡入动画持续时间(ms) */
  fadeInDuration?: number;
  /** 延迟加载时间(ms) */
  delayLoad?: number;
  /** 可见阈值 0-1 */
  threshold?: number;
  /** 自定义类名 */
  className?: string;
}
