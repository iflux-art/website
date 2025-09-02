/**
 * URL 验证相关工具函数
 */

import { isValidUrl as isValidUrlUtil, normalizeUrl as normalizeUrlUtil } from "@/utils/validation";

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
  return isValidUrlUtil(url);
}

/**
 * 标准化 URL
 */
export function normalizeUrl(url: string): string {
  return normalizeUrlUtil(url);
}

/**
 * 检查 URL 是否为安全协议
 */
export function isSecureUrl(url: string): boolean {
  try {
    const urlObj = new URL(normalizeUrl(url));
    return ["http:", "https:"].includes(urlObj.protocol);
  } catch {
    return false;
  }
}
