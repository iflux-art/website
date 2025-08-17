/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/mdx-components.tsx",
  ],
  plugins: [
    require('@tailwindcss/typography')({
      className: 'prose',
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
    removeDeprecatedGapUtilities: true,
  },

  // 确保关键的 CSS 类不会被 PurgeCSS 删除
  safelist: [
    // 布局相关
    'grid-cols-1',
    'sm:grid-cols-2',
    'md:grid-cols-2',
    'lg:grid-cols-1',
    'lg:grid-cols-2',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
    'xl:grid-cols-2',
    'xl:grid-cols-3',
    'xl:grid-cols-5',
    '2xl:grid-cols-3',
    // 响应式间距
    'gap-3',
    'gap-4',
    'sm:gap-4',
    'sm:gap-6',
    // 触摸优化
    'touch-manipulation',
    'min-h-[44px]',
    'min-h-[32px]',
    'min-h-[36px]',
    'min-h-[24px]',
    'min-h-[28px]',
    'min-h-[20px]',
    // 响应式高度
    'min-h-[280px]',
    'sm:min-h-[320px]',
    'md:min-h-[360px]',
  ],

  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: 'oklch(var(--foreground))',
            a: {
              color: 'oklch(var(--primary))',
              '&:hover': {
                color: 'oklch(var(--primary))',
              },
            },
            // 表格样式
            table: {
              borderCollapse: 'collapse',
              width: '100%',
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            'thead th': {
              borderBottom: '1px solid oklch(var(--border))',
              paddingTop: '0.75em',
              paddingBottom: '0.75em',
              paddingLeft: '0.75em',
              paddingRight: '0.75em',
              textAlign: 'left',
              fontWeight: '600',
              color: 'oklch(var(--foreground))',
            },
            'tbody tr': {
              borderBottom: '1px solid oklch(var(--border))',
            },
            'tbody tr:last-child': {
              borderBottom: 'none',
            },
            'tbody td': {
              paddingTop: '0.75em',
              paddingBottom: '0.75em',
              paddingLeft: '0.75em',
              paddingRight: '0.75em',
              verticalAlign: 'top',
            },
            'tbody tr:nth-child(odd)': {
              backgroundColor: 'oklch(var(--muted) / 0.3)',
            },
          },
        },
      },
    },
  },
};

export default config;