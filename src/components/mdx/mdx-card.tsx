"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MDXStyles } from "@/config/mdx/styles";

interface MDXCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  hoverable?: boolean;
}

/**
 * MDX 卡片容器组件
 * - 支持标题和描述
 * - 可选图标
 * - 多种变体样式
 * - 可选悬停效果
 * - 响应式设计
 */
export const MDXCard = ({
  children,
  title,
  description,
  icon,
  className,
  variant = "default",
  size = "md",
  hoverable = false,
}: MDXCardProps) => {
  // 基础样式
  const baseStyles = "rounded-lg transition-all duration-200";

  // 变体样式
  const variantStyles = {
    default: "bg-white dark:bg-gray-800 shadow-sm",
    outline: "border border-gray-200 dark:border-gray-700",
    ghost: "bg-transparent",
  };

  // 尺寸样式
  const sizeStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  // 悬停效果
  const hoverStyles = hoverable
    ? "hover:shadow-md hover:transform hover:-translate-y-1"
    : "";

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        hoverStyles,
        className,
      )}
    >
      {/* 卡片头部 */}
      {(title || icon || description) && (
        <div className="mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="text-primary-500 flex-shrink-0">{icon}</div>
            )}
            {title && (
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
          </div>
          {description && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </div>
          )}
        </div>
      )}

      {/* 卡片内容 */}
      <div className={MDXStyles.prose}>{children}</div>
    </div>
  );
};
