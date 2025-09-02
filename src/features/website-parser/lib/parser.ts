import * as cheerio from "cheerio";
import { isValidUrl as isValidUrlUtil } from "@/utils/validation";
import type {
  CacheItem,
  ParseOptions,
  ParseResult,
  WebsiteMetadata,
} from "@/features/website-parser/types";

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
  return isValidUrlUtil(urlString);
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
    // 对于重定向，我们仍然可以尝试处理
    if (
      !response.ok &&
      response.status !== 308 &&
      response.status !== 307 &&
      response.status !== 301 &&
      response.status !== 302
    ) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    // 检查是否是CORS错误
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `CORS error or network issue when fetching ${url}. This may be due to the target server not allowing cross-origin requests.`
      );
    }

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
 * 提取网站标题
 */
function extractTitle($: cheerio.CheerioAPI): string {
  const title =
    $('meta[property="og:title"]').attr("content") ??
    $('meta[name="twitter:title"]').attr("content") ??
    $("title").text().trim() ??
    "";
  return title.trim();
}

/**
 * 提取网站描述
 */
function extractDescription($: cheerio.CheerioAPI): string {
  const description =
    $('meta[property="og:description"]').attr("content") ??
    $('meta[name="twitter:description"]').attr("content") ??
    $('meta[name="description"]').attr("content") ??
    "";
  return description.trim();
}

/**
 * 提取作者信息
 */
function extractAuthor($: cheerio.CheerioAPI): string {
  const author =
    $('meta[name="author"]').attr("content") ??
    $('meta[property="article:author"]').attr("content") ??
    "";
  return author.trim();
}

/**
 * 提取其他元数据
 */
function extractOtherMeta($: cheerio.CheerioAPI): {
  siteName: string;
  type: string;
  language: string;
} {
  const siteName = $('meta[property="og:site_name"]').attr("content") ?? "";
  const type = $('meta[property="og:type"]').attr("content") ?? "";
  const language = $("html").attr("lang") ?? $('meta[property="og:locale"]').attr("content") ?? "";

  return {
    siteName: siteName.trim(),
    type: type.trim(),
    language: language.trim(),
  };
}

/**
 * 解析基本元数据（标题、描述、作者等）
 */
function parseBasicMetadata($: cheerio.CheerioAPI): {
  title: string;
  description: string;
  author: string;
  siteName: string;
  type: string;
  language: string;
} {
  const title = extractTitle($);
  const description = extractDescription($);
  const author = extractAuthor($);
  const { siteName, type, language } = extractOtherMeta($);

  return {
    title,
    description,
    author,
    siteName,
    type,
    language,
  };
}

/**
 * 解析网站图标
 */
function parseIcon($: cheerio.CheerioAPI, url: string): string {
  const iconSelectors = [
    'link[rel="icon"][sizes="32x32"]',
    'link[rel="icon"][sizes="192x192"]',
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
  ];

  for (const selector of iconSelectors) {
    const iconHref = $(selector).attr("href");
    if (iconHref) {
      try {
        return new URL(iconHref, url).href;
      } catch {
        // 忽略无效的URL，继续尝试下一个
      }
    }
  }

  // 如果没有找到图标，使用默认路径
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return "";
  }
}

/**
 * 解析Open Graph图片
 */
function parseImage($: cheerio.CheerioAPI, url: string): string {
  const ogImage =
    $('meta[property="og:image"]').attr("content") ??
    $('meta[property="og:image:url"]').attr("content") ??
    $('meta[name="twitter:image"]').attr("content") ??
    "";

  if (ogImage) {
    try {
      return new URL(ogImage, url).href;
    } catch {
      return "";
    }
  }

  return "";
}

/**
 * 解析网站元数据
 */
function parseMetadata($: cheerio.CheerioAPI, url: string): WebsiteMetadata {
  const basicData = parseBasicMetadata($);
  const icon = parseIcon($, url);
  const image = parseImage($, url);

  return {
    ...basicData,
    icon,
    image,
    url,
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
      image: "",
      author: "",
      siteName: urlObj.hostname,
      type: "website",
      url,
      language: "",
    };
  } catch {
    return {
      title: "Unknown Website",
      description: "Unable to parse website information",
      icon: "",
      image: "",
      author: "",
      siteName: "",
      type: "website",
      url,
      language: "",
    };
  }
}

/**
 * 创建HTTP请求配置
 */
function createFetchOptions(timeout: number): RequestInit {
  return {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      Dnt: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
    signal: AbortSignal.timeout(timeout),
    // 添加mode选项以更好地处理CORS
    mode: "cors",
  };
}

/**
 * 处理缓存检查
 */
function checkCache(url: string, useCache: boolean, cacheMaxAge: number): WebsiteMetadata | null {
  if (!useCache) {
    return null;
  }

  return getFromCache(url, cacheMaxAge);
}

/**
 * 处理错误情况
 */
function handleParseError(error: unknown, url: string): ParseResult {
  console.error("Error parsing website:", error);

  // 提供更友好的错误信息
  let errorMessage = "Unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
    // 检查是否是CORS相关错误
    if (errorMessage.includes("CORS") || errorMessage.includes("fetch")) {
      errorMessage = `Unable to fetch website metadata due to CORS restrictions. The target server (${url}) may not allow cross-origin requests. ${errorMessage}`;
    }
  }

  const fallbackData = createFallbackData(url);

  return {
    success: false,
    data: fallbackData,
    error: errorMessage,
  };
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
  if (!(url && isValidUrl(url))) {
    return {
      success: false,
      error: "Invalid or missing URL",
    };
  }

  try {
    // 检查缓存
    const cachedData = checkCache(url, useCache, cacheMaxAge);
    if (cachedData) {
      return {
        success: true,
        data: cachedData,
        fromCache: true,
      };
    }

    // 获取页面内容
    const fetchOptions = createFetchOptions(timeout);
    const response = await fetchWithRetry(url, fetchOptions, retryCount);

    // 即使是重定向状态，我们也尝试获取内容
    const html = await response.text();
    const cheerioInstance = cheerio.load(html);

    // 解析元数据
    const metadata = parseMetadata(cheerioInstance, url);

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
    return handleParseError(error, url);
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
    if (settled.status === "fulfilled") {
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
