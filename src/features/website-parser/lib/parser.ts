import * as cheerio from 'cheerio';
import type {
  WebsiteMetadata,
  CacheItem,
  ParseOptions,
  ParseResult,
} from '@/features/website-parser/types';

/**
 * 缓存配置
 */
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

/**
 * 内存缓存
 */
const metadataCache = new Map<string, CacheItem>();

/**
 * URL 验证函数
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * 延时函数
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 创建带重试的 fetch 函数
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = MAX_RETRIES
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

/**
 * 从缓存获取数据
 */
function getFromCache(url: string, maxAge: number = CACHE_DURATION): WebsiteMetadata | null {
  const cached = metadataCache.get(url);
  if (cached && Date.now() - cached.timestamp < maxAge) {
    return cached.data;
  }
  return null;
}

/**
 * 保存到缓存
 */
function saveToCache(url: string, data: WebsiteMetadata): void {
  metadataCache.set(url, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * 解析网站元数据
 */
function parseMetadata($: cheerio.CheerioAPI, url: string): WebsiteMetadata {
  // 基本元数据
  const title =
    $('meta[property="og:title"]').attr('content') ??
    $('meta[name="twitter:title"]').attr('content') ??
    $('title').text().trim() ??
    '';

  const description =
    $('meta[property="og:description"]').attr('content') ??
    $('meta[name="twitter:description"]').attr('content') ??
    $('meta[name="description"]').attr('content') ??
    '';

  // 作者信息
  const author =
    $('meta[name="author"]').attr('content') ??
    $('meta[property="article:author"]').attr('content') ??
    '';

  // 网站名称
  const siteName = $('meta[property="og:site_name"]').attr('content') ?? '';

  // 内容类型
  const type = $('meta[property="og:type"]').attr('content') ?? '';

  // 语言
  const language = $('html').attr('lang') ?? $('meta[property="og:locale"]').attr('content') ?? '';

  // 图标处理
  let icon = '';
  const iconSelectors = [
    'link[rel="icon"][sizes="32x32"]',
    'link[rel="icon"][sizes="192x192"]',
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
  ];

  for (const selector of iconSelectors) {
    const iconHref = $(selector).attr('href');
    if (iconHref) {
      try {
        icon = new URL(iconHref, url).href;
        break;
      } catch {
        // 忽略无效的URL
        continue;
      }
    }
  }

  // 如果没有找到图标，使用默认路径
  if (!icon) {
    try {
      const urlObj = new URL(url);
      icon = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch {
      // 忽略无效的URL
    }
  }

  // 图片处理
  let image = '';
  const ogImage =
    $('meta[property="og:image"]').attr('content') ??
    $('meta[property="og:image:url"]').attr('content') ??
    $('meta[name="twitter:image"]').attr('content') ??
    '';

  if (ogImage) {
    try {
      image = new URL(ogImage, url).href;
    } catch {
      // 忽略无效的URL
    }
  }

  return {
    title: title.trim(),
    description: description.trim(),
    icon,
    image,
    author: author.trim(),
    siteName: siteName.trim(),
    type: type.trim(),
    url,
    language: language.trim(),
  };
}

/**
 * 创建fallback数据
 */
function createFallbackData(url: string): WebsiteMetadata {
  try {
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname,
      description: `Website: ${urlObj.hostname}`,
      icon: `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`,
      image: '',
      author: '',
      siteName: urlObj.hostname,
      type: 'website',
      url,
      language: '',
    };
  } catch {
    return {
      title: 'Unknown Website',
      description: 'Unable to parse website information',
      icon: '',
      image: '',
      author: '',
      siteName: '',
      type: 'website',
      url,
      language: '',
    };
  }
}

/**
 * 解析网站信息
 */
export async function parseWebsite(url: string, options: ParseOptions = {}): Promise<ParseResult> {
  const {
    timeout = 10000,
    useCache = true,
    cacheMaxAge = CACHE_DURATION,
    retryCount = MAX_RETRIES,
  } = options;

  // URL 验证
  if (!url || !isValidUrl(url)) {
    return {
      success: false,
      error: 'Invalid or missing URL',
    };
  }

  try {
    // 检查缓存
    if (useCache) {
      const cachedData = getFromCache(url, cacheMaxAge);
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          fromCache: true,
        };
      }
    }

    // 请求配置
    const fetchOptions: RequestInit = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        DNT: '1',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(timeout),
    };

    // 获取页面内容
    const response = await fetchWithRetry(url, fetchOptions, retryCount);
    const html = await response.text();
    const $ = cheerio.load(html);

    // 解析元数据
    const metadata = parseMetadata($, url);

    // 更新缓存
    if (useCache) {
      saveToCache(url, metadata);
    }

    return {
      success: true,
      data: metadata,
      fromCache: false,
    };
  } catch (error) {
    console.error('Error parsing website:', error);

    // 返回 fallback 数据
    const fallbackData = createFallbackData(url);

    return {
      success: false,
      data: fallbackData,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 批量解析网站信息
 */
export async function parseWebsites(
  urls: string[],
  options: ParseOptions = {}
): Promise<Record<string, ParseResult>> {
  const results: Record<string, ParseResult> = {};

  // 使用 Promise.allSettled 确保所有请求都有结果
  const promises = urls.map(async url => {
    const result = await parseWebsite(url, options);
    return { url, result };
  });

  const settledResults = await Promise.allSettled(promises);

  settledResults.forEach(settled => {
    if (settled.status === 'fulfilled') {
      results[settled.value.url] = settled.value.result;
    }
  });

  return results;
}

/**
 * 清理缓存
 */
export function clearCache(): void {
  metadataCache.clear();
}

/**
 * 获取缓存大小
 */
export function getCacheSize(): number {
  return metadataCache.size;
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): { size: number; oldestEntry?: number; newestEntry?: number } {
  if (metadataCache.size === 0) {
    return { size: 0 };
  }

  const timestamps = Array.from(metadataCache.values()).map(item => item.timestamp);

  return {
    size: metadataCache.size,
    oldestEntry: Math.min(...timestamps),
    newestEntry: Math.max(...timestamps),
  };
}
