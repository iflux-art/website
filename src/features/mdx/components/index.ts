import { MDXImage } from './MDXImage';
import { MDXLink } from './MDXLink';
import { MDXCodeBlock } from './MDXCodeBlock';

/**
 * MDX 基础组件映射配置
 * 用于覆盖默认的 HTML 元素渲染
 */
export const MDXComponents = {
  // 基础 HTML 组件映射
  img: MDXImage,
  a: MDXLink,
  pre: MDXCodeBlock,

  // 可以在这里添加更多自定义组件映射
} as const;

// 导出单个组件以便需要时单独使用
export { MDXImage, MDXLink, MDXCodeBlock };
