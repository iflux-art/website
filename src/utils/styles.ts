/**
 * 样式工具函数
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名
 *
 * 使用 clsx 和 tailwind-merge 合并类名，解决类名冲突问题
 *
 * @param inputs 要合并的类名数组
 * @returns 合并后的类名字符串
 *
 * @example
 * ```tsx
 * <div className={cn("text-red-500", isActive && "text-blue-500")}>
 *   Hello World
 * </div>
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
