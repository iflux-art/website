"use client";

import React from "react";
import { BackToTopButtonProps } from "./back-to-top-button.types";
import { cn } from "@/lib/utils";

/**
 * 回到顶部按钮组件
 * 客户端组件，处理点击事件
 */
export function BackToTopButton({
  title,
  className,
  behavior = 'smooth',
  top = 0
}: BackToTopButtonProps) {
  return (
    <button
      onClick={() => window.scrollTo({ top, behavior })}
      className={cn(
        "rounded-full p-2 bg-primary/10 hover:bg-primary/20 transition-colors",
        className
      )}
      title={title}
      aria-label={title}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    </button>
  );
}