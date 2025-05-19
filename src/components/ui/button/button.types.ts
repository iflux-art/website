/**
 * button 组件类型定义
 */

import * as React from "react";
import { VariantProps } from "class-variance-authority";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮变体样式
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

  /**
   * 按钮尺寸
   */
  size?: "default" | "sm" | "lg" | "icon";

  /**
   * 是否将按钮渲染为子元素
   * 当设置为 true 时，按钮将使用 Radix UI 的 Slot 组件渲染子元素
   */
  asChild?: boolean;
}
