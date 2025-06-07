/**
 * 工具函数
 *
 * 集中定义项目中使用的所有工具函数
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

/**
 * 计算文本中的字数
 *
 * @param text 要计算字数的文本
 * @returns 字数统计
 */
export function countWords(text: string): number {
  // 移除 Markdown 语法和 HTML 标签
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 替换链接为链接文本
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // 替换图片为图片描述
    .replace(/<[^>]*>/g, '') // 移除 HTML 标签
    .replace(/[#*_~>|-]/g, '') // 移除 Markdown 标记符号
    .replace(/\s+/g, ' ') // 将多个空白字符替换为单个空格
    .trim();

  // 中文字符计数
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || [];

  // 英文单词计数（简单处理，按空格分隔）
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
    .split(/\s+/)
    .filter(word => word.length > 0);

  // 中文字符 + 英文单词 = 总字数
  return chineseChars.length + englishWords.length;
}

/**
 * 防抖函数
 *
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => void | Promise<void>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * 节流函数
 *
 * @param func 要节流的函数
 * @param limit 时间限制（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => void | Promise<void>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 格式化日期
 *
 * @param date 日期对象或日期字符串
 * @param format 格式化字符串，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 平滑滚动到指定元素
 *
 * @param elementId 要滚动到的元素ID
 * @param offset 滚动偏移量，默认为0
 */
export function scrollToElement(elementId: string, offset: number = 0): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

/**
 * 检测元素是否在视口中
 *
 * @param element 要检测的元素
 * @param offset 视口偏移量，默认为0
 * @returns 元素是否在视口中
 */
export function isElementInViewport(element: HTMLElement, offset: number = 0): boolean {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 - offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 获取元素的绝对位置
 *
 * @param element 要获取位置的元素
 * @returns 元素的绝对位置
 */
export function getElementPosition(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect();

  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
  };
}