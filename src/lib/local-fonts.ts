import localFont from 'next/font/local';

/**
 * 本地 Geist Sans 字体
 */
export const fontSans = localFont({
  src: [
    {
      path: '../../public/fonts/GeistSans-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistSans-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistSans-Black.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistSans-UltraBlack.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
});

/**
 * 本地 Geist Mono 字体
 */
export const fontMono = localFont({
  src: [
    {
      path: '../../public/fonts/GeistMono-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistMono-UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistMono-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistMono-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistMono-Black.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GeistMono-UltraBlack.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
});

/**
 * 本地中文字体
 * 
 * 使用系统默认中文字体
 */
export const fontChinese = {
  variable: '--font-chinese',
};

/**
 * 获取字体类名
 * 
 * 组合所有字体的类名，用于应用到 HTML 元素
 * 
 * @returns 字体类名字符串
 */
export function getFontClassName(): string {
  return [fontSans.variable, fontMono.variable].join(' ');
}
