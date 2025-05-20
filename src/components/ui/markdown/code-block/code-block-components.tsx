"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { CodeProps } from "./code-block.types";

/**
 * 代码块组件集合
 * 用于在MDX中使用
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export const codeBlockComponents = {
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className={cn("overflow-x-auto bg-transparent border-0", className)} {...props} />
  ),
  code: ({ className, ...props }: CodeProps) => {
    // 从className中提取语言信息
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : undefined;

    // 如果有language类，说明这是一个代码块，应该使用CodeBlock组件
    // 否则，这是一个内联代码，应该使用普通的code标签
    if (language) {
      return (
        <CodeBlock language={language} className={className}>
          {props.children}
        </CodeBlock>
      );
    } else {
      // 内联代码 - 使用简单的内联样式
      // 样式与 Tailwind Typography 配置保持一致
      return (
        <code
          className={cn(
            "rounded px-1.5 py-0.5 text-sm font-mono",
            "dark:bg-gray-800/30 bg-gray-200/50",
            className
          )}
          {...props}
        />
      );
    }
  },
};
