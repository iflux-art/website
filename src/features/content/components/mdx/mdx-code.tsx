"use client";

import { useEffect, useRef } from "react";

type MDXCodeProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

/**
 * Custom MDX Code component for inline code
 * Provides consistent styling for inline code snippets
 * Note: Only applies to inline code, not code blocks
 */
export const MDXCode = ({ children, className, ...props }: MDXCodeProps) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 检查是否为行内代码（不在pre标签内）
    if (codeRef.current) {
      const isInlineCode = !codeRef.current.parentElement?.tagName.toLowerCase().includes("pre");

      // 只有行内代码才应用自定义样式和处理
      if (isInlineCode) {
        // 如果是行内代码，则应用自定义样式
        codeRef.current.classList.add(
          "inline-code",
          "not-prose",
          "relative",
          "rounded",
          "bg-muted",
          "px-[0.3rem]",
          "py-[0.2rem]",
          "font-mono",
          "text-sm",
          "font-semibold",
          "text-primary",
          "dark:bg-muted/80",
          "dark:text-primary/90",
          "before:hidden",
          "after:hidden"
        );

        // 处理内容（移除反引号）
        if (codeRef.current.textContent) {
          const content = codeRef.current.textContent;
          if (content.startsWith("`") && content.endsWith("`")) {
            codeRef.current.textContent = content.substring(1, content.length - 1);
          }
        }
      }
    }
  }, []);

  // 格式化函数不再需要，我们在useEffect中处理

  return (
    <code ref={codeRef} className={className} {...props}>
      {children}
    </code>
  );
};
