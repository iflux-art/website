"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import { Check, Copy } from "lucide-react";
import "prismjs/themes/prism-tomorrow.css"; // 使用暗色主题
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

// 导出类型定义
export type { CodeBlockProps };

export function CodeBlock({
  code,
  language,
  fileName,
  showLineNumbers = true,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  // 处理语言名称
  const getLanguage = () => {
    const langMap: Record<string, string> = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      html: "html",
      css: "css",
      json: "json",
      bash: "bash",
      sh: "bash",
      python: "python",
      py: "python",
    };

    return langMap[language.toLowerCase()] || language.toLowerCase();
  };

  // 处理复制代码功能
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  // 设置组件已挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 仅在客户端应用高亮，并处理hydration问题
  useEffect(() => {
    if (mounted && codeRef.current && !highlighted) {
      // 添加延迟确保DOM已完全稳定
      const timeoutId = setTimeout(() => {
        if (codeRef.current) {
          // 添加额外的 null 检查
          Prism.highlightElement(codeRef.current);
          setHighlighted(true);
        }

        // 确保移除tabindex属性
        if (preRef.current?.hasAttribute("tabindex")) {
          preRef.current.removeAttribute("tabindex");
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [mounted, highlighted]);

  // 获取语言显示名称
  const getLanguageDisplayName = () => {
    const langMap: Record<string, string> = {
      javascript: "JavaScript",
      jsx: "JSX",
      typescript: "TypeScript",
      tsx: "TSX",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      bash: "Bash",
      python: "Python",
    };

    const lang = getLanguage();
    return langMap[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  // 手动创建行高亮标记
  const renderHighlightedLines = () => {
    if (!mounted || highlightLines.length === 0) return null;

    const lineHeight = 22; // 行高
    const paddingTop = fileName ? 64 : 36; // 上内边距加上标题栏高度

    return highlightLines.map(lineNumber => (
      <div
        key={`highlight-${lineNumber}`}
        className="absolute left-0 right-0 bg-blue-100/40 dark:bg-[#3b3b3b]/80 border-l-2 border-blue-500"
        style={{
          top: `${paddingTop + (lineNumber - 1) * lineHeight}px`,
          height: `${lineHeight}px`,
          zIndex: 0,
        }}
      />
    ));
  };

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden my-6 bg-muted dark:bg-muted border border-border shadow-lg",
        className
      )}
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/80 dark:bg-muted/50 border-b border-border">
        {/* 左侧语言标签和文件名 */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-2 py-1 text-xs font-medium">
            {getLanguageDisplayName()}
          </Badge>
          {fileName && (
            <span className="text-xs font-medium text-muted-foreground">{fileName}</span>
          )}
        </div>

        {/* 复制按钮 */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          title={copied ? "已复制!" : "复制代码"}
          aria-label={copied ? "已复制" : "复制代码"}
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {/* 代码块 */}
      <div className="relative">
        {/* 自定义高亮行 */}
        {renderHighlightedLines()}

        <pre
          ref={preRef}
          className={cn(
            "relative group p-4 m-0 overflow-auto max-h-[500px] font-mono text-[0.9rem] z-10",
            showLineNumbers && mounted ? "line-numbers" : ""
          )}
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Roboto Mono', monospace",
          }}
        >
          <code ref={codeRef} className={mounted ? `language-${getLanguage()}` : undefined}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
