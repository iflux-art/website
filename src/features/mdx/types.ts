/**
 * MDX 相关类型定义
 */

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { ComponentType, ReactNode } from 'react';

// 可能的 frontmatter 值类型
type FrontmatterValue = string | number | boolean | string[] | Date | null | undefined;

// MDX 内容类型
export interface MDXContent {
  source: string;
  frontmatter?: Record<string, FrontmatterValue>;
  compiled?: MDXRemoteSerializeResult;
}

// MDX 渲染器属性
export interface MDXRendererProps {
  content: MDXRemoteSerializeResult | string;
  options?: MDXOptions;
}

// MDX 配置选项
export interface MDXOptions {
  components?: Record<string, ComponentType<{ children?: ReactNode }>>;
  scope?: Record<string, unknown>;
}

// 自定义组件属性
export interface CustomComponentProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

// 图片组件属性
export interface MDXImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
}

// 链接组件属性
export interface MDXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
}

// 代码块组件属性
export interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
  filename?: string;
  language?: string;
}

// Frontmatter 类型
export interface Frontmatter {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  draft?: boolean;
  category?: string;
  author?: string;
  image?: string;
  slug?: string;
  lastModified?: string;
  wordCount?: number;
}
