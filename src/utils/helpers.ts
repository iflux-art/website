/**
 * 格式化日期
 * @param date 要格式化的日期
 * @param format 可选的日期格式，支持 'MM月dd日' 格式
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date, format?: string): string {
  const d = new Date(date);

  if (format === 'MM月dd日') {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 创建一个防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
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
