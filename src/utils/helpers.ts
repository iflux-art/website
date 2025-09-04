/**
 * 通用辅助函数
 *
 * 提供应用中常用的辅助函数，包括防抖、节流等工具函数。
 *
 * @author 系统重构
 * @since 2024
 */

/**
 * 创建同步版本的防抖函数
 * 用于 localStorage 操作等同步场景
 *
 * @template T - 函数类型
 * @param fn - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounceSync<T extends (...args: never[]) => void>(fn: T, delay: number): T {
  let timer: NodeJS.Timeout | null = null;
  return ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  }) as T;
}

/**
 * 过滤掉对象中的 undefined 值
 *
 * @template T - 对象类型
 * @param obj - 要过滤的对象
 * @returns 过滤后的对象
 */
export function filterUndefinedValues<T>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}
