'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 骨架屏类型
 */
export type SkeletonType = 'card' | 'article' | 'list' | 'table' | 'profile' | 'custom';

/**
 * 骨架屏组件属性
 */
export interface SkeletonScreenProps {
  /**
   * 骨架屏类型
   * @default "card"
   */
  type?: SkeletonType;

  /**
   * 骨架屏数量
   * @default 1
   */
  count?: number;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 是否显示动画
   * @default true
   */
  animate?: boolean;

  /**
   * 自定义骨架屏
   */
  children?: React.ReactNode;
}

/**
 * 骨架屏组件
 * 
 * 用于减少感知加载时间
 * 
 * @example
 * ```tsx
 * // 卡片骨架屏
 * <SkeletonScreen type="card" count={3} />
 * 
 * // 文章骨架屏
 * <SkeletonScreen type="article" />
 * 
 * // 自定义骨架屏
 * <SkeletonScreen type="custom">
 *   <div className="flex flex-col space-y-4">
 *     <Skeleton className="h-8 w-full" />
 *     <Skeleton className="h-4 w-3/4" />
 *     <Skeleton className="h-4 w-1/2" />
 *   </div>
 * </SkeletonScreen>
 * ```
 */
export function SkeletonScreen({
  type = 'card',
  count = 1,
  className,
  animate = true,
  children,
}: SkeletonScreenProps) {
  // 如果提供了自定义骨架屏，直接使用
  if (children) {
    return <div className={className}>{children}</div>;
  }
  
  // 卡片骨架屏
  if (type === 'card') {
    return (
      <div className={cn('grid gap-6', className)}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'rounded-lg border border-border p-6',
              animate && 'animate-pulse'
            )}
          >
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // 文章骨架屏
  if (type === 'article') {
    return (
      <div className={cn('space-y-6', className)}>
        <Skeleton className={cn('h-12 w-3/4', animate && 'animate-pulse')} />
        <Skeleton className={cn('h-6 w-1/2', animate && 'animate-pulse')} />
        <div className={cn('space-y-4', animate && 'animate-pulse')}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className={cn('space-y-4', animate && 'animate-pulse')}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className={cn('space-y-4', animate && 'animate-pulse')}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }
  
  // 列表骨架屏
  if (type === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center space-x-4',
              animate && 'animate-pulse'
            )}
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // 表格骨架屏
  if (type === 'table') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className={cn('flex space-x-4', animate && 'animate-pulse')}>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-1/4" />
        </div>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'flex space-x-4',
              animate && 'animate-pulse'
            )}
          >
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ))}
      </div>
    );
  }
  
  // 个人资料骨架屏
  if (type === 'profile') {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className={cn('h-24 w-24 rounded-full', animate && 'animate-pulse')} />
          <Skeleton className={cn('h-6 w-48', animate && 'animate-pulse')} />
          <Skeleton className={cn('h-4 w-64', animate && 'animate-pulse')} />
        </div>
        <div className={cn('space-y-4', animate && 'animate-pulse')}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className={cn('h-24 rounded-lg', animate && 'animate-pulse')} />
          <Skeleton className={cn('h-24 rounded-lg', animate && 'animate-pulse')} />
          <Skeleton className={cn('h-24 rounded-lg', animate && 'animate-pulse')} />
          <Skeleton className={cn('h-24 rounded-lg', animate && 'animate-pulse')} />
        </div>
      </div>
    );
  }
  
  // 默认骨架屏
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn('h-8 w-full', animate && 'animate-pulse')}
        />
      ))}
    </div>
  );
}
