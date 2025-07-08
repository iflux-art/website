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
    'md:grid-cols-2',
    'lg:grid-cols-3',
    'lg:grid-cols-4',
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
          },
        },
      },
    },
  },
};

export default config;