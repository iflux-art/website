/**
 * 首页相关工具函数
 * 统一管理首页的各种工具函数
 */

import { GREETINGS_BY_TIME, type TimeOfDay } from '@/components/layout/home/data/constants';

/**
 * 获取当前时间段
 * @returns 当前时间段标识
 */
export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 17) return 'afternoon';
  if (hour >= 18 && hour <= 22) return 'evening';
  return 'night'; // 23-4点
};

/**
 * 获取随机问候语
 * @returns 随机问候语字符串
 */
export const getRandomGreeting = (): string => {
  const timeOfDay = getTimeOfDay();
  const greetings = GREETINGS_BY_TIME[timeOfDay];
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};

/**
 * 生成随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 生成随机百分比位置
 * @returns 0-100的随机数字符串，带%
 */
export const getRandomPercentage = (): string => {
  return `${Math.random() * 100}%`;
};

/**
 * 生成随机透明度
 * @param min 最小透明度
 * @param max 最大透明度
 * @returns 透明度值
 */
export const getRandomOpacity = (min: number = 0.05, max: number = 0.15): number => {
  return Math.random() * (max - min) + min;
};

/**
 * 生成随机动画延迟
 * @param maxDelay 最大延迟时间（秒）
 * @returns 延迟时间字符串
 */
export const getRandomDelay = (maxDelay: number = 5): string => {
  return `${Math.random() * maxDelay}s`;
};

/**
 * 生成随机动画持续时间
 * @param min 最小持续时间（秒）
 * @param max 最大持续时间（秒）
 * @returns 持续时间字符串
 */
export const getRandomDuration = (min: number = 10, max: number = 30): string => {
  return `${Math.random() * (max - min) + min}s`;
};

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否复制成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 检查是否为移动设备
 * @returns 是否为移动设备
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

/**
 * 检查是否为暗色主题
 * @returns 是否为暗色主题
 */
export const isDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
};
