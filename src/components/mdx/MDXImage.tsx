'use client';

import React from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/utils';

/**
 * MDX 图片组件属性
 */
export interface MDXImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  /** 图片源地址 */
  src: string;
  /** 图片描述文本 */
  alt?: string;
  /** 图片说明文字 */
  caption?: React.ReactNode;
  /** 是否优先加载 */
  priority?: boolean;
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
}

const imageStyles = {
  wrapper: cn('my-6 w-full', 'inline-flex flex-col items-center', 'not-prose'),

  image: cn(
    'rounded-xl',
    'shadow-md dark:shadow-none',
    'dark:border dark:border-neutral-800',
    'w-full',
    'max-w-[1200px]',
    'h-auto',
    'object-contain',
    'sm:max-w-[600px]',
    'md:max-w-[800px]',
    'lg:max-w-[1000px]',
    'xl:max-w-[1200px]',
    'hover:shadow-lg dark:hover:shadow-md',
    'transition-shadow duration-200'
  ),
  caption: cn('text-center text-sm', 'text-muted-foreground', 'mt-3 px-4', 'max-w-prose', 'block'),
};

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;
const DEFAULT_PRIORITY = false;
const DEFAULT_QUALITY = 85;

export const MDXImage: React.FC<MDXImageProps> = ({
  src,
  alt = '',
  caption,
  width,
  height,
  priority = DEFAULT_PRIORITY,
  quality = DEFAULT_QUALITY,
  className,
  ...props
}) => {
  if (!src) return null;

  return (
    <span className={imageStyles.wrapper}>
      <Image
        src={src}
        alt={alt}
        width={Number(width) || DEFAULT_WIDTH}
        height={Number(height) || DEFAULT_HEIGHT}
        priority={priority}
        quality={quality}
        className={cn(imageStyles.image, className)}
        {...props}
      />
      {(caption || alt) && (
        <span className={imageStyles.caption} role="caption">
          {caption || alt}
        </span>
      )}
    </span>
  );
};
