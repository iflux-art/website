import * as cheerio from "cheerio";

// 配置常量
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

interface WebsiteMetadata {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
  author?: string;
  siteName?: string;
  type?: string;
  url?: string;
  language?: string;
}

interface CacheItem {
  data: WebsiteMetadata;
  timestamp: number;
}

// 内存缓存
const metadataCache = new Map<string, CacheItem>();

// URL 验证
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

// 延时函数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 带重试的 fetch 函数
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES,
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

// 从缓存获取数据
function getFromCache(url: string): WebsiteMetadata | null {
  const cached = metadataCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

// 解析HTML元数据
function parseMetadata($: cheerio.CheerioAPI, url: string): WebsiteMetadata {
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("title").text() ||
    "";

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="twitter:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  const author =
    $('meta[name="author"]').attr("content") ||
    $('meta[property="article:author"]').attr("content") ||
    "";

  const siteName = $('meta[property="og:site_name"]').attr("content") || "";
  const type = $('meta[property="og:type"]').attr("content") || "";
  const language =
    $("html").attr("lang") ||
    $('meta[property="og:locale"]').attr("content") ||
    "";

  // 获取图标
  let icon = "";
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
      icon = new URL(iconHref, url).href;
      break;
    }
  }

  if (!icon) {
    const urlObj = new URL(url);
    icon = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  }

  // 获取图片
  const image =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:url"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    "";

  return {
    title: title.trim(),
    description: description.trim(),
    icon,
    image: image ? new URL(image, url).href : "",
    author: author.trim(),
    siteName: siteName.trim(),
    type: type.trim(),
    url,
    language: language.trim(),
  };
}

// 主函数：获取网站元数据
export async function getWebsiteMetadata(
  url: string,
): Promise<WebsiteMetadata> {
  // 检查缓存
  const cachedData = getFromCache(url);
  if (cachedData) {
    return cachedData;
  }

  // 请求配置
  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
    signal: AbortSignal.timeout(10000),
  };

  try {
    const response = await fetchWithRetry(url, options);
    const html = await response.text();
    const $ = cheerio.load(html);

    const metadata = parseMetadata($, url);

    // 更新缓存
    metadataCache.set(url, {
      data: metadata,
      timestamp: Date.now(),
    });

    return metadata;
  } catch {
    // Return basic data on error
    const urlObj = new URL(url);
    return {
      title: urlObj.hostname.replace("www.", ""),
      description: "",
      icon: `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`,
      image: "",
      url,
    };
  }
}
