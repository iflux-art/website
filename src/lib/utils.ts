/**
 * 通用工具函数
 *
 * 提供应用中常用的工具函数，主要用于样式类名的合并和处理。
 *
 * @author 系统重构
 * @since 2024
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 CSS 类名
 *
 * 使用 clsx 和 tailwind-merge 来智能合并 CSS 类名，
 * 自动处理 Tailwind CSS 类的冲突和优先级。
 *
 * @param inputs - 要合并的类名值
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
