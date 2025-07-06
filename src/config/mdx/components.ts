/**
 * MDX 组件配置入口文件
 * 整合所有MDX组件配置和映射
 */

import type { MDXComponents } from '@/types';
import { baseMDXComponents } from './mdx-base-components';
import { extendedMDXComponents } from './mdx-extended-components';
import { defaultComponentProps, MDXComponentContextType } from './mdx-config';

/**
 * 合并后的MDX组件映射
 */
export const MDXComponentsMapping: MDXComponents = {
  ...baseMDXComponents,
  ...extendedMDXComponents,
};

/**
 * 获取 MDX 组件配置
 */
export const useMDXComponents = (): MDXComponentContextType => {
  return {
    components: MDXComponentsMapping,
    defaultProps: defaultComponentProps,
  };
};

export * from './mdx-config';
