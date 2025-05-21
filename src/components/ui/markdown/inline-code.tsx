"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * 内联代码组件
 *
 * 用于渲染行内代码，自动处理反引号问题
 */
export function InlineCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // 不再需要主题变量

  // 处理字符串内容，移除反引号
  const processContent = (content: string): string => {
    return content.replace(/^`+|`+$/g, '');
  };

  // 递归处理 React 节点
  const processNode = (node: React.ReactNode): React.ReactNode => {
    // 处理字符串节点
    if (typeof node === 'string') {
      return processContent(node);
    }

    // 处理 React 元素
    if (React.isValidElement(node)) {
      // 获取元素的 props
      const props = (node as React.ReactElement<any>).props;

      // 克隆元素并处理其子元素
      return React.cloneElement(
        node,
        {},
        processNode(props.children)
      );
    }

    // 处理数组
    if (Array.isArray(node)) {
      return node.map(item => processNode(item));
    }

    // 其他类型直接返回
    return node;
  };

  // 处理内容
  const processedContent = processNode(children);

  return (
    <code
      className={cn(
        "rounded-md px-1.5 py-0.5 text-sm font-mono border",
        "dark:bg-zinc-800/50 dark:border-zinc-700/50 dark:text-zinc-200",
        "bg-zinc-100/70 border-zinc-200/70 text-zinc-800",
        className
      )}
    >
      {processedContent}
    </code>
  );
}
