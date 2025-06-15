import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// 缓存配置
const CACHE_DURATION = 30 * 60 * 1000; // 30分钟
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

interface CacheItem {
  data: WebsiteMetadata;
  timestamp: number;
}

interface WebsiteMetadata {
  title: string;
  description: string;
  icon: string;
  image: string;
  author?: string;
  siteName?: string;
  type?: string;
  url: string;
  language?: string;
}

// 内存缓存
const metadataCache = new Map<string, CacheItem>();

// URL 验证函数
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

// 延时函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 创建带重试的 fetch 函数
async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
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

// 解析网站元数据
function parseMetadata($: cheerio.CheerioAPI, url: string): WebsiteMetadata {
  // 基本元数据
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('title').text() ||
    '';

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';

  // 作者信息
  const author =
    $('meta[name="author"]').attr('content') ||
    $('meta[property="article:author"]').attr('content') ||
    '';

  // 网站名称
  const siteName =
    $('meta[property="og:site_name"]').attr('content') ||
    '';

  // 内容类型
  const type =
    $('meta[property="og:type"]').attr('content') ||
    '';

  // 语言
  const language =
    $('html').attr('lang') ||
    $('meta[property="og:locale"]').attr('content') ||
    '';

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
      icon = new URL(iconHref, url).href;
      break;
    }
  }

  // 如果没有找到图标，使用默认路径
  if (!icon) {
    const urlObj = new URL(url);
    icon = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  }

  // 图片处理
  const image =
    $('meta[property="og:image"]').attr('content') ||
    $('meta[property="og:image:url"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    '';

  return {
    title: title.trim(),
    description: description.trim(),
    icon,
    image: image ? new URL(image, url).href : '',
    author: author.trim(),
    siteName: siteName.trim(),
    type: type.trim(),
    url,
    language: language.trim(),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  // URL 验证
  if (!url || !isValidUrl(url)) {
    return NextResponse.json(
      { error: 'Invalid or missing URL' },
      { status: 400 }
    );
  }

  try {
    // 检查缓存
    const cachedData = getFromCache(url);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // 请求配置
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: AbortSignal.timeout(10000),
    };

    // 获取页面内容
    const response = await fetchWithRetry(url, options);
    const html = await response.text();
    const $ = cheerio.load(html);

    // 解析元数据
    const metadata = parseMetadata($, url);

    // 更新缓存
    metadataCache.set(url, {
      data: metadata,
      timestamp: Date.now(),
    });

    return NextResponse.json(metadata);

  } catch (error) {
    console.error('Error parsing website:', error);

    // 构建基础返回数据
    const urlObj = new URL(url);
    const fallbackData = {
      title: urlObj.hostname.replace('www.', ''),
      description: '',
      icon: `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`,
      image: '',
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(fallbackData, { status: 200 });
  }
}