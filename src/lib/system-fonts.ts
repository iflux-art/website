/**
 * 系统字体配置
 *
 * 使用系统默认字体，避免依赖外部字体服务
 */

// 创建一个模拟的字体对象，兼容 Next.js 的字体 API
const createMockFont = (variableName: string, fallbackFonts: string) => {
  return {
    // 变量名
    variable: variableName,
    // 样式
    style: {
      fontFamily: fallbackFonts,
    },
    // 模拟 Next.js 字体对象的其他属性
    className: '',
    // 模拟 CSS 选择器
    selector: `.${variableName.substring(2)}`,
  };
};

/**
 * 系统 Sans 字体
 */
export const fontSans = createMockFont(
  '--font-geist-sans',
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
);

/**
 * 系统 Mono 字体
 */
export const fontMono = createMockFont(
  '--font-geist-mono',
  'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
);

/**
 * 系统中文字体
 */
export const fontChinese = createMockFont(
  '--font-chinese',
  '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif'
);

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
