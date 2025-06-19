// 导出主要组件
export { MDXRenderer } from './MDXRenderer';
export { MDXComponents, MDXImage, MDXLink, MDXCodeBlock } from './components';

// 导出配置
export { MDX_STYLE_CONFIG, MDX_DEFAULT_OPTIONS, MDX_PARSE_OPTIONS } from './config';

// 导出类型
export type {
  MDXContent,
  MDXRendererProps,
  MDXOptions,
  CustomComponentProps,
  MDXImageProps,
  MDXLinkProps,
  CodeBlockProps,
  Frontmatter,
} from './types';
