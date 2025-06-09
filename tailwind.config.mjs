/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/mdx-components.tsx",
  ],
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
        code: ["var(--font-geist-mono)"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
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
            '--tw-prose-code': 'var(--foreground)',
            '--tw-prose-pre-code': 'var(--foreground)',
            '--tw-prose-pre-bg': 'var(--muted)',
            '--tw-prose-th-borders': 'var(--border)',
            '--tw-prose-td-borders': 'var(--border)',
            'table': {
              width: '100%',
              borderCollapse: 'collapse',
              borderSpacing: 0,
              marginTop: '2em',
              marginBottom: '2em',
              lineHeight: '1.7142857'
            },
            'thead': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--border)'
            },
            'thead th': {
              color: 'var(--foreground)',
              fontWeight: '600',
              backgroundColor: 'var(--muted)',
              borderBottom: '1px solid var(--border)',
              padding: '0.75rem',
              textAlign: 'left'
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--border)'
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0'
            },
            'tbody td': {
              padding: '0.75rem',
              verticalAlign: 'baseline'
            },
            'a:hover': {
              color: 'var(--primary)',
              textDecoration: 'underline'
            },
            'a:visited': {
              color: 'var(--primary)',
            },
            img: {
              marginTop: '2em',
              marginBottom: '2em'
            },
            video: {
              marginTop: '2em',
              marginBottom: '2em'
            },
            figure: {
              marginTop: '2em',
              marginBottom: '2em'
            },
            'figure figcaption': {
              color: 'var(--muted-foreground)',
              fontStyle: 'italic'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            }
          }
        }
      },
    },
  },
  // 在 Tailwind CSS v4 中，插件的使用方式有所变化
  // 注意：Typography 插件同时在此处和 globals.css 中通过 @plugin 指令导入
  // 这是必要的：此处导入用于配置插件，globals.css 中导入确保样式在正确位置加载
  plugins: [
    require('@tailwindcss/typography'),
  ],

  // 确保关键的 CSS 类不会被 PurgeCSS 删除
  safelist: [
    // 主题相关
    'dark',
    'light',
    // 布局相关
    'grid-cols-1',
    'md:grid-cols-2',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
  ],
};

export default config;