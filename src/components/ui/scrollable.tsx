"use client";

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * 滚动容器组件
 * 
 * 提供自定义滚动条样式的容器组件，可以选择隐藏滚动条、使用细滚动条、圆角滚动条等
 * 
 * @param children - 子元素
 * @param className - 额外的类名
 * @param hideScrollbar - 是否隐藏滚动条
 * @param thinScrollbar - 是否使用细滚动条
 * @param roundedThumb - 是否使用圆角滚动条滑块
 * @param primaryThumb - 是否使用主题色滚动条滑块
 */
export interface ScrollableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hideScrollbar?: boolean;
  thinScrollbar?: boolean;
  roundedThumb?: boolean;
  primaryThumb?: boolean;
}

export function Scrollable({
  children,
  className,
  hideScrollbar = false,
  thinScrollbar = false,
  roundedThumb = false,
  primaryThumb = false,
  ...props
}: ScrollableProps) {
  return (
    <div
      className={cn(
        "overflow-auto",
        hideScrollbar && "scrollbar-hide",
        thinScrollbar && "scrollbar-thin",
        roundedThumb && "scrollbar-thumb-rounded",
        primaryThumb && "scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* 滚动条样式 */
export const scrollbarStyles = `
  /* 隐藏滚动条但保留滚动功能 */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;     /* Firefox */
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;             /* Chrome, Safari and Opera */
  }

  /* 自定义滚动条样式 - 仅在需要时使用 */
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: var(--primary-foreground);
    opacity: 0.2;
    border-radius: 3px;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
    opacity: 0.3;
  }

  .scrollbar-thumb-rounded::-webkit-scrollbar-thumb {
    border-radius: 9999px;
  }

  .scrollbar-thumb-primary\\/20::-webkit-scrollbar-thumb {
    background-color: oklch(from var(--primary) l c h / 0.2);
  }

  .hover\\:scrollbar-thumb-primary\\/30:hover::-webkit-scrollbar-thumb {
    background-color: oklch(from var(--primary) l c h / 0.3);
  }
`;
