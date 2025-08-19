/**
 * URL 验证相关工具函数
 */

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(normalizeUrl(url));
    return true;
  } catch {
    return false;
  }
}

/**
 * 标准化 URL
 */
export function normalizeUrl(url: string): string {
  // 如果没有协议，添加 https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.href;
  } catch {
    throw new Error('Invalid URL format');
  }
}

/**
 * 检查 URL 是否为安全协议
 */
export function isSecureUrl(url: string): boolean {
  try {
    const urlObj = new URL(normalizeUrl(url));
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}
