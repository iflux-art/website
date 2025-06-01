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
            // 表格样式
            'table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            'thead': {
              borderBottom: '2px solid var(--tw-prose-th-borders)',
            },
            'tbody tr': {
              borderBottom: '1px solid var(--tw-prose-td-borders)',
            },
            'th': {
              padding: '0.75em 1em',
              fontWeight: '600',
              textAlign: 'left',
              backgroundColor: 'var(--tw-prose-th-bg)',
              color: 'var(--tw-prose-th)',
            },
            'td': {
              padding: '0.75em 1em',
              verticalAlign: 'top',
              color: 'var(--tw-prose-td)',
            },
            'thead th:first-child': {
              paddingLeft: '1em',
            },
            'thead th:last-child': {
              paddingRight: '1em',
            },
            'tbody td:first-child': {
              paddingLeft: '1em',
            },
            'tbody td:last-child': {
              paddingRight: '1em',
            },
            'tbody tr:last-child': {
              borderBottom: 'none',
            },
            // 暗色模式
            '--tw-prose-th-bg': 'var(--tw-prose-bg)',
            '--tw-prose-th-borders': 'var(--tw-prose-borders)',
            '--tw-prose-td-borders': 'var(--tw-prose-borders)',
            '--tw-prose-th': 'var(--tw-prose-headings)',
            '--tw-prose-td': 'var(--tw-prose-body)',
          },
        },
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
