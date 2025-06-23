/**
 * MDX 组件导出
 * 从统一配置中重新导出必要的组件和配置
 */

// 导出渲染器和提供者
export { MDXRenderer } from './MDXRenderer';
export { MDXProvider } from './MDXProvider';

// 从配置中心重新导出核心功能
export {
  MDXComponentsMapping as MDXComponents,
  MDXBaseOptions,
  MDXStyles,
  useMDXComponents,
  type MDXOptions,
  type MDXComponents as MDXComponentsType,
} from '@/config/mdx';

// 为了向后兼容，保留组件直接导出
export { MDXImage, type MDXImageProps } from './MDXImage';
export { MDXLink, type MDXLinkProps } from './MDXLink';
export { MDXCodeBlock, type MDXCodeBlockProps } from './MDXCodeBlock';
export { MDXBlockquote, type MDXBlockquoteProps } from './MDXBlockquote';
export { MDXTabs, type MDXTabsProps } from './MDXTabs';
export { MDXAccordion, type MDXAccordionProps } from './MDXAccordion';
export { MDXVideo, type MDXVideoProps } from './MDXVideo';
export { MDXImageZoom, type MDXImageZoomProps } from './MDXImageZoom';
export { MDXCodeDemo, type MDXCodeDemoProps } from './MDXCodeDemo';
export {
  MDXCodeInline,
  PrimaryCode,
  SecondaryCode,
  SuccessCode,
  WarningCode,
  ErrorCode,
  type MDXCodeInlineProps,
} from './MDXCodeInline';
