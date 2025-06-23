/**
 * MDX 样式配置
 * 统一管理所有 MDX 相关样式
 */

import type { TypographyConfig } from './types';

/**
 * Typography 配置
 * 用于 Tailwind Typography 插件
 */
export const typographyConfig: TypographyConfig = {
  DEFAULT: {
    css: {
      // 基础设置
      maxWidth: 'none',
      color: 'var(--foreground)',

      // Prose 变量设置
      '--tw-prose-body': 'var(--foreground)',
      '--tw-prose-headings': 'var(--foreground)',
      '--tw-prose-lead': 'var(--muted-foreground)',
      '--tw-prose-links': 'var(--primary)',
      '--tw-prose-bold': 'var(--foreground)',
      '--tw-prose-counters': 'var(--foreground)',
      '--tw-prose-bullets': 'var(--foreground)',
      '--tw-prose-hr': 'var(--border)',
      '--tw-prose-quotes': 'var(--foreground)',
      '--tw-prose-quote-borders': 'var(--border)',
      '--tw-prose-captions': 'var(--muted-foreground)',
      '--tw-prose-code': 'var(--primary)',
      '--tw-prose-pre-code': 'var(--primary)',
      '--tw-prose-pre-bg': 'var(--muted)',
      '--tw-prose-th-borders': 'var(--border)',
      '--tw-prose-td-borders': 'var(--border)',
    },
  },
  dark: {
    css: {
      '--tw-prose-body': 'var(--dark-foreground)',
      '--tw-prose-headings': 'var(--dark-foreground)',
      '--tw-prose-lead': 'var(--dark-muted-foreground)',
      '--tw-prose-links': 'var(--dark-primary)',
      '--tw-prose-bold': 'var(--dark-foreground)',
      '--tw-prose-counters': 'var(--dark-foreground)',
      '--tw-prose-bullets': 'var(--dark-foreground)',
      '--tw-prose-hr': 'var(--dark-border)',
      '--tw-prose-quotes': 'var(--dark-foreground)',
      '--tw-prose-quote-borders': 'var(--dark-border)',
      '--tw-prose-captions': 'var(--dark-muted-foreground)',
      '--tw-prose-code': 'var(--dark-primary)',
      '--tw-prose-pre-code': 'var(--dark-primary)',
      '--tw-prose-pre-bg': 'var(--dark-muted)',
      '--tw-prose-th-borders': 'var(--dark-border)',
      '--tw-prose-td-borders': 'var(--dark-border)',
    },
  },
};

/**
 * MDX 内联样式配置
 */
export const MDXStyles = {
  // 基础样式
  prose: 'prose dark:prose-invert max-w-none',

  // 链接样式
  link: {
    base: 'relative inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80',
    external: 'cursor-alias',
    icon: 'h-3 w-3',
    underline:
      'after:absolute after:left-1/2 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:left-0 hover:after:w-full',
  },

  // 代码块样式
  codeBlock: [
    'relative font-mono text-sm',
    'p-4 my-4',
    'rounded-lg',
    'bg-muted/50 dark:bg-muted/20',
    'border border-border',
    'overflow-x-auto',
    'scrollbar-thin scrollbar-thumb-border',
  ].join(' '),

  // 行内代码样式
  codeInline: {
    base: 'rounded bg-muted px-1 py-0.5 font-mono text-sm before:content-[""] after:content-[""]',
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  },

  // 图片样式
  image: {
    wrapper: ['my-6 w-full', 'flex flex-col items-center', 'not-prose'].join(' '),
    img: [
      'rounded-xl',
      'shadow-md dark:shadow-none',
      'dark:border dark:border-neutral-800',
      'w-full max-w-[1200px] h-auto object-contain',
      'hover:shadow-lg dark:hover:shadow-md',
      'transition-shadow duration-200',
    ].join(' '),
    caption: ['text-center text-sm', 'text-muted-foreground', 'mt-3 px-4', 'max-w-prose'].join(' '),
  },
};
