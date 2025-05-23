/**
 * 动态导入工具
 * 用于优化页面加载速度
 */

'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

/**
 * 动态导入选项
 */
interface DynamicImportOptions {
  /**
   * 是否启用服务器端渲染
   * @default true
   */
  ssr?: boolean;

  /**
   * 加载中显示的组件
   */
  loading?: () => ReactNode;

  /**
   * 加载失败显示的组件
   */
  error?: (error: Error) => ReactNode;
}

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

/**
 * 动态导入组件
 *
 * @param importFn 导入函数
 * @param options 选项
 * @returns 动态组件
 *
 * @example
 * ```tsx
 * // 基本用法
 * const DynamicComponent = dynamicImport(() => import('@/components/heavy-component'));
 *
 * // 禁用 SSR
 * const ClientOnlyComponent = dynamicImport(() => import('@/components/client-component'), {
 *   ssr: false,
 * });
 *
 * // 自定义加载组件
 * const ComponentWithCustomLoading = dynamicImport(() => import('@/components/heavy-component'), {
 *   loading: () => <div>Loading...</div>,
 * });
 * ```
 */
export function dynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
): T {
  const { ssr = true, loading = DefaultLoading, error = DefaultError } = options;

  return dynamic(importFn, {
    ssr,
    loading,
    // @ts-ignore - Next.js 类型定义不完整
    error,
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
