/**
 * 主题工具函数
 * 提供主题相关的辅助功能
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
 * 主题过渡类名
 */
export const THEME_TRANSITION_CLASS = 'theme-transition';

/**
 * 获取存储的主题
 * @returns 存储的主题或 undefined
 */
export function getStoredTheme(): Theme | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme as Theme || undefined;
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
 * 应用主题过渡效果
 * 添加过渡类，然后在过渡完成后移除
 *
 * 优化版本：
 * - 使用 requestAnimationFrame 确保在下一帧应用过渡效果
 * - 只影响颜色相关的 CSS 属性，不触发布局重新计算
 * - 减少过渡持续时间，提高响应速度
 * - 兼容 Tailwind CSS v4 的 @theme 指令
 */
export function applyThemeTransition(): void {
  if (typeof window === 'undefined') return;

  const html = document.documentElement;

  // 使用 requestAnimationFrame 确保在下一帧应用过渡效果
  requestAnimationFrame(() => {
    // 添加过渡类
    html.classList.add(THEME_TRANSITION_CLASS);

    // 过渡完成后移除类
    setTimeout(() => {
      html.classList.remove(THEME_TRANSITION_CLASS);
    }, 300); // 与 CSS 中的过渡持续时间匹配
  });
}

/**
 * 获取系统主题偏好
 * @returns 系统主题偏好 ('dark' 或 'light')
 */
export function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * 监听系统主题变化
 * @param callback 当系统主题变化时调用的回调函数
 * @returns 清理函数
 */
export function watchSystemTheme(
  callback: (theme: 'dark' | 'light') => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const listener = (event: MediaQueryListEvent) => {
    callback(event.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', listener);

  return () => {
    mediaQuery.removeEventListener('change', listener);
  };
}
