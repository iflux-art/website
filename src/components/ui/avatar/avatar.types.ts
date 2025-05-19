/**
 * avatar 组件类型定义
 */

import * as React from "react";

/**
 * 头像组件属性
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 头像图片地址
   */
  src?: string;
  
  /**
   * 头像替代文本
   */
  alt?: string;
  
  /**
   * 当图片加载失败或没有图片时显示的内容
   */
  fallback?: React.ReactNode;
}

/**
 * 头像图片组件属性
 */
export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

/**
 * 头像备用内容组件属性
 */
export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}
