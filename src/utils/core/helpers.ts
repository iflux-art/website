/**
 * 通用辅助函数
 *
 * 提供应用中常用的辅助函数，包括防抖、节流等工具函数。
 *
 * @author 系统重构
 * @since 2024
 */

/**
 * 创建一个防抖函数
 *
 * 防抖函数会延迟执行，如果在等待期间再次调用，则重新计时。
 * 适用于搜索输入、按钮点击等需要避免频繁触发的场景。
 *
 * @template TArgs - 函数参数类型
 * @template TReturn - 函数返回值类型
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<TArgs extends unknown[], TReturn>(
  func: (...args: TArgs) => Promise<TReturn>,
  wait: number
): (...args: TArgs) => Promise<TReturn> {
  let timeoutId: NodeJS.Timeout;

  return function (...args: TArgs): Promise<TReturn> {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        func(...args)
          .then(resolve)
          .catch(reject);
      }, wait);
    });
  };
}

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
