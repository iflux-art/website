"use client";

import { gridColsMap, gridGapMap } from "@/lib/layout/responsive-utils";
import type { AppGridProps } from "@/types";
import { cn } from "@/utils";
// import React from "react"; // 移除未使用的导入

/**
 * 通用网格布局组件
 * 用于创建响应式的网格布局
 */
export const AppGrid = ({ children, className, columns = 3, gap = "default" }: AppGridProps) => (
  <div className={cn("grid", gridColsMap[columns], gridGapMap[gap], className)}>{children}</div>
);
