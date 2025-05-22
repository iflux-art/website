"use client";

import React, { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { getImageLoadingProps, createLazyContainer, delay } from "@/lib/lazy-loading";

/**
 * lazy-image 组件类型定义
 */
/**
 * 懒加载图片组件属性
 */
export interface LazyImageProps extends Omit<ImageProps, 'loading'> {
  /** 图片索引，用于确定加载优先级 */
  index?: number;
  /** 包装器类名 */
  wrapperClassName?: string;
  /** 占位符类名 */
  placeholderClassName?: string;
  /** 是否启用淡入效果 */
  fadeIn?: boolean;
  /** 淡入动画持续时间(ms) */
  fadeInDuration?: number;
  /** 延迟加载时间(ms) */
  delayLoad?: number;
  /** 可见阈值 0-1 */
  threshold?: number;
}

/**
 * 懒加载图片组件
 * 提供统一的图片懒加载功能，支持淡入效果和占位符
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  wrapperClassName,
  placeholderClassName,
  index = 0,
  fadeIn = true,
  fadeInDuration = 500,
  delayLoad = 0,
  threshold = 0.1,
  ...props
}: LazyImageProps) {
  // 使用createLazyContainer函数创建懒加载容器
  const { ref, inView, style, className: animationClass } = createLazyContainer({
    triggerOnce: true,
    threshold,
    fadeIn,
    fadeInDuration,
    delayTime: delayLoad
  });

  // 控制图片显示的状态
  const [shouldRender, setShouldRender] = useState(false);

  // 处理延迟加载
  useEffect(() => {
    if (inView) {
      if (delayLoad > 0) {
        const timer = setTimeout(() => setShouldRender(true), delayLoad);
        return () => clearTimeout(timer);
      } else {
        setShouldRender(true);
      }
    }
  }, [inView, delayLoad]);

  // 获取加载优先级属性
  const loadingProps = getImageLoadingProps(index);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", wrapperClassName)}
      style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
    >
      {/* 占位符 */}
      {!shouldRender && (
        <div
          className={cn(
            "absolute inset-0 bg-muted animate-pulse",
            placeholderClassName
          )}
        />
      )}

      {/* 图片 */}
      {shouldRender && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(className, fadeIn ? animationClass : '')}
          style={fadeIn ? style : undefined}
          {...loadingProps}
          {...props}
        />
      )}
    </div>
  );
}
