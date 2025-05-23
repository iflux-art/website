'use client';

/**
 * 动态导入工具
 * 用于优化页面加载速度，支持代码分割和懒加载
 */

import dynamic from 'next/dynamic';
import React, { lazy, Suspense, ComponentType, ReactNode } from 'react';

/**
 * 动态导入选项
 */
export interface DynamicImportOptions {
  /**
   * 是否启用服务器端渲染
   * @default true
   */
  ssr?: boolean;

  /**
   * 加载中显示的组件
   * @default null
   */
  loading?: ComponentType | null | (() => ReactNode);

  /**
   * 加载失败显示的组件
   */
  error?: ComponentType<{ error: Error }> | ((error: Error) => ReactNode);
}

/**
 * 动态导入组件
 *
 * 使用 Next.js 的动态导入功能，对组件进行代码分割和懒加载
 *
 * @param importFn 导入函数
 * @param options 动态导入选项
 * @returns 动态导入的组件
 *
 * @example
 * ```tsx
 * // 基本用法
 * const DynamicComponent = dynamicImport(() => import('@/components/heavy-component'));
 *
 * // 禁用 SSR
 * const ClientOnlyComponent = dynamicImport(() => import('@/components/client-only'), {
 *   ssr: false
 * });
 *
 * // 自定义加载组件
 * const ComponentWithCustomLoading = dynamicImport(() => import('@/components/heavy-component'), {
 *   loading: () => <div>加载中...</div>
 * });
 * ```
 */
/**
 * 默认加载组件
 */
const DefaultLoading = () => (
  <div className="w-full h-full min-h-[100px] flex items-center justify-center">
    <div className="bg-muted rounded-md w-full h-full min-h-[100px]" />
  </div>
);

/**
 * 默认错误组件
 */
const DefaultError = ({ error }: { error: Error }) => (
  <div className="w-full p-4 border border-destructive/50 bg-destructive/10 rounded-xl">
    <p className="text-destructive font-medium">加载组件时出错</p>
    <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
  </div>
);

export function dynamicImport<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const { ssr = true, loading = DefaultLoading, error = DefaultError } = options;

  return dynamic(importFn, {
    ssr,
    loading,
    // @ts-ignore - Next.js 类型定义不完整
    error,
  });
}

/**
 * 动态导入客户端组件
 *
 * 使用 Next.js 的动态导入功能，对客户端组件进行代码分割和懒加载
 * 禁用 SSR，仅在客户端渲染
 *
 * @param importFn 导入函数
 * @param options 动态导入选项
 * @returns 动态导入的客户端组件
 *
 * @example
 * ```tsx
 * const ClientComponent = dynamicImportClient(() => import('@/components/client-component'));
 * ```
 */
export function dynamicImportClient<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: Omit<DynamicImportOptions, 'ssr'> = {}
): React.ComponentType<React.ComponentProps<T>> {
  return dynamicImport(importFn, {
    ...options,
    ssr: false,
  });
}

/**
 * 动态导入 Lucide 图标
 *
 * @param iconName 图标名称
 * @returns 动态图标组件
 *
 * @example
 * ```tsx
 * // 导入 Home 图标
 * const HomeIcon = dynamicIcon('Home');
 *
 * // 使用
 * <HomeIcon className="w-5 h-5" />
 * ```
 */
export function dynamicIcon(iconName: string) {
  return dynamic(() => import('lucide-react').then(mod => mod[iconName]), { ssr: true });
}

/**
 * 代码分割选项
 */
export interface CodeSplittingOptions {
  /**
   * 加载中显示的组件
   * @default null
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
  const { fallback = null, loadOnVisible = true, ssr = false, preloadDelay } = options;

  // 创建懒加载组件
  const LazyComponent = lazy(importFn);

  // 如果设置了预加载延迟，在页面加载后预加载组件
  if (preloadDelay !== undefined && typeof window !== 'undefined') {
    setTimeout(() => {
      importFn().catch(() => {});
    }, preloadDelay);
  }

  // 返回包装后的组件
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
