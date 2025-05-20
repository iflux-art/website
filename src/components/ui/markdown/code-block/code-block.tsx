"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import Copy from "@/components/ui/markdown/copy";
import { CodeBlockProps } from "./code-block.types";
import { useTheme } from "next-themes";

// 为 Window 接口添加 Prism 属性
declare global {
  interface Window {
    Prism: {
      highlightElement: (element: HTMLElement) => void;
      highlightAll: () => void;
    };
  }
}

/**
 * 代码块组件
 * 用于在文档中显示代码块，支持语法高亮和复制功能
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function CodeBlock({
  className,
  children,
  language,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme || 'light') as 'light' | 'dark';
  const codeRef = useRef<HTMLElement>(null);

  // 提取代码内容
  const codeContent = React.isValidElement(children)
    ? String((children as React.ReactElement<{ children?: React.ReactNode }>).props?.children || '')
    : String(children || '');

  // 使用 useEffect 在客户端初始化 Prism
  React.useEffect(() => {
    // 动态导入语法高亮函数
    const initHighlighting = async () => {
      const { initSyntaxHighlighting } = await import('@/lib/syntax-highlight');
      initSyntaxHighlighting();

      // 确保当前代码块被高亮
      if (window.Prism && codeRef.current) {
        window.Prism.highlightElement(codeRef.current);
      }
    };

    initHighlighting();
  }, []);

  return (
    <div className={cn(
      "relative my-6 rounded-lg shadow-md overflow-hidden",
      theme === 'dark' ? "bg-[#1e1e1e]" : "bg-[#f5f5f5]"
    )}>
      {/* 标题栏 */}
      <div className={cn(
        "flex items-center px-4 h-9",
        theme === 'dark' ? "border-b border-gray-700" : "border-b border-gray-200"
      )}>
        {/* 左侧三个圆点 */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* 语言标识 - 居中 */}
        {language && (
          <div className="flex-1 text-center">
            <span className={cn(
              "text-xs uppercase font-medium",
              theme === 'dark' ? "text-gray-400" : "text-gray-500"
            )}>
              {language}
            </span>
          </div>
        )}

        {/* 复制按钮 - 右侧 */}
        <div className="ml-auto">
          <Copy content={codeContent} />
        </div>
      </div>

      {/* 代码内容 */}
      <pre className={cn(
        "p-4 bg-transparent border-0",
        theme === 'dark' ? "text-gray-300" : "text-gray-800",
        className
      )}>
        <code
          ref={codeRef}
          className={cn(
            "font-mono text-sm block",
            language ? `language-${language}` : ""
          )}
        >
          {codeContent}
        </code>
      </pre>
    </div>
  );
}
