/**
 * MDX Typography 配置类型
 */
export interface TypographyConfig {
  css: {
    maxWidth: string;
    color: string;
    // 主题变量
    '--tw-prose-body': string;
    '--tw-prose-headings': string;
    '--tw-prose-links': string;
    '--tw-prose-bold': string;
    '--tw-prose-counters': string;
    '--tw-prose-bullets': string;
    '--tw-prose-hr': string;
    '--tw-prose-quotes': string;
    '--tw-prose-quote-borders': string;
    '--tw-prose-captions': string;
    '--tw-prose-th-borders': string;
    '--tw-prose-td-borders': string;

    // 表格样式
    table: {
      width: string;
      marginTop: string;
      marginBottom: string;
      borderCollapse: string;
    };
    thead: {
      borderBottomWidth: string;
      borderBottomColor: string;
    };
    'thead th': {
      color: string;
      fontWeight: string;
      backgroundColor: string;
      padding: string;
      textAlign: string;
    };
    'tbody tr': {
      borderBottomWidth: string;
      borderBottomColor: string;
      '&:last-child': {
        borderBottomWidth: string;
      };
    };
    'tbody td': {
      padding: string;
      verticalAlign: string;
    };

    // 列表样式
    ul: {
      listStyleType: string;
      paddingLeft: string;
    };
    ol: {
      listStyleType: string;
      paddingLeft: string;
    };
    li: {
      marginTop: string;
      marginBottom: string;
    };

    // 引用样式
    blockquote: {
      borderLeftWidth: string;
      borderLeftColor: string;
      paddingLeft: string;
      fontStyle: string;
      color: string;
    };
  };
}

export const typographyConfig: { DEFAULT: TypographyConfig } = {
  DEFAULT: {
    css: {
      maxWidth: 'none',
      color: 'var(--foreground)',
      '--tw-prose-body': 'var(--foreground)',
      '--tw-prose-headings': 'var(--foreground)',
      '--tw-prose-links': 'var(--primary)',
      '--tw-prose-bold': 'var(--foreground)',
      '--tw-prose-counters': 'var(--muted-foreground)',
      '--tw-prose-bullets': 'var(--muted-foreground)',
      '--tw-prose-hr': 'var(--border)',
      '--tw-prose-quotes': 'var(--foreground)',
      '--tw-prose-quote-borders': 'var(--border)',
      '--tw-prose-captions': 'var(--muted-foreground)',
      '--tw-prose-th-borders': 'var(--border)',
      '--tw-prose-td-borders': 'var(--border)',

      table: {
        width: '100%',
        marginTop: '2rem',
        marginBottom: '2rem',
        borderCollapse: 'collapse',
      },
      thead: {
        borderBottomWidth: '1px',
        borderBottomColor: 'var(--border)',
      },
      'thead th': {
        color: 'var(--foreground)',
        fontWeight: '600',
        backgroundColor: 'var(--muted)',
        padding: '0.75rem',
        textAlign: 'left',
      },
      'tbody tr': {
        borderBottomWidth: '1px',
        borderBottomColor: 'var(--border)',
        '&:last-child': {
          borderBottomWidth: '0',
        },
      },
      'tbody td': {
        padding: '0.75rem',
        verticalAlign: 'baseline',
      },

      ul: {
        listStyleType: 'disc',
        paddingLeft: '1.625rem',
      },
      ol: {
        listStyleType: 'decimal',
        paddingLeft: '1.625rem',
      },
      li: {
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
      },

      blockquote: {
        borderLeftWidth: '2px',
        borderLeftColor: 'var(--border)',
        paddingLeft: '1rem',
        fontStyle: 'italic',
        color: 'var(--muted-foreground)',
      },
    },
  },
} as const;
