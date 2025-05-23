/**
 * 主题和颜色工具函数
 * 提供主题和颜色相关的辅助功能
 */

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * 主题存储键
 */
export const THEME_STORAGE_KEY = 'iflux-theme-preference';

/**
 * 获取存储的主题
 * @returns 存储的主题或 undefined
 */
export function getStoredTheme(): Theme | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (storedTheme as Theme) || undefined;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return undefined;
  }
}

/**
 * 存储主题
 * @param theme 要存储的主题
 */
export function storeTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Error storing theme in localStorage:', error);
  }
}

/**
 * 获取系统主题偏好
 * @returns 系统主题偏好 ('dark' 或 'light')
 */
export function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * 分类颜色映射
 *
 * 将传统颜色名称（如 blue, green, orange）映射到使用 CSS 变量或 OKLCH 颜色的类名
 */
export const categoryColors: Record<
  string,
  { bg: string; text: string; border: string; hover: string }
> = {
  // 主要颜色
  blue: {
    bg: 'bg-[oklch(0.96_0.03_240/0.2)]',
    text: 'text-[oklch(0.5_0.15_240)]',
    border: 'border-[oklch(0.85_0.1_240/0.3)]',
    hover: 'hover:bg-[oklch(0.96_0.03_240/0.3)]',
  },
  green: {
    bg: 'bg-[oklch(0.96_0.03_140/0.2)]',
    text: 'text-[oklch(0.5_0.15_140)]',
    border: 'border-[oklch(0.85_0.1_140/0.3)]',
    hover: 'hover:bg-[oklch(0.96_0.03_140/0.3)]',
  },
  orange: {
    bg: 'bg-[oklch(0.96_0.03_60/0.2)]',
    text: 'text-[oklch(0.5_0.15_60)]',
    border: 'border-[oklch(0.85_0.1_60/0.3)]',
    hover: 'hover:bg-[oklch(0.96_0.03_60/0.3)]',
  },
  red: {
    bg: 'bg-[oklch(0.96_0.03_20/0.2)]',
    text: 'text-[oklch(0.5_0.15_20)]',
    border: 'border-[oklch(0.85_0.1_20/0.3)]',
    hover: 'hover:bg-[oklch(0.96_0.03_20/0.3)]',
  },
  purple: {
    bg: 'bg-[oklch(0.96_0.03_300/0.2)]',
    text: 'text-[oklch(0.5_0.15_300)]',
    border: 'border-[oklch(0.85_0.1_300/0.3)]',
    hover: 'hover:bg-[oklch(0.96_0.03_300/0.3)]',
  },
  teal: {
    bg: 'bg-[oklch(0.96_0.03_180/0.2)]',
    text: 'text-[oklch(0.5_0.15_180)]',
    border: 'border-[oklch(0.85_0.1_180/0.3)]',
    hover: 'hover:bg-[oklch(0.96_0.03_180/0.3)]',
  },

  // 暗色模式映射
  'dark:blue': {
    bg: 'dark:bg-[oklch(0.2_0.1_240/0.3)]',
    text: 'dark:text-[oklch(0.8_0.1_240)]',
    border: 'dark:border-[oklch(0.3_0.1_240/0.5)]',
    hover: 'dark:hover:bg-[oklch(0.2_0.1_240/0.4)]',
  },
  'dark:green': {
    bg: 'dark:bg-[oklch(0.2_0.1_140/0.3)]',
    text: 'dark:text-[oklch(0.8_0.1_140)]',
    border: 'dark:border-[oklch(0.3_0.1_140/0.5)]',
    hover: 'dark:hover:bg-[oklch(0.2_0.1_140/0.4)]',
  },
  'dark:orange': {
    bg: 'dark:bg-[oklch(0.2_0.1_60/0.3)]',
    text: 'dark:text-[oklch(0.8_0.1_60)]',
    border: 'dark:border-[oklch(0.3_0.1_60/0.5)]',
    hover: 'dark:hover:bg-[oklch(0.2_0.1_60/0.4)]',
  },
  'dark:red': {
    bg: 'dark:bg-[oklch(0.2_0.1_20/0.3)]',
    text: 'dark:text-[oklch(0.8_0.1_20)]',
    border: 'dark:border-[oklch(0.3_0.1_20/0.5)]',
    hover: 'dark:hover:bg-[oklch(0.2_0.1_20/0.4)]',
  },
  'dark:purple': {
    bg: 'dark:bg-[oklch(0.2_0.1_300/0.3)]',
    text: 'dark:text-[oklch(0.8_0.1_300)]',
    border: 'dark:border-[oklch(0.3_0.1_300/0.5)]',
    hover: 'dark:hover:bg-[oklch(0.2_0.1_300/0.4)]',
  },
  'dark:teal': {
    bg: 'dark:bg-[oklch(0.2_0.1_180/0.3)]',
    text: 'dark:text-[oklch(0.8_0.1_180)]',
    border: 'dark:border-[oklch(0.3_0.1_180/0.5)]',
    hover: 'dark:hover:bg-[oklch(0.2_0.1_180/0.4)]',
  },
};

/**
 * 获取分类颜色类名
 *
 * @param color 颜色名称（如 blue, green, orange）
 * @returns 包含背景、文本和边框颜色的类名字符串
 */
export function getCategoryColorClasses(color: string): string {
  const colorData = categoryColors[color] || categoryColors.blue; // 默认使用蓝色
  return `${colorData.bg} ${colorData.text} ${colorData.border} ${colorData.hover}`;
}

/**
 * 获取分类卡片颜色类名
 *
 * @param color 颜色名称（如 blue, green, orange）
 * @returns 包含背景、文本和边框颜色的类名字符串，适用于卡片
 */
export function getCategoryCardClasses(color: string): string {
  const colorData = categoryColors[color] || categoryColors.blue; // 默认使用蓝色
  const darkColorData = categoryColors[`dark:${color}`] || categoryColors['dark:blue'];

  return `${colorData.bg} ${colorData.text} ${colorData.border} ${colorData.hover} ${darkColorData.bg} ${darkColorData.text} ${darkColorData.border} ${darkColorData.hover}`;
}

/**
 * 标签颜色映射
 *
 * 将传统颜色名称映射到使用 CSS 变量或 OKLCH 颜色的类名
 */
export const tagColors: Record<string, { bg: string; text: string; border: string }> = {
  default: {
    bg: 'bg-muted/50',
    text: 'text-muted-foreground',
    border: 'border-border/50',
  },
  blue: {
    bg: 'bg-[oklch(0.96_0.03_240/0.2)]',
    text: 'text-[oklch(0.5_0.15_240)]',
    border: 'border-[oklch(0.85_0.1_240/0.3)]',
  },
  green: {
    bg: 'bg-[oklch(0.96_0.03_140/0.2)]',
    text: 'text-[oklch(0.5_0.15_140)]',
    border: 'border-[oklch(0.85_0.1_140/0.3)]',
  },
  orange: {
    bg: 'bg-[oklch(0.96_0.03_60/0.2)]',
    text: 'text-[oklch(0.5_0.15_60)]',
    border: 'border-[oklch(0.85_0.1_60/0.3)]',
  },
  red: {
    bg: 'bg-[oklch(0.96_0.03_20/0.2)]',
    text: 'text-[oklch(0.5_0.15_20)]',
    border: 'border-[oklch(0.85_0.1_20/0.3)]',
  },
};

/**
 * 获取标签颜色类名
 *
 * @param color 颜色名称（如 blue, green, orange）
 * @returns 包含背景、文本和边框颜色的类名字符串
 */
export function getTagColorClasses(color: string): string {
  const colorData = tagColors[color] || tagColors.default;
  return `${colorData.bg} ${colorData.text} ${colorData.border}`;
}
