/**
 * MDX 配置
 * 集中管理 MDX 的所有配置选项
 */

import type { MDXOptions, MDXStyleConfig } from '../types/mdx-types';

/**
 * MDX 配置
 */
const MDXConfig = {
  /**
   * MDX 解析和编译选项
   */
  options: {
    compile: {
      parseFrontmatter: true,
      development: process.env.NODE_ENV === 'development',
    },
    image: {
      defaultWidth: 1200,
      defaultHeight: 800,
      priority: false,
      placeholder: 'empty',
      domains: [],
    },
    link: {
      openExternalInNewTab: true,
      externalIcon: true,
      underline: true,
    },
    code: {
      showLineNumbers: true,
      defaultLanguage: 'typescript',
      theme: 'github-dark',
      wrap: true,
    },
  } satisfies MDXOptions,

  /**
   * MDX 解析器配置
   */
  parser: {
    extensions: ['.mdx', '.md'] as const,
    development: process.env.NODE_ENV === 'development',
    options: {
      format: 'mdx' as const,
      development: process.env.NODE_ENV === 'development',
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
        format: 'mdx' as const,
      },
    },
    frontmatter: {
      required: ['title'] as const,
      optional: [
        'description',
        'date',
        'tags',
        'draft',
        'category',
        'author',
        'image',
        'slug',
        'lastModified',
        'wordCount',
        'seo',
      ] as const,
    },
  },

  /**
   * MDX 样式配置
   */
  styles: {
    prose: 'prose dark:prose-invert max-w-none',
    table: {
      wrapper: [
        'my-6 w-full overflow-x-auto',
        'not-prose', // 防止 prose 样式影响
        'rounded-lg border border-gray-200 dark:border-gray-800',
        'shadow-sm dark:shadow-none',
      ].join(' '),
    },

    image: {
      wrapper: [
        'my-6 w-full',
        'flex flex-col items-center',
        'not-prose', // 防止 prose 样式影响
      ].join(' '),

      img: [
        // 基础样式
        'rounded-xl',
        'shadow-md dark:shadow-none',
        'dark:border dark:border-neutral-800',

        // 尺寸控制
        'w-full',
        'max-w-[1200px]',
        'h-auto',
        'object-contain',

        // 响应式调整
        'sm:max-w-[600px]',
        'md:max-w-[800px]',
        'lg:max-w-[1000px]',
        'xl:max-w-[1200px]',

        // 交互效果
        'hover:shadow-lg dark:hover:shadow-md',
        'transition-shadow duration-200',
      ].join(' '),

      caption: ['text-center text-sm', 'text-muted-foreground', 'mt-3 px-4', 'max-w-prose'].join(
        ' '
      ),

      group: {
        wrapper: 'grid grid-cols-2 gap-4 my-6',
        item: 'flex flex-col items-center',
      },

      zoom: {
        overlay: 'fixed inset-0 bg-black/80 z-50',
        content: 'fixed inset-0 flex items-center justify-center z-50',
        img: 'max-h-[90vh] max-w-[90vw] object-contain',
      },
    },

    link: {
      base: 'relative inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80',
      external: 'cursor-alias',
      icon: 'h-3 w-3',
      underline:
        'after:absolute after:left-1/2 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:left-0 hover:after:w-full',
    },

    codeBlock: [
      // 基础样式
      'relative font-mono text-sm',
      // 间距和边框
      'p-4 my-4',
      'rounded-lg',
      // 背景和边框
      'bg-muted/50',
      'dark:bg-muted/20',
      'border border-border',
      // 其他视觉效果
      'overflow-x-auto',
      'scrollbar-thin scrollbar-thumb-border',
    ].join(' '),

    codeInline: {
      base: 'rounded bg-muted px-1 py-0.5 font-mono text-sm before:content-[""] after:content-[""]',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
    },
  } satisfies MDXStyleConfig,
} as const;

// 导出便捷访问
export const MDX_DEFAULT_OPTIONS = MDXConfig.options;
export const MDX_PARSE_OPTIONS = MDXConfig.parser;
export const MDX_STYLE_CONFIG = MDXConfig.styles;

// 默认导出完整配置
export default MDXConfig;
