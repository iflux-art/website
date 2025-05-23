'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { dynamicImport } from '@/lib/dynamic-import';

/**
 * 客户端组件加载器属性
 */
export interface ClientComponentLoaderProps {
  /**
   * 组件导入函数
   */
  importFn: () => Promise<{ default: React.ComponentType<any> }>;

  /**
   * 组件属性
   */
  componentProps?: Record<string, any>;

  /**
   * 加载中显示的组件
   * @default <Skeleton />
   */
  fallback?: React.ReactNode;

  /**
   * 是否在组件可见时才加载
   * @default true
   */
  loadOnVisible?: boolean;

  /**
   * 是否禁用 SSR
   * @default true
   */
  disableSSR?: boolean;
}

/**
 * 客户端组件加载器
 *
 * 用于懒加载客户端组件，支持在组件可见时才加载
 *
 * @example
 * ```tsx
 * // 基本用法
 * <ClientComponentLoader
 *   importFn={() => import('@/components/heavy-component')}
 *   componentProps={{ foo: 'bar' }}
 * />
 *
 * // 自定义加载中显示的组件
 * <ClientComponentLoader
 *   importFn={() => import('@/components/heavy-component')}
 *   fallback={<div>加载中...</div>}
 * />
 * ```
 */
export function ClientComponentLoader({
  importFn,
  componentProps = {},
  fallback = <Skeleton className="w-full h-32" />,
  loadOnVisible = true,
  disableSSR = true,
}: ClientComponentLoaderProps) {
  // 使用 useState 来存储组件是否应该加载
  const [shouldLoad, setShouldLoad] = useState(!loadOnVisible);

  // 使用 useEffect 来检测组件是否可见
  useEffect(() => {
    if (loadOnVisible && !shouldLoad) {
      // 创建 IntersectionObserver 实例
      const observer = new IntersectionObserver(
        (entries) => {
          // 如果组件可见，设置 shouldLoad 为 true
          if (entries[0].isIntersecting) {
            setShouldLoad(true);
            // 停止观察
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      // 获取当前组件的 DOM 元素
      const element = document.getElementById('client-component-loader');
      if (element) {
        observer.observe(element);
      }

      // 清理函数
      return () => {
        observer.disconnect();
      };
    }
  }, [loadOnVisible, shouldLoad]);

  // 动态导入组件
  const DynamicComponent = dynamicImport(importFn, {
    ssr: !disableSSR,
    loading: () => <>{fallback}</>,
  });

  // 如果不应该加载，显示占位符
  if (!shouldLoad) {
    return (
      <div id="client-component-loader" className="w-full">
        {fallback}
      </div>
    );
  }

  // 使用 Suspense 包装动态组件
  return (
    <Suspense fallback={fallback}>
      <DynamicComponent {...componentProps} />
    </Suspense>
  );
}
