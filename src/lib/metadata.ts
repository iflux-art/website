import { Metadata } from "next";
import { SITE_METADATA } from "@/lib/constants";

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
    locale = "zh_CN",
    url,
    noindex = false,
    nofollow = false,
    icons,
    verification,
    jsonLd,
    social,
  } = options;

  const fullTitle = title
    ? `${title} | ${SITE_METADATA.title}`
    : SITE_METADATA.title;
  const fullUrl = url || SITE_METADATA.url;
  const fullImage = image.startsWith("http")
    ? image
    : `${SITE_METADATA.url}${image}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,

    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },

    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_METADATA.title,
      images: [
        {
          url: fullImage,
          width: type === "article" ? 1200 : 800,
          height: type === "article" ? 630 : 600,
          alt: fullTitle,
        },
      ],
      locale,
      type,
      ...(type === "article" && {
        article: {
          authors: [author],
          publishedTime: date,
          modifiedTime: modified || date,
        },
      }),
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullImage],
      creator: social?.twitter || SITE_METADATA.twitter,
    },

    keywords: keywords.join(", "),
    authors: [{ name: author, url: SITE_METADATA.url }],
    creator: author,
    publisher: SITE_METADATA.title,

    alternates: {
      canonical: fullUrl,
    },

    icons: {
      icon: icons?.icon || "/favicon.ico",
      shortcut: icons?.shortcut || "/favicon-16x16.png",
      apple: icons?.apple || "/apple-touch-icon.png",
      other: [
        {
          rel: "mask-icon",
          url: icons?.mask || "/safari-pinned-tab.svg",
        },
        {
          rel: "manifest",
          url: icons?.manifest || "/manifest.json",
        },
      ],
    },

    verification: {
      google: verification?.google || "google-site-verification",
      yandex: verification?.yandex || "yandex-verification",
      yahoo: verification?.yahoo || "yahoo-verification",
      other: {
        ...(verification?.other || {
          me: ["hello@iflux.art"],
          "msvalidate.01": ["msvalidate.01"],
        }),
      },
    },
  };

  // 添加 JSON-LD 结构化数据
  if (jsonLd) {
    const ldJson = generateJsonLd(jsonLd);
    const newOther: { [key: string]: string | number | (string | number)[] } = {
      "script:ld+json": ldJson,
    };

    if (metadata.other) {
      Object.entries(metadata.other).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          newOther[key] = value;
        }
      });
    }

    metadata.other = newOther;
  }

  metadataCache.set(cacheKey, metadata);
  return metadata;
}

/**
 * 生成文章页面的元数据
 */
export function generateArticleMetadata(
  options: Omit<GenerateMetadataOptions, "type">,
): Metadata {
  return generateMetadata({ ...options, type: PAGE_TYPES.ARTICLE });
}

/**
 * 生成个人资料页面的元数据
 */
export function generateProfileMetadata(
  options: Omit<GenerateMetadataOptions, "type">,
): Metadata {
  return generateMetadata({ ...options, type: PAGE_TYPES.PROFILE });
}
