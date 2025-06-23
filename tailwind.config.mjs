import { typographyConfig } from "./src/config/mdx";
import { themeConfig } from "./src/config/theme";
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
        ...themeConfig.light,
        dark: themeConfig.dark,
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: typographyConfig,
      keyframes: {
        loading: {
          '0%': {
            opacity: '0.8',
            width: '0%'
          },
          '20%': {
            opacity: '1',
            width: '20%'
          },
          '60%': {
            opacity: '0.8',
            width: '60%'
          },
          '100%': {
            opacity: '1',
            width: '100%'
          }
        }
      },
      animation: {
        'loading': 'loading 2.5s ease-out forwards'
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