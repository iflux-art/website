import { WebsiteMetadata } from '@/types/navigation-types';

/**
 * 解析网站元数据
 */
export async function parseWebsiteMetadata(url: string): Promise<WebsiteMetadata> {
  try {
    // 确保 URL 格式正确
    const normalizedUrl = normalizeUrl(url);

    // 使用代理服务解析网站信息
    const response = await fetch(`/api/parse-website?url=${encodeURIComponent(normalizedUrl)}`);

    if (!response.ok) {
      throw new Error('Failed to parse website');
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error parsing website:', error);

    // 返回基础信息
    return {
      title: extractDomainName(url),
      description: '',
      icon: '',
    };
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
 * 从 URL 提取域名作为默认标题
 */
export function extractDomainName(url: string): string {
  try {
    const urlObj = new URL(normalizeUrl(url));
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

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
 * 生成网站图标 URL
 */
export function generateFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(normalizeUrl(url));
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return '';
  }
}
