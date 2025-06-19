'use client';

import React from 'react';
import Image from 'next/image';
import { MDX_STYLE_CONFIG, MDX_DEFAULT_OPTIONS } from '../config';
import type { MDXImageProps } from '../types';

/**
 * MDX 图片渲染组件
 * 使用 Next.js Image 组件处理图片优化
 */
export const MDXImage = ({
  src,
  alt,
  width,
  height,
  priority = MDX_DEFAULT_OPTIONS.image.priority,
  className,
  ...props
}: MDXImageProps) => {
  if (!src) return null;

  return (
    <div className={MDX_STYLE_CONFIG.image.wrapper}>
      <Image
        src={String(src)}
        alt={alt || ''}
        width={Number(width) || MDX_DEFAULT_OPTIONS.image.defaultWidth}
        height={Number(height) || MDX_DEFAULT_OPTIONS.image.defaultHeight}
        className={`${MDX_STYLE_CONFIG.image.img} ${className || ''}`}
        priority={priority}
        {...props}
      />
    </div>
  );
};
