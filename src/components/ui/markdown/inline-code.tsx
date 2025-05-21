"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  // 处理内容，移除反引号
  const processContent = (content: React.ReactNode): React.ReactNode => {
    if (typeof content === 'string') {
      // 处理所有情况的反引号，包括字符串中间的反引号
      return content.split('`').map((part, i) => (
        i % 2 === 0 ? part : <span key={i}>{part}</span>
      ));
    }
    return content;
  };

  return (
    <code
      className={cn(
        // 基础样式
        "inline-block rounded-md px-1.5 py-0.5 mx-1 text-sm font-normal font-mono",
        // 浅色模式样式
        "bg-[oklch(0.97_0_0)] border border-[oklch(0.922_0_0)] text-[oklch(0.205_0_0)]",
        // 深色模式样式
        "dark:bg-[oklch(0.269_0_0)] dark:border-[oklch(0.3_0_0/0.3)] dark:text-[oklch(0.922_0_0)]",
        className
      )}
    >
      {processContent(children)}
    </code>
  );
}
