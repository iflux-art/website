'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// 语言显示名称映射
const languageNames: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'React JSX',
  ts: 'TypeScript',
  tsx: 'React TSX',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  md: 'Markdown',
  mdx: 'MDX',
  bash: 'Bash',
  sh: 'Shell',
  python: 'Python',
  py: 'Python',
  ruby: 'Ruby',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  dart: 'Dart',
  yaml: 'YAML',
  sql: 'SQL',
  graphql: 'GraphQL',
};

// 文件扩展名映射
const fileExtensions: Record<string, string> = {
  js: '.js',
  jsx: '.jsx',
  ts: '.ts',
  tsx: '.tsx',
  html: '.html',
  css: '.css',
  json: '.json',
  md: '.md',
  mdx: '.mdx',
  python: '.py',
  py: '.py',
  ruby: '.rb',
  go: '.go',
  rust: '.rs',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  csharp: '.cs',
  php: '.php',
  swift: '.swift',
  kotlin: '.kt',
  dart: '.dart',
  yaml: '.yml',
  sql: '.sql',
  graphql: '.graphql',
};

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // 从 className 中提取语言信息
  const language = className?.match(/language-(\w+)/)?.[1] || '';

  // 获取语言显示名称
  const languageDisplayName =
    languageNames[language] || language.charAt(0).toUpperCase() + language.slice(1);

  // 构建文件名
  const fileName = language ? `example${fileExtensions[language] || ''}` : '';

  // 提取代码内容
  let codeContent = '';
  try {
    const childrenArray = React.Children.toArray(children);
    if (childrenArray.length > 0) {
      const firstChild = childrenArray[0];
      if (typeof firstChild === 'string') {
        codeContent = firstChild;
      } else if (React.isValidElement(firstChild)) {
        // 使用类型断言处理 TypeScript 类型问题
        const anyElement = firstChild as React.ReactElement;
        if (
          (anyElement.props as { children?: string | React.ReactNode }).children &&
          typeof (anyElement.props as { children?: string }).children === 'string'
        ) {
          codeContent = (anyElement.props as { children: string }).children;
        } else if ((anyElement.props as { children?: React.ReactNode }).children) {
          // 处理复杂的子元素
          const nestedChildren = (anyElement.props as { children: React.ReactNode }).children;
          if (typeof nestedChildren === 'string') {
            codeContent = nestedChildren;
          } else if (Array.isArray(nestedChildren)) {
            codeContent = nestedChildren.join('');
          } else {
            // 尝试将复杂的子元素转换为字符串
            codeContent = String(nestedChildren);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error extracting code content:', error);
  }

  // 将代码内容分割成行，用于显示行号
  // 移除末尾的空行
  let codeLines = codeContent.split('\n');
  if (codeLines.length > 0 && codeLines[codeLines.length - 1] === '') {
    codeLines = codeLines.slice(0, -1);
  }

  // 复制代码到剪贴板
  const copyToClipboard = () => {
    // 确保复制的代码没有末尾空行
    const cleanCode = codeLines.join('\n');
    navigator.clipboard.writeText(cleanCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative mt-6 mb-0 overflow-hidden rounded-xl border border-border bg-card shadow-md max-w-full">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-muted/50">
        <div className="flex items-center space-x-2">
          {/* 窗口按钮 */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.7_0.2_30)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.7_0.2_90)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.6_0.2_140)]"></div>
          </div>

          {/* 语言标签 - 始终显示 */}
          <span className="text-xs font-medium ml-2 px-2 py-1 rounded-md bg-primary/10 text-primary">
            {languageDisplayName || 'Text'}
          </span>

          {/* 文件名 */}
          {fileName && (
            <span className="text-xs font-medium ml-2 opacity-70 hidden sm:inline-block">
              {fileName}
            </span>
          )}

          {/* 移动端复制按钮 */}
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors sm:hidden ml-auto shadow-sm"
            aria-label="复制代码"
            title="复制代码"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* 桌面端复制按钮 */}
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors hidden sm:block shadow-sm"
            aria-label="复制代码"
            title="复制代码"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 代码内容 */}
      <div className="relative">
        <div className="flex overflow-hidden">
          {/* 行号 */}
          <div className="hidden sm:flex sm:flex-col sm:justify-center text-right py-3 pr-2 select-none bg-muted/30 text-muted-foreground flex-shrink-0 border-r border-border">
            {codeLines.map((_, i) => (
              <div
                key={i}
                className="w-7 px-2 text-xs leading-[22px] font-mono min-h-[22px] flex items-center justify-end"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* 代码 */}
          <div className="overflow-x-auto w-full">
            <pre
              className={cn(
                'm-0 py-3 pl-4 pr-5 sm:pl-4 sm:pr-5 bg-transparent border-none w-full',
                'font-mono text-sm whitespace-pre break-words tab-[2]',
                className
              )}
              {...props}
            >
              <code className="block text-foreground">
                {codeLines.map((line, i) => (
                  <div key={i} className="min-h-[22px] leading-[22px] flex items-center">
                    {line || ' '}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
