'use client';

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface HeadingWithAnchorProps {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id?: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

/**
 * 带锚点的标题组件
 *
 * 简化版本，移除了悬停显示 # 符号的效果
 */
export function HeadingWithAnchor({
  as: Component,
  id,
  children,
  className,
  ...props
}: HeadingWithAnchorProps) {
  // 如果没有提供ID，根据内容生成一个
  const headingId =
    id ||
    (typeof children === 'string'
      ? children
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
      : undefined);

  return (
    <Component id={headingId} className={cn('scroll-mt-20', className)} {...props}>
      {children}
    </Component>
  );
}

/**
 * H1 标题组件
 */
export function H1({ children, className, ...props }: Omit<HeadingWithAnchorProps, 'as'>) {
  return (
    <HeadingWithAnchor
      as="h1"
      className={cn('text-4xl font-bold tracking-tight mt-10 mb-6', className)}
      {...props}
    >
      {children}
    </HeadingWithAnchor>
  );
}

/**
 * H2 标题组件
 */
export function H2({ children, className, ...props }: Omit<HeadingWithAnchorProps, 'as'>) {
  return (
    <HeadingWithAnchor
      as="h2"
      className={cn('text-3xl font-semibold tracking-tight mt-12 mb-6 pb-3 border-b', className)}
      {...props}
    >
      {children}
    </HeadingWithAnchor>
  );
}

/**
 * H3 标题组件
 */
export function H3({ children, className, ...props }: Omit<HeadingWithAnchorProps, 'as'>) {
  return (
    <HeadingWithAnchor
      as="h3"
      className={cn('text-2xl font-semibold tracking-tight mt-10 mb-4', className)}
      {...props}
    >
      {children}
    </HeadingWithAnchor>
  );
}

/**
 * H4 标题组件
 */
export function H4({ children, className, ...props }: Omit<HeadingWithAnchorProps, 'as'>) {
  return (
    <HeadingWithAnchor
      as="h4"
      className={cn('text-xl font-semibold tracking-tight mt-8 mb-4', className)}
      {...props}
    >
      {children}
    </HeadingWithAnchor>
  );
}
