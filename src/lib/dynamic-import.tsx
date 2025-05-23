'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * 动态导入选项
 */
export interface DynamicImportOptions {
  /**
   * 是否启用 SSR
   * @default true
   */
  ssr?: boolean;

  /**
   * 加载中显示的组件
   * @default <Skeleton />
   */
  loading?: React.ComponentType | null;

  /**
   * 加载失败显示的组件
   */
  error?: React.ComponentType<{ error: Error }>;
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
export function dynamicImport<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const {
    ssr = true,
    loading = () => <Skeleton className="w-full h-32" />,
    error
  } = options;

  return dynamic(importFn, {
    ssr,
    loading,
    ...(error ? { loading: error } : {})
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
    ssr: false
  });
}
