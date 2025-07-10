/**
 * @file metadata.ts
 * @description Next.js 元数据配置文件
 *
 * 本文件聚合所有元数据配置，包括：
 * - 基础站点信息（标题、描述等）
 * - PWA相关配置
 * - iOS设备特定配置
 * - Windows平台特定配置
 * - 图标配置
 *
 * @usage
 * 在 layout.tsx 中使用：
 * ```typescript
 * import { metadata, viewport, splashScreens } from '@/config/metadata';
 *
 * export { metadata, viewport };
 * ```
 */

import { Metadata } from "next";
import { SITE_METADATA } from "./site";

/**
 * 页面类型常量
 */
export const PAGE_TYPES = {
  WEBSITE: "website",
  ARTICLE: "article",
  PROFILE: "profile",
} as const;

export type PageType = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES];

/**
 * 图标配置接口
 */
interface IconConfig {
  icon?: string;
  shortcut?: string;
  apple?: string;
  mask?: string;
  manifest?: string;
}

/**
 * 验证配置接口
 */
interface VerificationConfig {
  google?: string;
  yandex?: string;
  yahoo?: string;
  other?: Record<string, string[]>;
}

/**
 * JSON-LD 配置接口
 */
interface JsonLdConfig {
  type: string;
  name?: string;
  description?: string;
  url?: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  [key: string]: string | undefined;
}

/**
 * 社交媒体配置接口
 */
interface SocialConfig {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

/**
 * 生成 Metadata 对象的选项
 */
export interface GenerateMetadataOptions {
  /**
   * 页面标题
   */
  title?: string;

  /**
   * 页面描述
   */
  description?: string;

  /**
   * 页面关键词
   */
  keywords?: string[];

  /**
   * 页面图片
   */
  image?: string;

  /**
   * 页面类型
   */
  type?: PageType;

  /**
   * 页面作者
   */
  author?: string;

  /**
   * 页面发布日期
   */
  date?: string;

  /**
   * 页面修改日期
   */
  modified?: string;

  /**
   * 页面语言
   */
  locale?: string;

  /**
   * 页面 URL
   */
  url?: string;

  /**
   * 是否禁用索引
   */
  noindex?: boolean;

  /**
   * 是否禁用跟踪
   */
  nofollow?: boolean;

  /**
   * 图标配置
   */
  icons?: IconConfig;

  /**
   * 验证配置
   */
  verification?: VerificationConfig;

  /**
   * JSON-LD 配置
   */
  jsonLd?: JsonLdConfig;

  /**
   * 社交媒体配置
   */
  social?: SocialConfig;
}

/**
 * 生成视口配置
 */
export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 2,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
  };
}

// 缓存已生成的元数据
const metadataCache = new Map<string, Metadata>();

/**
 * 生成 JSON-LD 结构化数据
 */
function generateJsonLd(config: JsonLdConfig): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": config.type,
    name: config.name,
    description: config.description,
    url: config.url,
    image: config.image,
    author: config.author
      ? {
          "@type": "Person",
          name: config.author,
        }
      : undefined,
    datePublished: config.datePublished,
    dateModified: config.dateModified,
    ...config,
  });
}

export function generateMetadata(
  options: GenerateMetadataOptions = {},
): Metadata {
  const cacheKey = JSON.stringify(options);
  if (metadataCache.has(cacheKey)) {
    return metadataCache.get(cacheKey)!;
  }

  const {
    title,
    description = SITE_METADATA.description,
    keywords = SITE_METADATA.keywords,
    image = SITE_METADATA.image,
    type = "website",
    author = SITE_METADATA.author,
    date,
    modified,
    locale = "zh-CN",
    url = SITE_METADATA.url,
    noindex = false,
    nofollow = false,
    icons,
    verification,
    jsonLd,
    social,
  } = options;

  const metadata: Metadata = {
    title: title ? `${title} | ${SITE_METADATA.title}` : SITE_METADATA.title,
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: SITE_METADATA.title,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_METADATA.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title || SITE_METADATA.title,
      description,
      url,
      siteName: SITE_METADATA.title,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || SITE_METADATA.title,
        },
      ],
      locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: title || SITE_METADATA.title,
      description,
      images: [image],
      creator: SITE_METADATA.twitter,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: verification,
    icons: icons,
    other: {
      ...(jsonLd && {
        "application/ld+json": generateJsonLd(jsonLd),
      }),
    },
  };

  // 添加社交媒体元数据
  if (social) {
    if (social.twitter) {
      metadata.twitter = {
        ...metadata.twitter,
        site: social.twitter,
      };
    }
    if (social.facebook) {
      metadata.openGraph = {
        ...metadata.openGraph,
        siteName: social.facebook,
      };
    }
  }

  // 添加日期信息
  if (date || modified) {
    const openGraphUpdate: any = {};
    if (date) openGraphUpdate.publishedTime = date;
    if (modified) openGraphUpdate.modifiedTime = modified;

    metadata.openGraph = {
      ...metadata.openGraph,
      ...openGraphUpdate,
    };
  }

  metadataCache.set(cacheKey, metadata);
  return metadata;
}

export function generateArticleMetadata(
  options: Omit<GenerateMetadataOptions, "type">,
): Metadata {
  return generateMetadata({ ...options, type: "article" });
}

export function generateProfileMetadata(
  options: Omit<GenerateMetadataOptions, "type">,
): Metadata {
  return generateMetadata({ ...options, type: "profile" });
}
