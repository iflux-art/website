'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { cn } from '@/utils';

type BlockquoteVariant = 'default' | 'info' | 'elegant';

export interface MDXBlockquoteProps extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  /** 引用内容 */
  children: React.ReactNode;
  /** 引用来源 */
  citation?: string;
  /** 引用作者 */
  author?: string;
  /** 自定义类名 */
  className?: string;
  /** 样式变体 */
  variant?: BlockquoteVariant;
}

/**
 * MDX 引用块组件
 * - 支持引文和作者信息
 * - 多种样式变体
 * - 优雅的排版
 * - 响应式设计
 */
export const MDXBlockquote = ({
  children,
  citation,
  author,
  className = '',
  variant = 'default',
  ...props
}: MDXBlockquoteProps) => {
  const blockquoteStyles = cn(
    // 基础布局
    'my-6',
    // 禁用 prose 的引号样式
    'not-prose',
    // 边框样式
    'border-l-2',
    'border-border',
    // 文字样式
    'text-muted-foreground',
    'italic'
  );

  const variantStyles = {
    default: cn('bg-gray-50 dark:bg-gray-800', 'border-l-4 border-gray-300 dark:border-gray-600'),
    info: cn('bg-blue-50 dark:bg-blue-900/20', 'border-l-4 border-blue-500 dark:border-blue-400'),
    elegant: cn(
      'bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800',
      'border-l-4 border-primary-500'
    ),
  } satisfies Record<BlockquoteVariant, string>;

  return (
    <blockquote
      className={cn(blockquoteStyles, 'px-6 py-4 rounded-r-lg', variantStyles[variant], className)}
      {...props}
    >
      <div className="flex gap-4 items-start">
        <Quote className="h-5 w-5 flex-shrink-0 mt-1 text-muted-foreground" />
        <div className="flex-1">
          {children}
          {/* 引用信息 */}
          {(citation || author) && (
            <footer className="mt-4 text-sm text-muted-foreground">
              {citation && <cite className="font-medium not-italic">{citation}</cite>}
              {author && (
                <span className="block text-xs">
                  — <span className="font-medium">{author}</span>
                </span>
              )}
            </footer>
          )}
        </div>
      </div>
    </blockquote>
  );
};
