'use client';

import type { MDXComponents as MDXComponentsType } from '@/config/mdx';
import { MDXComponentsMapping } from '@/config/mdx';

/**
 * 重新导出 MDX 组件映射
 * 从统一配置中导入，确保配置一致性
 */
export const MDXComponents: MDXComponentsType = MDXComponentsMapping;

// 为了向后兼容，保留类型导出
export type { MDXComponentsType };
