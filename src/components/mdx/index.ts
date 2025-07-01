/**
 * MDX 组件导出
 * 从统一配置中重新导出必要的组件和配置
 */

// 导出渲染器和提供者
export { MDXRenderer } from './mdx-renderer';

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
export { MDXImage, type MDXImageProps } from './mdx-image';
export { MDXLink, type MDXLinkProps } from './mdx-link';
export { MDXCodeBlock, type MDXCodeBlockProps } from './mdx-code-block';
export { MDXBlockquote, type MDXBlockquoteProps } from './mdx-blockquote';
export { MDXTabs, type MDXTabsProps } from './mdx-tabs';
export { MDXAccordion, type MDXAccordionProps } from './mdx-accordion';
export { MDXVideo, type MDXVideoProps } from './mdx-video';
export { MDXImageZoom, type MDXImageZoomProps } from './mdx-image-zoom';
export { MDXCodeDemo, type MDXCodeDemoProps } from './mdx-code-demo';
export {
  MDXCodeInline,
  PrimaryCode,
  SecondaryCode,
  SuccessCode,
  WarningCode,
  ErrorCode,
  type MDXCodeInlineProps,
} from './mdx-codeInline';
