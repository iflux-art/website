/**
 * MDX 配置类型定义
 * 集中管理所有 MDX 相关类型
 */

import type { ComponentProps } from 'react';

/**
 * 自定义组件 Props 类型
 */
import type {
  MDXImageProps,
  MDXLinkProps,
  MDXCodeBlockProps,
  MDXBlockquoteProps,
  MDXCodeInlineProps,
  MDXTabsProps,
  MDXAccordionProps,
  MDXVideoProps,
  MDXImageZoomProps,
  MDXCodeDemoProps,
} from '@/components/mdx';

/**
 * Frontmatter 基础类型
 */
export interface BaseFrontmatter {
  title: string;
  description?: string;
  date?: string | Date;
  tags?: string[];
  draft?: boolean;
  category?: string;
  author?: string;
  image?: string;
  slug?: string;
  lastModified?: string | Date;
  wordCount?: number;
  seo?: Record<string, unknown>;
}

/**
 * MDX 解析选项
 */
export interface MDXOptions {
  /** 组件映射配置 */
  components?: MDXComponents;
  /** 编译选项 */
  compile: {
    parseFrontmatter: boolean;
    development: boolean;
  };
  /** 图片选项 */
  image: {
    defaultWidth: number;
    defaultHeight: number;
    priority: boolean;
    placeholder: string;
    domains: string[];
  };
  /** 链接选项 */
  link: {
    openExternalInNewTab: boolean;
    externalIcon: boolean;
    underline: boolean;
  };
  /** 代码选项 */
  code: {
    showLineNumbers: boolean;
    defaultLanguage: string;
    theme: string;
    wrap: boolean;
  };
}

/**
 * MDX Typography 配置
 */
export interface TypographyConfig {
  DEFAULT: {
    css: {
      // 基础设置
      maxWidth: string;
      color: string;

      // Prose 变量
      '--tw-prose-body': string;
      '--tw-prose-headings': string;
      '--tw-prose-lead': string;
      '--tw-prose-links': string;
      '--tw-prose-bold': string;
      '--tw-prose-counters': string;
      '--tw-prose-bullets': string;
      '--tw-prose-hr': string;
      '--tw-prose-quotes': string;
      '--tw-prose-quote-borders': string;
      '--tw-prose-captions': string;
      '--tw-prose-code': string;
      '--tw-prose-pre-code': string;
      '--tw-prose-pre-bg': string;
      '--tw-prose-th-borders': string;
      '--tw-prose-td-borders': string;
    };
  };
  dark: {
    css: {
      '--tw-prose-body': string;
      '--tw-prose-headings': string;
      '--tw-prose-lead': string;
      '--tw-prose-links': string;
      '--tw-prose-bold': string;
      '--tw-prose-counters': string;
      '--tw-prose-bullets': string;
      '--tw-prose-hr': string;
      '--tw-prose-quotes': string;
      '--tw-prose-quote-borders': string;
      '--tw-prose-captions': string;
      '--tw-prose-code': string;
      '--tw-prose-pre-code': string;
      '--tw-prose-pre-bg': string;
      '--tw-prose-th-borders': string;
      '--tw-prose-td-borders': string;
    };
  };
}

/**
 * MDX 组件类型映射
 */
export interface MDXComponents {
  // 基础组件
  img: React.ComponentType<MDXImageProps>;
  a: React.ComponentType<MDXLinkProps>;
  pre: React.ComponentType<MDXCodeBlockProps>;
  code: React.ComponentType<MDXCodeInlineProps>;
  blockquote: React.ComponentType<MDXBlockquoteProps>;

  // 代码样式变体
  'code.primary': React.ComponentType<MDXCodeInlineProps>;
  'code.secondary': React.ComponentType<MDXCodeInlineProps>;
  'code.success': React.ComponentType<MDXCodeInlineProps>;
  'code.warning': React.ComponentType<MDXCodeInlineProps>;
  'code.error': React.ComponentType<MDXCodeInlineProps>;

  // 扩展组件
  Tabs: React.ComponentType<MDXTabsProps>;
  Accordion: React.ComponentType<MDXAccordionProps>;
  Video: React.ComponentType<MDXVideoProps>;
  ImageZoom: React.ComponentType<MDXImageZoomProps>;
  CodeDemo: React.ComponentType<MDXCodeDemoProps>;
}

/**
 * MDX 组件 Props 类型
 */
export type ComponentsProps = {
  [K in keyof MDXComponents]: ComponentProps<MDXComponents[K]>;
};

/**
 * 统一导出配置类型
 */
export interface MDXConfig {
  options: MDXOptions;
  typography: TypographyConfig;
  components: MDXComponents;
}
