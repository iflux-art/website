"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * 通用网格布局组件属性
 */
export interface AppGridProps {
  /**
   * 子元素
   */
  children?: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 列数
   * @default 3
   */
  columns?: 1 | 2 | 3 | 4 | 5;

  /**
   * 网格间距
   * @default "default"
   */
  gap?: "small" | "default" | "large";
}

/**
 * 通用网格布局组件
 *
 * 用于创建响应式的网格布局
 *
 * @example
 * ```tsx
 * <AppGrid columns={3}>
 *   <Card>内容1</Card>
 *   <Card>内容2</Card>
 *   <Card>内容3</Card>
 * </AppGrid>
 * ```
 */
export function AppGrid({
  children,
  className,
  columns = 3,
  gap = "default",
}: AppGridProps) {
  // 网格列数样式
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  };

  // 网格间距样式
  const gridGap = {
    small: "gap-3",
    default: "gap-6",
    large: "gap-8",
  };

  return (
    <div
      className={cn("my-8 grid", gridCols[columns], gridGap[gap], className)}
    >
      {children}
    </div>
  );
}
