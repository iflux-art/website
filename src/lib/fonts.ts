/**
 * 字体配置
 *
 * 使用系统字体，避免依赖外部字体服务
 * 特别是在中国网络环境下，Google 字体服务可能无法正常访问
 */

// 导入系统字体配置
import { fontSans, fontMono, fontChinese } from './system-fonts';

// 注意：如果需要使用本地字体文件，可以取消注释下面的导入
// import { fontSans, fontMono, fontChinese } from './local-fonts';

// 注意：如果需要使用 Google 字体，可以取消注释下面的导入
// 但在中国网络环境下可能会导致加载问题
/*
import { Geist as GeistSans, Geist_Mono as GeistMono } from 'next/font/google';

export const fontSans = GeistSans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const fontMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const fontChinese = {
  variable: '--font-chinese',
};
*/

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
