"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * 加载状态组件属性
 */
interface LoadingStateProps {
  /** 加载文本 */
  text?: string;
  /** 自定义类名 */
  className?: string;
  /** 加载器大小 */
  size?: "small" | "medium" | "large";
  /** 是否显示文本 */
  showText?: boolean;
}

/**
 * 加载状态指示器组件
 *
 * 功能特性：
 * - 旋转加载动画
 * - 可自定义加载文本
 * - 多种尺寸选择
 * - 响应式设计
 * - 可访问性支持
 */
export function LoadingState({
  text = "加载中...",
  className,
  size = "medium",
  showText = true,
}: LoadingStateProps) {
  // 加载器尺寸样式
  const sizeStyles = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  // 文本尺寸样式
  const textSizeStyles = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <div
      className={cn(
        "flex min-h-[200px] items-center justify-center",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="flex items-center gap-3">
        {/* 旋转加载器 */}
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-primary border-t-transparent",
            sizeStyles[size],
          )}
          aria-hidden="true"
        />

        {/* 加载文本 */}
        {showText && (
          <span className={cn("text-muted-foreground", textSizeStyles[size])}>
            {text}
          </span>
        )}
      </div>
    </div>
  );
}
