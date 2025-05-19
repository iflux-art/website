/**
 * lazy-image 组件类型定义
 */

import React from "react";
import { ImageProps } from "next/image";

/**
 * 懒加载图片组件属性
 */
export interface LazyImageProps extends Omit<ImageProps, 'loading'> {
  /** 图片索引，用于确定加载优先级 */
  index?: number;
  /** 包装器类名 */
  wrapperClassName?: string;
  /** 占位符类名 */
  placeholderClassName?: string;
  /** 是否启用淡入效果 */
  fadeIn?: boolean;
  /** 淡入动画持续时间(ms) */
  fadeInDuration?: number;
  /** 延迟加载时间(ms) */
  delayLoad?: number;
  /** 可见阈值 0-1 */
  threshold?: number;
}
