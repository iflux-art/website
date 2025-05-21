"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MacStyleCodeBlock } from "./mac-style-code-block";
import { SpecialCodeBlock } from "./special-code-block";
import { CodeProps } from "./code-block.types";

/**
 * 代码块组件集合
 * 用于在MDX中使用
 *
 * 使用 macOS 风格的代码块组件，适配不同的主题模式
 * 对特殊类型的代码块（如流程图）使用专门的渲染组件
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

    // 如果有language类，说明这是一个代码块
    if (language) {
      // 特殊类型的代码块使用专门的渲染组件
      const specialLanguages = ['mermaid', 'flowchart', 'chart'];
      if (specialLanguages.includes(language)) {
        return (
          <SpecialCodeBlock language={language} className={className}>
            {props.children}
          </SpecialCodeBlock>
        );
      }

      // 普通代码块使用 MacStyleCodeBlock 组件
      return (
        <MacStyleCodeBlock language={language} className={className}>
          {props.children}
        </MacStyleCodeBlock>
      );
    } else {
      // 内联代码 - 使用简单的内联样式，与 macOS 风格协调
      return (
        <code
          className={cn(
            "rounded-md px-1.5 py-0.5 text-sm font-mono border",
            "dark:bg-zinc-800/50 dark:border-zinc-700/50 dark:text-zinc-200",
            "bg-zinc-100/70 border-zinc-200/70 text-zinc-800",
            className
          )}
          {...props}
        />
      );
    }
  },
};
