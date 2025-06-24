/**
 * MDX 组件配置
 * 统一管理所有 MDX 组件的配置和映射
 */

import * as React from 'react';
import type { MDXComponents } from '@/types';

// Base components
import { MDXImage } from '@/components/mdx/MDXImage';
import { MDXLink } from '@/components/mdx/MDXLink';
import { MDXCodeBlock } from '@/components/mdx/MDXCodeBlock';
import { MDXBlockquote } from '@/components/mdx/MDXBlockquote';
import { MDXCodeInline } from '@/components/mdx/MDXCodeInline';
import { MDXTableComponents } from '@/components/mdx/MDXTable';

// Code style components
import {
  PrimaryCode,
  SecondaryCode,
  SuccessCode,
  WarningCode,
  ErrorCode,
} from '@/components/mdx/MDXCodeInline';

// Extended components
import { MDXTabs } from '@/components/mdx/MDXTabs';
import { MDXAccordion } from '@/components/mdx/MDXAccordion';
import { MDXVideo } from '@/components/mdx/MDXVideo';
import { MDXImageZoom } from '@/components/mdx/MDXImageZoom';
import { MDXCodeDemo } from '@/components/mdx/MDXCodeDemo';

/**
 * MDX 组件映射配置
 */
export const MDXComponentsMapping = {
  // 基础 HTML 组件映射
  img: MDXImage,
  a: MDXLink,
  pre: MDXCodeBlock,
  blockquote: MDXBlockquote,
  code: MDXCodeInline,
  table: MDXTableComponents.table,
  thead: MDXTableComponents.thead,
  tbody: MDXTableComponents.tbody,
  tr: MDXTableComponents.tr,
  th: MDXTableComponents.th,
  td: MDXTableComponents.td,

  // 代码样式变体
  'code.primary': PrimaryCode,
  'code.secondary': SecondaryCode,
  'code.success': SuccessCode,
  'code.warning': WarningCode,
  'code.error': ErrorCode,

  // 扩展组件
  Tabs: MDXTabs,
  Accordion: MDXAccordion,
  Video: MDXVideo,
  ImageZoom: MDXImageZoom,
  CodeDemo: MDXCodeDemo,
};

/**
 * 默认的组件 Props
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

/**
 * 创建组件上下文
 */
export const MDXComponentContext = React.createContext<MDXComponentContextType>({
  components: MDXComponentsMapping,
  defaultProps: defaultComponentProps,
});

/**
 * 组件上下文 Hook
 */
export const useMDXComponents = (): MDXComponentContextType =>
  React.useContext(MDXComponentContext);
