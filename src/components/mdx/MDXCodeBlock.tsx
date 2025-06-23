'use client';

import { type HTMLAttributes } from 'react';
import { Copy } from 'lucide-react';
import { cn } from '@/utils';

/**
 * MDX 代码块组件属性
 */
export interface MDXCodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  /** 代码内容 */
  children: string;
  /** 代码语言类名 */
  className?: string;
  /** 文件名 */
  filename?: string;
}

/**
 * 代码语言映射
 */
const LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  json: 'json',
  html: 'html',
  css: 'css',
  md: 'markdown',
  mdx: 'markdown',
  // 添加更多语言映射...
};

/**
 * MDX 代码块渲染组件
 * - 支持语法高亮
 * - 支持代码复制
 * - 显示文件名
 * - 自适应宽度
 */
export const MDXCodeBlock = ({ children, className, filename }: MDXCodeBlockProps) => {
  // 提取语言信息
  const language = className?.replace(/language-/, '') || 'text';
  const displayLanguage = LANGUAGE_MAP[language] || language;

  // 复制代码到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div
      className={cn(
        // 外层容器
        'my-6 overflow-hidden rounded-lg border',
        'bg-transparent',
        '[&_pre]:p-0 [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:border-0',
        // 滚动条样式
        '[&_pre::-webkit-scrollbar]:h-2 [&_pre::-webkit-scrollbar]:w-2',
        '[&_pre::-webkit-scrollbar-track]:bg-transparent',
        '[&_pre::-webkit-scrollbar-thumb]:bg-border hover:[&_pre::-webkit-scrollbar-thumb]:bg-muted-foreground/50',
        '[&_pre::-webkit-scrollbar-thumb]:rounded-full',
        // 代码高亮样式
        '[&_.line]:px-4 [&_.line]:min-h-6 [&_.line]:py-0.5',
        '[&_.line--highlighted]:bg-muted-foreground/10 [&_.line--highlighted]:shadow-[2px_0_currentColor_inset]',
        '[&_.word--highlighted]:bg-muted-foreground/10 [&_.word--highlighted]:rounded',
        // 行号样式
        '[&_[data-line-numbers]>.line]:pl-2 [&_[data-line-numbers]>.line]:before:text-muted-foreground/40',
        '[&_[data-line-numbers]>.line]:before:mr-4 [&_[data-line-numbers]>.line]:before:content-[counter(line)] [&_[data-line-numbers]>.line]:before:counter-increment-[line]'
      )}
    >
      {/* 头部：文件名和复制按钮 */}
      <div
        className={cn(
          'flex items-center justify-between border-b px-4 py-2',
          'bg-muted/50 text-xs text-muted-foreground'
        )}
      >
        <span className="font-medium">{filename || displayLanguage}</span>
        <button
          onClick={copyToClipboard}
          className={cn(
            'flex items-center gap-1 rounded px-2 py-1',
            'bg-muted-foreground/10 hover:bg-muted-foreground/20',
            'text-muted-foreground transition-colors'
          )}
        >
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>复制</span>
          </>
        </button>
      </div>

      {/* 代码内容区域 */}
      <div className={cn('overflow-x-auto p-4')}>
        <pre
          className={cn(
            'not-prose',
            'text-sm',
            'font-mono leading-relaxed',
            'border-0',
            'overflow-x-auto',
            '[&>code]:block [&>code]:font-inherit',
            '[&>code]:border-0'
          )}
        >
          <code
            className={cn(
              'syntax-highlighting',
              `language-${language}`,
              'block font-inherit',
              'border-0'
            )}
          >
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};
