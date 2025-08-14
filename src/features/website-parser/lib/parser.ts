/**
 * 网站元数据解析核心功能
 */

import { WebsiteMetadata, ParseOptions, ParseResult } from "../types";
import { normalizeUrl, isValidUrl } from "./validation";
import { extractDomainName, generateFaviconUrl, delay } from "./utils";

// 默认配置
const DEFAULT_OPTIONS: Required<ParseOptions> = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

/**
 * 解析网站元数据
 */
export async function parseWebsiteMetadata(
  url: string,
  options: ParseOptions = {},
): Promise<ParseResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    // 验证 URL
    if (!isValidUrl(url)) {
      return {
        success: false,
        error: "Invalid URL format",
      };
    }

    const normalizedUrl = normalizeUrl(url);

    // 使用 API 解析网站信息
    const response = await fetchWithRetry(
      `/api/parse-website?url=${encodeURIComponent(normalizedUrl)}`,
      {
        headers: {
          "User-Agent": config.userAgent,
        },
        signal: AbortSignal.timeout(config.timeout),
      },
      config.retries,
      config.retryDelay,
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const metadata = await response.json();

    return {
      success: true,
      data: metadata,
    };
  } catch (error) {
    // 返回基础信息作为降级方案
    const fallbackData: WebsiteMetadata = {
      title: extractDomainName(url),
      description: "",
      icon: generateFaviconUrl(url),
      url: normalizeUrl(url),
    };

    return {
      success: false,
      data: fallbackData,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * 带重试的 fetch 函数
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number,
  retryDelay: number,
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await delay(retryDelay);
      return fetchWithRetry(url, options, retries - 1, retryDelay);
    }
    throw error;
  }
}
