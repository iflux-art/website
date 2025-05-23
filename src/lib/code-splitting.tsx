'use client';

import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 代码分割选项
 */
export interface CodeSplittingOptions {
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
   * @default false
   */
  ssr?: boolean;

  /**
   * 预加载延迟（毫秒）
   * 如果设置，将在页面加载后指定时间预加载组件
   */
  preloadDelay?: number;

  /**
   * 重试次数
   * @default 3
   */
  retries?: number;

  /**
   * 重试延迟（毫秒）
   * @default 1000
   */
  retryDelay?: number;
}

/**
 * 创建懒加载组件
 * 
 * @param importFn 导入函数
 * @param options 代码分割选项
 * @returns 懒加载组件
 * 
 * @example
 * ```tsx
 * const LazyComponent = createLazyComponent(() => import('@/components/heavy-component'));
 * 
 * // 使用
 * <LazyComponent />
 * ```
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: CodeSplittingOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const {
    fallback = <Skeleton className="w-full h-32" />,
    loadOnVisible = true,
    ssr = false,
    preloadDelay,
    retries = 3,
    retryDelay = 1000,
  } = options;

  // 创建带重试的导入函数
  const importWithRetry = async () => {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await importFn();
      } catch (error) {
        lastError = error as Error;
        
        // 等待指定时间后重试
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    // 所有重试都失败，抛出最后一个错误
    throw lastError;
  };

  // 创建懒加载组件
  const LazyComponent = lazy(importWithRetry);

  // 如果设置了预加载延迟，在页面加载后预加载组件
  if (preloadDelay !== undefined && typeof window !== 'undefined') {
    setTimeout(() => {
      importFn().catch(() => {});
    }, preloadDelay);
  }

  // 返回包装后的组件
  return (props: React.ComponentProps<T>) => {
    // 如果启用了 loadOnVisible，使用 IntersectionObserver 实现可见时加载
    if (loadOnVisible && typeof window !== 'undefined') {
      return (
        <VisibleLoader fallback={fallback} ssr={ssr}>
          <LazyComponent {...props} />
        </VisibleLoader>
      );
    }

    // 否则，直接使用 Suspense 包装
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * 可见时加载组件属性
 */
interface VisibleLoaderProps {
  /**
   * 子元素
   */
  children: React.ReactNode;

  /**
   * 加载中显示的组件
   */
  fallback: React.ReactNode;

  /**
   * 是否启用 SSR
   * @default false
   */
  ssr?: boolean;
}

/**
 * 可见时加载组件
 * 
 * 使用 IntersectionObserver 实现可见时加载
 */
function VisibleLoader({ children, fallback, ssr = false }: VisibleLoaderProps) {
  const [isVisible, setIsVisible] = React.useState(ssr);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // 如果已经可见，不需要再观察
    if (isVisible) {
      return;
    }

    // 创建 IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // 提前 200px 加载
        threshold: 0,
      }
    );

    // 开始观察
    if (ref.current) {
      observer.observe(ref.current);
    }

    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  // 如果不可见，显示占位符
  if (!isVisible) {
    return <div ref={ref}>{fallback}</div>;
  }

  // 如果可见，显示子元素
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/**
 * 预加载组件
 * 
 * @param importFn 导入函数
 * @returns 预加载函数
 * 
 * @example
 * ```tsx
 * const preloadComponent = preload(() => import('@/components/heavy-component'));
 * 
 * // 在需要的时候预加载
 * onMouseEnter={preloadComponent}
 * ```
 */
export function preload<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): () => void {
  return () => {
    importFn().catch(() => {});
  };
}
