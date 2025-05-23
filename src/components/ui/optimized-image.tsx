'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { useLazyLoad } from '@/hooks/use-intersection-observer';

/**
 * 优化图片组件属性
 */
export interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /**
   * 是否为关键图片（优先加载）
   * @default false
   */
  isHero?: boolean;

  /**
   * 是否启用懒加载
   * @default true
   */
  lazy?: boolean;

  /**
   * 加载中显示的占位符
   */
  placeholder?: React.ReactNode;

  /**
   * 加载失败显示的占位符
   */
  fallback?: React.ReactNode;

  /**
   * 加载完成回调
   */
  onLoaded?: () => void;

  /**
   * 加载失败回调
   */
  onLoadError?: (error: Error) => void;

  /**
   * 容器类名
   */
  containerClassName?: string;
}

/**
 * 优化图片组件
 *
 * 提供以下优化：
 * 1. 自动设置合适的 sizes 属性
 * 2. 支持优先加载关键图片
 * 3. 支持加载中和加载失败占位符
 * 4. 支持加载完成和加载失败回调
 * 5. 支持懒加载
 *
 * @example
 * ```tsx
 * // 基本用法
 * <OptimizedImage
 *   src="/image.jpg"
 *   alt="描述"
 *   width={800}
 *   height={600}
 * />
 *
 * // 关键图片（优先加载）
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   width={1200}
 *   height={600}
 *   isHero
 * />
 *
 * // 自定义占位符
 * <OptimizedImage
 *   src="/image.jpg"
 *   alt="描述"
 *   width={800}
 *   height={600}
 *   placeholder={<div>加载中...</div>}
 *   fallback={<div>加载失败</div>}
 * />
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  isHero = false,
  lazy = true,
  placeholder,
  fallback,
  onLoaded,
  onLoadError,
  containerClassName,
  className,
  sizes: propSizes,
  priority: propPriority,
  loading: propLoading,
  ...props
}: OptimizedImageProps) {
  // 状态
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 使用自定义的懒加载 Hook
  const [ref, isVisible] = useLazyLoad<HTMLDivElement>({
    triggerOnce: true,
    threshold: 0.1,
    // 如果是关键图片或已设置优先级，则跳过懒加载
    skip: isHero || !!propPriority,
  });

  // 计算属性
  const priority = propPriority || isHero;
  const loading = propLoading || (lazy && !priority ? 'lazy' : 'eager');

  // 默认 sizes 属性
  const defaultSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  const sizes = propSizes || defaultSizes;

  // 默认占位符
  const defaultPlaceholder = (
    <div className="bg-muted rounded-md overflow-hidden" style={{ width, height }} />
  );

  // 默认加载失败占位符
  const defaultFallback = (
    <div
      className="bg-muted/50 border border-border rounded-md overflow-hidden flex items-center justify-center"
      style={{ width, height }}
    >
      <span className="text-sm text-muted-foreground">图片加载失败</span>
    </div>
  );

  // 处理加载完成
  const handleLoad = () => {
    setIsLoaded(true);
    onLoaded?.();
  };

  // 处理加载失败
  const handleError = () => {
    setHasError(true);
    onLoadError?.(new Error(`Failed to load image: ${src}`));
  };

  // 重置状态
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // 如果启用了懒加载且图片不在视口内，只显示占位符
  if (lazy && !priority && !isVisible) {
    return (
      <div ref={ref} className={cn('relative', containerClassName)}>
        <div className="absolute inset-0 z-10">{placeholder || defaultPlaceholder}</div>
      </div>
    );
  }

  // 渲染
  return (
    <div className={cn('relative', containerClassName)} ref={lazy && !priority ? ref : undefined}>
      {/* 加载中占位符 */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10">{placeholder || defaultPlaceholder}</div>
      )}

      {/* 加载失败占位符 */}
      {hasError && <div className="absolute inset-0 z-10">{fallback || defaultFallback}</div>}

      {/* 图片 */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'hidden',
          className
        )}
        sizes={sizes}
        priority={priority}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}
