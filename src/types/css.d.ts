/**
 * CSS相关的TypeScript声明
 */

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

/**
 * CSS自定义属性类型声明
 */
declare global {
  interface CSSStyleDeclaration {
    // 断点变量
    '--breakpoint-mobile': string;
    '--breakpoint-tablet-min': string;
    '--breakpoint-tablet-max': string;
    '--breakpoint-desktop-min': string;
    '--breakpoint-desktop-max': string;
    '--breakpoint-large': string;

    // 移动端间距变量
    '--spacing-mobile-xs': string;
    '--spacing-mobile-sm': string;
    '--spacing-mobile-md': string;
    '--spacing-mobile-lg': string;
    '--spacing-mobile-xl': string;

    // 平板端间距变量
    '--spacing-tablet-xs': string;
    '--spacing-tablet-sm': string;
    '--spacing-tablet-md': string;
    '--spacing-tablet-lg': string;
    '--spacing-tablet-xl': string;

    // 桌面端间距变量
    '--spacing-desktop-xs': string;
    '--spacing-desktop-sm': string;
    '--spacing-desktop-md': string;
    '--spacing-desktop-lg': string;
    '--spacing-desktop-xl': string;

    // 大屏间距变量
    '--spacing-large-xs': string;
    '--spacing-large-sm': string;
    '--spacing-large-md': string;
    '--spacing-large-lg': string;
    '--spacing-large-xl': string;

    // 触摸目标尺寸
    '--touch-target-small': string;
    '--touch-target-medium': string;
    '--touch-target-large': string;

    // 容器最大宽度
    '--container-mobile': string;
    '--container-tablet': string;
    '--container-desktop': string;
    '--container-large': string;

    // 响应式字体大小变量
    '--font-mobile-xs': string;
    '--font-mobile-sm': string;
    '--font-mobile-base': string;
    '--font-mobile-lg': string;
    '--font-mobile-xl': string;
    '--font-mobile-2xl': string;
    '--font-mobile-3xl': string;
    '--font-mobile-4xl': string;

    '--font-tablet-xs': string;
    '--font-tablet-sm': string;
    '--font-tablet-base': string;
    '--font-tablet-lg': string;
    '--font-tablet-xl': string;
    '--font-tablet-2xl': string;
    '--font-tablet-3xl': string;
    '--font-tablet-4xl': string;

    '--font-desktop-xs': string;
    '--font-desktop-sm': string;
    '--font-desktop-base': string;
    '--font-desktop-lg': string;
    '--font-desktop-xl': string;
    '--font-desktop-2xl': string;
    '--font-desktop-3xl': string;
    '--font-desktop-4xl': string;

    '--font-large-xs': string;
    '--font-large-sm': string;
    '--font-large-base': string;
    '--font-large-lg': string;
    '--font-large-xl': string;
    '--font-large-2xl': string;
    '--font-large-3xl': string;
    '--font-large-4xl': string;
  }
}

export {};
