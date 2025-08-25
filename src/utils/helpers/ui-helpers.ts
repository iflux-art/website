/**
 * UI相关工具函数
 *
 * 提供与UI处理相关的工具函数。
 *
 * @author 系统重构
 * @since 2024
 */

/**
 * 格式化发布时间
 */
export function formatPublishTime(date: Date | string | undefined): string | undefined {
  if (!date) return undefined;

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * 获取页面级的loading状态文本
 */
export function getLoadingText(type = '内容'): string {
  return `正在加载${type}...`;
}

/**
 * 获取页面级的错误文本
 */
export function getErrorText(type = '内容', action = '加载'): string {
  return `${action}${type}失败，请稍后重试`;
}
