/**
 * 网址解析辅助工具函数
 */

import { normalizeUrl } from "./validation";

/**
 * 从 URL 提取域名作为默认标题
 */
export function extractDomainName(url: string): string {
  try {
    const urlObj = new URL(normalizeUrl(url));
    return urlObj.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

/**
 * 生成网站图标 URL
 */
export function generateFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(normalizeUrl(url));
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return "";
  }
}

/**
 * 生成网站预览图 URL
 */
export function generatePreviewImageUrl(url: string): string {
  try {
    const urlObj = new URL(normalizeUrl(url));
    return `${urlObj.protocol}//${urlObj.hostname}/og-image.png`;
  } catch {
    return "";
  }
}

/**
 * 延时函数
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
