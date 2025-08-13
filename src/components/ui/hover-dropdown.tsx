"use client";

import * as React from "react";
import { cn } from "@/utils";

interface HoverDropdownProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}

/**
 * 悬浮触发的下拉菜单组件
 *
 * 功能特性：
 * - 鼠标悬浮自动显示下拉内容
 * - 支持多种对齐方式和位置
 * - 平滑的动画效果
 * - 响应式设计
 */
export function HoverDropdown({
  children,
  content,
  className,
  contentClassName,
  align = "start",
  side = "bottom",
}: HoverDropdownProps) {
  const getAlignmentClasses = () => {
    switch (align) {
      case "center":
        return "left-1/2 -translate-x-1/2";
      case "end":
        return "right-0";
      default:
        return "left-0";
    }
  };

  const getSideClasses = () => {
    switch (side) {
      case "top":
        return "bottom-full mb-2";
      case "left":
        return "right-full mr-2 top-0";
      case "right":
        return "left-full ml-2 top-0";
      default:
        return "top-full mt-2";
    }
  };

  return (
    <div className={cn("group relative inline-block", className)}>
      {children}

      {/* 使用 CSS-only 悬浮效果 */}
      <div
        className={cn(
          "invisible absolute min-w-[8rem] rounded-md border border-border bg-popover p-1 text-popover-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100",
          getSideClasses(),
          getAlignmentClasses(),
          contentClassName,
        )}
        style={{ zIndex: 9999 }}
      >
        {content}
      </div>
    </div>
  );
}

/**
 * 悬浮下拉菜单项组件
 */
export function HoverDropdownItem({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
