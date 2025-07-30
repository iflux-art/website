import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 创建一个防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 */
export function debounce<TArgs extends unknown[], TReturn>(
  func: (...args: TArgs) => Promise<TReturn>,
  wait: number,
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
