'use client';

import { type HTMLAttributes, useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils';
import { MDXStyles } from '@/config/mdx/styles';

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

  // 复制状态
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof children === 'string') {
      console.log('Code content:', JSON.stringify(children));
    }
  }, [children]);

  // 复制代码到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      // 2秒后重置状态
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div
      className={cn(
        MDXStyles.code.container,
        // 特殊样式
        'bg-transparent',
        '[&_code]:!text-current',
        '[&_pre]:!bg-transparent [&_code]:!bg-transparent',
        '[&_span]:!text-inherit',
        '[&_pre]:p-0 [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:border-0',
        // 滚动条样式
        '[&_pre::-webkit-scrollbar]:h-2 [&_pre::-webkit-scrollbar]:w-2',
        '[&_pre::-webkit-scrollbar-track]:bg-transparent',
        '[&_pre::-webkit-scrollbar-thumb]:bg-border hover:[&_pre::-webkit-scrollbar-thumb]:bg-muted-foreground/50',
        '[&_pre::-webkit-scrollbar-thumb]:rounded-full',
        // 基础代码样式
        'prose-pre:bg-transparent',
        '[&_pre]:overflow-x-auto',
        '[&_code]:block'
      )}
    >
      {/* 头部：文件名和复制按钮 */}
      <div className={cn(MDXStyles.code.header, 'text-xs text-muted-foreground')}>
        <span className="font-medium">{filename || displayLanguage}</span>
        <button
          onClick={copyToClipboard}
          className={cn(
            'flex items-center gap-1 rounded px-2 py-1',
            'transition-all duration-200',
            isCopied
              ? 'bg-success/10 text-success hover:bg-success/20'
              : 'bg-muted-foreground/10 hover:bg-muted-foreground/20 text-muted-foreground'
          )}
        >
          {isCopied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* 代码内容区域 */}
      <div className={MDXStyles.code.content}>
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
          <code className={cn(`language-${language}`, 'block font-inherit', 'border-0')}>
            {typeof children === 'string' ? children.trim() : children}
          </code>
        </pre>
      </div>
    </div>
  );
};
