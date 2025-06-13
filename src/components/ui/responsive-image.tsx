'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/shared/utils/utils';

/**
 * 响应式图片尺寸配置
 */
export interface ResponsiveImageSizes {
  /**
   * 移动设备尺寸
   */
  mobile?: number;

  /**
   * 平板设备尺寸
   */
  tablet?: number;

  /**
   * 桌面设备尺寸
   */
  desktop?: number;

  /**
   * 大屏设备尺寸
   */
  large?: number;
}

/**
 * 响应式图片格式配置
 */
export interface ResponsiveImageFormats {
  /**
   * 是否启用 WebP 格式
   * @default true
   */
  webp?: boolean;

  /**
   * 是否启用 AVIF 格式
   * @default true
   */
  avif?: boolean;

  /**
   * 是否启用原始格式
   * @default true
   */
  original?: boolean;
}

/**
 * 响应式图片组件属性
 */
export interface ResponsiveImageProps
  extends Omit<ImageProps, 'src' | 'srcSet' | 'sizes' | 'placeholder'> {
  /**
   * 图片源
   * 可以是字符串或对象
   */
  src: string | { [key: string]: string };

  /**
   * 图片尺寸配置
   */
  imageSizes?: ResponsiveImageSizes;

  /**
   * 图片格式配置
   */
  formats?: ResponsiveImageFormats;

  /**
   * 是否为关键图片（优先加载）
   * @default false
   */
  isHero?: boolean;

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

  /**
   * 图片质量
   * @default 80
   */
  quality?: number;
}

/**
 * 响应式图片组件
 *
 * 提供以下优化：
 * 1. 根据设备尺寸加载不同大小的图片
 * 2. 支持 WebP 和 AVIF 格式
 * 3. 支持懒加载
 * 4. 支持加载中和加载失败占位符
 *
 * @example
 * ```tsx
 * // 基本用法
 * <ResponsiveImage
 *   src="/images/hero.jpg"
 *   alt="Hero Image"
 *   width={1200}
 *   height={600}
 * />
 *
 * // 高级用法
 * <ResponsiveImage
 *   src={{
 *     default: "/images/hero.jpg",
 *     mobile: "/images/hero-mobile.jpg",
 *     tablet: "/images/hero-tablet.jpg",
 *     desktop: "/images/hero-desktop.jpg",
 *   }}
 *   alt="Hero Image"
 *   width={1200}
 *   height={600}
 *   imageSizes={{
 *     mobile: 640,
 *     tablet: 1024,
 *     desktop: 1920,
 *   }}
 *   formats={{
 *     webp: true,
 *     avif: true,
 *     original: true,
 *   }}
 *   isHero
 * />
 * ```
 */
export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  imageSizes = {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
  },
  formats = {
    webp: true,
    avif: true,
    original: true,
  },
  isHero = false,
  placeholder,
  fallback,
  onLoaded,
  onLoadError,
  containerClassName,
  className,
  quality = 80,
  ...props
}: ResponsiveImageProps) {
  // 状态
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 计算属性
  const priority = props.priority || isHero;
  const loading = props.loading || 'eager';

  // 构建响应式尺寸
  const { mobile = 640, tablet = 1024, desktop = 1920 } = imageSizes;
  const sizesAttr = `
    (max-width: ${mobile}px) 100vw,
    (max-width: ${tablet}px) 50vw,
    33vw
  `;

  // 检查是否为外部图片
  const isExternalImage = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // 获取图片源
  const getImageSrc = (size: 'default' | 'mobile' | 'tablet' | 'desktop'): string => {
    if (typeof src === 'string') {
      return src;
    }

    return src[size] || src.default || Object.values(src)[0];
  };

  // 构建图片URL（外部图片不添加查询参数）
  const buildImageUrl = (baseSrc: string, width?: number, format?: string): string => {
    if (isExternalImage(baseSrc)) {
      return baseSrc; // 外部图片直接返回原始URL
    }

    // 内部图片添加优化参数
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (quality) params.set('q', quality.toString());
    if (format) params.set('format', format);

    return `${baseSrc}?${params.toString()}`;
  };

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
    onLoadError?.(
      new Error(`Failed to load image: ${typeof src === 'string' ? src : JSON.stringify(src)}`)
    );
  };

  // 重置状态
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // 渲染
  return (
    <div className={cn('relative', containerClassName)}>
      {/* 加载中占位符 */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10">{placeholder || defaultPlaceholder}</div>
      )}

      {/* 加载失败占位符 */}
      {hasError && <div className="absolute inset-0 z-10">{fallback || defaultFallback}</div>}

      {/* 图片 */}
      <picture>
        {/* AVIF 格式 - 仅对内部图片启用 */}
        {formats.avif && !isExternalImage(getImageSrc('default')) && (
          <>
            <source
              type="image/avif"
              srcSet={`
                ${buildImageUrl(getImageSrc('mobile'), mobile, 'avif')} ${mobile}w,
                ${buildImageUrl(getImageSrc('tablet'), tablet, 'avif')} ${tablet}w,
                ${buildImageUrl(getImageSrc('desktop'), desktop, 'avif')} ${desktop}w
              `}
              sizes={sizesAttr}
            />
          </>
        )}

        {/* WebP 格式 - 仅对内部图片启用 */}
        {formats.webp && !isExternalImage(getImageSrc('default')) && (
          <>
            <source
              type="image/webp"
              srcSet={`
                ${buildImageUrl(getImageSrc('mobile'), mobile, 'webp')} ${mobile}w,
                ${buildImageUrl(getImageSrc('tablet'), tablet, 'webp')} ${tablet}w,
                ${buildImageUrl(getImageSrc('desktop'), desktop, 'webp')} ${desktop}w
              `}
              sizes={sizesAttr}
            />
          </>
        )}

        {/* 原始格式 */}
        {formats.original && (
          <Image
            src={getImageSrc('default')}
            alt={alt}
            width={width}
            height={height}
            className={cn(
              'transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              hasError && 'hidden',
              className
            )}
            sizes={sizesAttr}
            quality={quality}
            priority={priority}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        )}
      </picture>
    </div>
  );
}
