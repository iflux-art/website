'use client';

import React from 'react';
import { MDXImage } from '@/components/mdx/MDXImage';
import type { MDXImageProps } from '@/types/mdx-types';
import { cn } from '@/utils';

interface MDXFigureProps extends MDXImageProps {
  caption?: React.ReactNode;
  bordered?: boolean;
  align?: 'left' | 'center' | 'right';
}

/**
 * MDX 图片容器组件
 * - 支持图片标题
 * - 可选边框
 * - 对齐方式控制
 * - 继承 MDXImage 的所有功能
 */
export const MDXFigure: React.FC<MDXFigureProps> = ({
  src,
  alt,
  caption,
  bordered = false,
  align = 'center',
  className,
  ...imageProps
}) => {
  const alignmentClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  } as const;

  return (
    <figure className={cn('my-8 flex flex-col', alignmentClasses[align], className)}>
      <div
        className={cn(
          'overflow-hidden rounded-lg',
          bordered && 'border border-gray-200 dark:border-gray-800'
        )}
      >
        <MDXImage src={src} alt={alt} {...imageProps} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
