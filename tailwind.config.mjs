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
    // 原有布局相关
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
    
    // 新的响应式网格
    'mobile:grid-cols-1',
    'mobile:grid-cols-2',
    'tablet:grid-cols-2',
    'tablet:grid-cols-3',
    'desktop:grid-cols-3',
    'desktop:grid-cols-4',
    'large:grid-cols-4',
    'large:grid-cols-5',
    'large:grid-cols-6',
    
    // 响应式间距
    'gap-3',
    'gap-4',
    'sm:gap-4',
    'sm:gap-6',
    'mobile:gap-mobile-sm',
    'mobile:gap-mobile-md',
    'tablet:gap-tablet-md',
    'tablet:gap-tablet-lg',
    'desktop:gap-desktop-md',
    'desktop:gap-desktop-lg',
    'large:gap-large-md',
    'large:gap-large-lg',
    
    // 触摸优化
    'touch-manipulation',
    'min-h-touch-small',
    'min-h-touch-medium',
    'min-h-touch-large',
    'min-w-touch-small',
    'min-w-touch-medium',
    'min-w-touch-large',
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
    'mobile:min-h-[240px]',
    'tablet:min-h-[320px]',
    'desktop:min-h-[400px]',
    'large:min-h-[480px]',
    
    // 响应式字体
    'text-mobile-base',
    'text-mobile-lg',
    'text-tablet-base',
    'text-tablet-lg',
    'text-desktop-base',
    'text-desktop-lg',
    'text-large-base',
    'text-large-lg',
    
    // 响应式内边距
    'p-mobile-md',
    'p-tablet-md',
    'p-desktop-md',
    'p-large-md',
    'px-mobile-md',
    'px-tablet-md',
    'px-desktop-md',
    'px-large-md',
    'py-mobile-md',
    'py-tablet-md',
    'py-desktop-md',
    'py-large-md',
    
    // 响应式外边距
    'm-mobile-md',
    'm-tablet-md',
    'm-desktop-md',
    'm-large-md',
    'mx-mobile-md',
    'mx-tablet-md',
    'mx-desktop-md',
    'mx-large-md',
    'my-mobile-md',
    'my-tablet-md',
    'my-desktop-md',
    'my-large-md',
    
    // 交互能力相关
    'touch:opacity-75',
    'mouse:hover:opacity-80',
    'mobile-touch:text-lg',
    'desktop-mouse:hover:scale-105',
    
    // 可访问性相关
    'reduced-motion:transition-none',
    'high-contrast:border-2',
  ],

  theme: {
    // 响应式断点配置
    screens: {
      // 标准断点
      'mobile': { 'max': '768px' },
      'tablet': { 'min': '769px', 'max': '1024px' },
      'desktop': { 'min': '1025px', 'max': '1440px' },
      'large': { 'min': '1441px' },
      
      // 交互能力查询
      'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
      'mouse': { 'raw': '(hover: hover) and (pointer: fine)' },
      
      // 组合查询
      'mobile-touch': { 'raw': '(max-width: 768px) and (hover: none)' },
      'desktop-mouse': { 'raw': '(min-width: 1025px) and (hover: hover)' },
      
      // 方向查询
      'portrait': { 'raw': '(orientation: portrait)' },
      'landscape': { 'raw': '(orientation: landscape)' },
      
      // 可访问性查询
      'reduced-motion': { 'raw': '(prefers-reduced-motion: reduce)' },
      'high-contrast': { 'raw': '(prefers-contrast: high)' },
      
      // 保留原有断点以保持兼容性
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    
    extend: {
      // 响应式间距系统
      spacing: {
        // 移动端间距
        'mobile-xs': '0.5rem',   // 8px
        'mobile-sm': '0.75rem',  // 12px
        'mobile-md': '1rem',     // 16px
        'mobile-lg': '1.5rem',   // 24px
        'mobile-xl': '2rem',     // 32px
        
        // 平板端间距
        'tablet-xs': '0.75rem',  // 12px
        'tablet-sm': '1rem',     // 16px
        'tablet-md': '1.5rem',   // 24px
        'tablet-lg': '2rem',     // 32px
        'tablet-xl': '3rem',     // 48px
        
        // 桌面端间距
        'desktop-xs': '1rem',    // 16px
        'desktop-sm': '1.5rem',  // 24px
        'desktop-md': '2rem',    // 32px
        'desktop-lg': '3rem',    // 48px
        'desktop-xl': '4rem',    // 64px
        
        // 大屏间距
        'large-xs': '1.5rem',    // 24px
        'large-sm': '2rem',      // 32px
        'large-md': '3rem',      // 48px
        'large-lg': '4rem',      // 64px
        'large-xl': '6rem',      // 96px
      },
      
      // 触摸目标尺寸
      minHeight: {
        'touch-small': '44px',   // WCAG AA标准
        'touch-medium': '48px',  // 推荐尺寸
        'touch-large': '56px',   // 大触摸目标
      },
      
      minWidth: {
        'touch-small': '44px',
        'touch-medium': '48px',
        'touch-large': '56px',
      },
      
      // 响应式字体大小
      fontSize: {
        // 移动端字体
        'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'mobile-sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'mobile-base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'mobile-lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'mobile-xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        'mobile-2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        'mobile-3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        'mobile-4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
        
        // 平板端字体
        'tablet-xs': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'tablet-sm': ['1rem', { lineHeight: '1.5rem' }],      // 16px
        'tablet-base': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'tablet-lg': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        'tablet-xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        'tablet-2xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        'tablet-3xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
        'tablet-4xl': ['3rem', { lineHeight: '1' }],          // 48px
        
        // 桌面端字体
        'desktop-xs': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'desktop-sm': ['1rem', { lineHeight: '1.5rem' }],      // 16px
        'desktop-base': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'desktop-lg': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        'desktop-xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        'desktop-2xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        'desktop-3xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
        'desktop-4xl': ['3rem', { lineHeight: '1' }],          // 48px
        
        // 大屏字体
        'large-xs': ['1rem', { lineHeight: '1.5rem' }],       // 16px
        'large-sm': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'large-base': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        'large-lg': ['1.5rem', { lineHeight: '2rem' }],       // 24px
        'large-xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
        'large-2xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        'large-3xl': ['3rem', { lineHeight: '1' }],           // 48px
        'large-4xl': ['3.75rem', { lineHeight: '1' }],        // 60px
      },
      
      // 响应式容器最大宽度
      maxWidth: {
        'mobile': '100%',
        'tablet': '768px',
        'desktop': '1024px',
        'large': '1440px',
        'container-mobile': '100%',
        'container-tablet': '100%',
        'container-desktop': '1200px',
        'container-large': '1400px',
      },
      
      // 响应式网格列数
      gridTemplateColumns: {
        'mobile-1': 'repeat(1, minmax(0, 1fr))',
        'mobile-2': 'repeat(2, minmax(0, 1fr))',
        'tablet-2': 'repeat(2, minmax(0, 1fr))',
        'tablet-3': 'repeat(3, minmax(0, 1fr))',
        'desktop-3': 'repeat(3, minmax(0, 1fr))',
        'desktop-4': 'repeat(4, minmax(0, 1fr))',
        'large-4': 'repeat(4, minmax(0, 1fr))',
        'large-5': 'repeat(5, minmax(0, 1fr))',
        'large-6': 'repeat(6, minmax(0, 1fr))',
      },
      
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