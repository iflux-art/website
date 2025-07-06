import type { TypographyConfig } from '@/types/mdx-types';

/**
 * 基于@tailwindcss/typography优化的MDX样式配置
 * 需要确保tailwind.config.js中已配置typography插件
 *
 * 示例配置:
 * plugins: [
 *   require('@tailwindcss/typography')({
 *     className: 'prose'
 *   })
 * ]
 *
 * 保留必要自定义样式，移除冗余定义
 */
export const typographyConfig = {
  DEFAULT: {
    css: {
      '--tw-prose-body': 'var(--foreground)',
      '--tw-prose-headings': 'var(--foreground)',
      '--tw-prose-lead': 'var(--muted-foreground)',
      '--tw-prose-links': 'var(--primary)',
      '--tw-prose-bold': 'var(--foreground)',
      '--tw-prose-counters': 'var(--muted-foreground)',
      '--tw-prose-bullets': 'var(--muted-foreground)',
      '--tw-prose-hr': 'var(--border)',
      '--tw-prose-quotes': 'var(--foreground)',
      '--tw-prose-quote-borders': 'var(--border)',
      '--tw-prose-captions': 'var(--muted-foreground)',
      '--tw-prose-code': 'var(--primary)',
      '--tw-prose-pre-code': 'var(--foreground)',
      '--tw-prose-pre-bg': 'var(--muted)',
      '--tw-prose-th-borders': 'var(--border)',
      '--tw-prose-td-borders': 'var(--border)',

      // 关键组件覆盖样式
      pre: {
        borderRadius: '0.5rem',
        padding: '1rem',
        overflowX: 'auto',
      },
      code: {
        padding: '0.2em 0.4em',
        borderRadius: '0.25rem',
        backgroundColor: 'var(--muted)',
      },
      img: {
        borderRadius: '0.5rem',
        marginTop: '1.5em',
        marginBottom: '1.5em',
      },
    },
  },
  dark: {
    css: {
      '--tw-prose-body': 'var(--dark-foreground)',
      '--tw-prose-headings': 'var(--dark-foreground)',
      '--tw-prose-lead': 'var(--dark-muted-foreground)',
      '--tw-prose-links': 'var(--dark-primary)',
      '--tw-prose-bold': 'var(--dark-foreground)',
      '--tw-prose-counters': 'var(--dark-muted-foreground)',
      '--tw-prose-bullets': 'var(--dark-muted-foreground)',
      '--tw-prose-hr': 'var(--dark-border)',
      '--tw-prose-quotes': 'var(--dark-foreground)',
      '--tw-prose-quote-borders': 'var(--dark-border)',
      '--tw-prose-captions': 'var(--dark-muted-foreground)',
      '--tw-prose-code': 'var(--dark-primary)',
      '--tw-prose-pre-code': 'var(--dark-foreground)',
      '--tw-prose-pre-bg': 'var(--dark-muted)',
      '--tw-prose-th-borders': 'var(--dark-border)',
      '--tw-prose-td-borders': 'var(--dark-border)',
    },
  },
} as const satisfies Record<string, TypographyConfig>;

/**
 * 精简后的公共样式工具类
 */
export const commonStyles = {
  rounded: {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
  },
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
  },
  transition: {
    opacity: 'transition-opacity duration-200',
  },
};

/**
 * 精简后的MDX组件样式
 */
export const MDXStyles = {
  prose: 'prose dark:prose-invert max-w-none',

  // 关键组件样式
  codeBlock: 'relative rounded-lg overflow-hidden',
  image: 'rounded-lg shadow-md',
  card: 'rounded-lg border bg-card shadow-sm',

  // 代码块样式
  code: {
    container: 'relative rounded-lg border bg-muted overflow-hidden',
    header: 'flex items-center justify-between px-4 py-2 border-b',
    content: 'p-4 overflow-auto',
  },

  // 提示框样式
  callout: {
    base: 'flex rounded-lg border p-4 gap-3',
    icon: 'h-5 w-5 mt-0.5 flex-shrink-0',
    content: 'flex-1',
    title: 'mb-2 font-semibold',
    body: 'prose-sm [&>p]:m-0',
  },

  // 表格样式
  table: {
    container: 'w-full border-collapse',
    header: 'bg-muted',
    row: 'border-b border-border hover:bg-muted/50',
  },

  // 标签页样式
  tabs: {
    base: 'space-y-4',
    nav: 'flex gap-1 border-b border-border',
    tab: 'relative px-4 py-2 text-sm font-medium transition-colors',
    panel: 'pt-4',
    variants: {
      line: {
        nav: '',
        tab: 'border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary',
      },
      pill: {
        nav: 'gap-2',
        tab: 'rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
      },
      enclosed: {
        nav: 'border rounded-t-lg overflow-hidden',
        tab: 'border-r last:border-r-0 data-[state=active]:bg-muted',
      },
    },
    sizes: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },

  // 媒体样式
  media: {
    base: 'relative rounded-lg overflow-hidden',
  },
};
