"use client";

import React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MDXCodeInlineProps extends React.HTMLAttributes<HTMLElement> {
  /** 代码内容 */
  children: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否为行内代码 */
  inline?: boolean;
  /** 代码语言 */
  language?: string;
  /** 样式变体 */
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  /** 是否可复制 */
  copyable?: boolean;
}

/**
 * MDX 行内代码组件
 * - 支持多种样式
 * - 可复制功能
 * - 响应式设计
 * - 暗色模式支持
 */
export const MDXCodeInline = React.forwardRef<HTMLElement, MDXCodeInlineProps>(
  ({ children, className, variant, copyable = false, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const processContent = (content: React.ReactNode): React.ReactNode => {
      if (typeof content === "string") {
        if (content.startsWith("'") && content.endsWith("'")) {
          return content.slice(1, -1);
        }
      }
      return content;
    };

    // 复制文本
    const handleCopy = async () => {
      if (typeof children === "string") {
        try {
          await navigator.clipboard.writeText(children);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy text:", err);
        }
      }
    };

    return (
      <code
        ref={ref}
        className={cn(
          "rounded",
          "bg-muted px-1.5 py-0.5",
          "font-mono text-sm",
          'before:content-[""] after:content-[""]',
          variant &&
            {
              default: "",
              primary: "text-primary",
              secondary: "text-secondary",
              success: "text-success",
              warning: "text-warning",
              error: "text-error",
            }[variant],
          copyable && "pr-6",
          className,
        )}
        {...props}
      >
        {processContent(children)}
        {copyable && (
          <button
            onClick={handleCopy}
            className={cn(
              "absolute top-1/2 right-1 -translate-y-1/2",
              "opacity-0 group-hover:opacity-100",
              "hover:bg-black/10 dark:hover:bg-white/10",
              "rounded p-0.5 transition-opacity",
            )}
            aria-label={copied ? "已复制" : "复制"}
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        )}
      </code>
    );
  },
);

MDXCodeInline.displayName = "MDXCodeInline";

/**
 * 创建带有特定样式的行内代码组件
 */
// 导出预设变体
export const PrimaryCode: React.FC<MDXCodeInlineProps> = (props) => (
  <MDXCodeInline variant="primary" {...props} />
);

export const SecondaryCode: React.FC<MDXCodeInlineProps> = (props) => (
  <MDXCodeInline variant="secondary" {...props} />
);

export const SuccessCode: React.FC<MDXCodeInlineProps> = (props) => (
  <MDXCodeInline variant="success" {...props} />
);

export const WarningCode: React.FC<MDXCodeInlineProps> = (props) => (
  <MDXCodeInline variant="warning" {...props} />
);

export const ErrorCode: React.FC<MDXCodeInlineProps> = (props) => (
  <MDXCodeInline variant="error" {...props} />
);
