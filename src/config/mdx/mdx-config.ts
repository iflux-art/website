/**
 * MDX 配置和类型定义
 * 包含默认属性配置和类型定义
 */

import type { MDXComponents } from '@/types';

/**
 * 默认组件属性配置
 */
export const defaultComponentProps = {
  img: {
    loading: 'lazy' as const,
    decoding: 'async' as const,
  },
  a: {
    target: '_blank' as const,
    rel: 'noopener noreferrer' as const,
  },
  pre: {
    showLineNumbers: true,
  },
  code: {
    inline: true,
  },
  table: {
    striped: true,
    hover: true,
    compact: false,
  },
};

/**
 * 组件上下文类型
 */
export interface MDXComponentContextType {
  components: MDXComponents;
  defaultProps: typeof defaultComponentProps;
}
