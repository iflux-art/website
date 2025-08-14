"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * 空状态组件属性
 */
interface EmptyStateProps {
  /** 标题文本 */
  title?: string;
  /** 描述文本 */
  description?: string;
  /** 图标 */
  icon?: string;
  /** 自定义类名 */
  className?: string;
  /** 自定义操作按钮 */
  action?: React.ReactNode;
}

/**
 * 空状态提示组件
 *
 * 功能特性：
 * - 友好的空状态提示界面
 * - 可自定义图标、标题和描述
 * - 支持自定义操作按钮
 * - 响应式设计
 */
export function EmptyState({
  title = "暂无内容",
  description = "当前没有相关内容",
  icon = "📝",
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center text-center",
        className,
      )}
    >
      {/* 图标 */}
      <div
        className="mb-4 text-4xl opacity-50"
        role="img"
        aria-label="空状态图标"
      >
        {icon}
      </div>

      {/* 标题 */}
      <h3 className="mb-2 text-lg font-medium text-foreground">{title}</h3>

      {/* 描述 */}
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {/* 自定义操作 */}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
