/**
 * MDX 提供者组件
 *
 * 简化版本，不再使用 Context，直接返回子组件
 */

import { type ReactNode } from 'react';

// MDX Provider Props 类型
interface MDXProviderProps {
  children: ReactNode;
}

/**
 * MDX Provider 组件
 * 简化版本，主要用于向后兼容
 */
export function MDXProvider({ children }: MDXProviderProps) {
  return <>{children}</>;
}

// 重新导出以保持兼容性
export { useMDXComponents } from '@/config/mdx';
