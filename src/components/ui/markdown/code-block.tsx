"use client"

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
  [key: string]: any;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // 从 className 中提取语言信息
  const language = className?.match(/language-(\w+)/)?.[1] || '';

  // 获取语言显示名称
  const languageDisplayName = languageNames[language] || language.charAt(0).toUpperCase() + language.slice(1);

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
        const anyElement = firstChild as any;
        if (anyElement.props && typeof anyElement.props.children === 'string') {
          codeContent = anyElement.props.children;
        } else if (anyElement.props && anyElement.props.children) {
          // 处理复杂的子元素
          const nestedChildren = anyElement.props.children;
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
    <div className="relative mt-4 mb-0 overflow-hidden rounded-lg border border-[oklch(0.922_0_0)] bg-[oklch(0.97_0_0)] dark:bg-[oklch(0.205_0_0)] dark:border-[oklch(0.3_0_0/0.3)] max-w-full">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-[oklch(0.922_0_0)] bg-[oklch(0.95_0_0)] dark:bg-[oklch(0.25_0_0)] dark:border-[oklch(0.3_0_0/0.3)]">
        <div className="flex items-center space-x-2">
          {/* 窗口按钮 */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.7_0.2_30)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.7_0.2_90)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.6_0.2_140)]"></div>
          </div>

          {/* 语言标签 - 始终显示 */}
          <span className="text-xs font-medium ml-2 px-1.5 py-0.5 rounded bg-[oklch(0.9_0.1_var(--accent-hue)/0.2)] text-[oklch(0.4_0.2_var(--accent-hue))] dark:bg-[oklch(0.3_0.1_var(--accent-hue)/0.3)] dark:text-[oklch(0.8_0.2_var(--accent-hue))]">
            {languageDisplayName || 'Text'}
          </span>

          {/* 文件名 */}
          {fileName && (
            <span className="text-xs font-medium ml-2 opacity-70 hidden sm:inline-block">{fileName}</span>
          )}

          {/* 移动端复制按钮 */}
          <button
            onClick={copyToClipboard}
            className="p-1 rounded-md bg-[oklch(0.9_0_0/0.5)] text-[oklch(0.3_0_0)] hover:bg-[oklch(0.9_0_0/0.8)] dark:bg-[oklch(0.3_0_0/0.5)] dark:text-[oklch(0.8_0_0)] dark:hover:bg-[oklch(0.3_0_0/0.8)] transition-colors sm:hidden ml-auto"
            aria-label="复制代码"
            title="复制代码"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            className="p-1 rounded-md bg-[oklch(0.9_0_0/0.5)] text-[oklch(0.3_0_0)] hover:bg-[oklch(0.9_0_0/0.8)] dark:bg-[oklch(0.3_0_0/0.5)] dark:text-[oklch(0.8_0_0)] dark:hover:bg-[oklch(0.3_0_0/0.8)] transition-colors hidden sm:block"
            aria-label="复制代码"
            title="复制代码"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="hidden sm:flex sm:flex-col sm:justify-center text-right py-2 pr-1 select-none bg-[oklch(0.96_0_0)] dark:bg-[oklch(0.22_0_0)] text-[oklch(0.6_0_0)] dark:text-[oklch(0.7_0_0)] flex-shrink-0 border-r border-[oklch(0.922_0_0)] dark:border-[oklch(0.3_0_0/0.3)]">
            {codeLines.map((_, i) => (
              <div key={i} className="w-7 px-2 text-xs leading-[22px] font-mono min-h-[22px] flex items-center justify-end">
                {i + 1}
              </div>
            ))}
          </div>

          {/* 代码 */}
          <div className="overflow-x-auto w-full">
            <pre className={cn(
              "m-0 py-2 pl-3 pr-4 sm:pl-3 sm:pr-4 bg-transparent border-none w-full",
              "font-mono text-sm whitespace-pre break-words tab-[2]",
              className
            )} {...props}>
              <code className="block text-[oklch(0.205_0_0)] dark:text-[oklch(0.85_0_0)]">
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
