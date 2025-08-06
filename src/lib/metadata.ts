/**
 * 元数据生成工具函数
 * 整合了网站元数据生成的所有逻辑
 */

import { SITE_METADATA } from "@/config/metadata";
import type { Metadata } from "next";
import type { GenerateMetadataOptions } from "@/types/metadata-types";

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

// 元数据缓存，提高性能
const metadataCache = new Map<string, Metadata>();

/**
 * 生成网站元数据的主函数
 * 支持缓存以提高性能
 */
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
        "application/ld+json": JSON.stringify({
          "@context": "https://schema.org",
          "@type": jsonLd.type,
          name: jsonLd.name,
          description: jsonLd.description,
          url: jsonLd.url,
          image: jsonLd.image,
          author: jsonLd.author
            ? {
                "@type": "Person",
                name: jsonLd.author,
              }
            : undefined,
          datePublished: jsonLd.datePublished,
          dateModified: jsonLd.dateModified,
          ...jsonLd,
        }),
      }),
    },
  };

  // 处理社交媒体配置
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

  // 处理日期相关的 OpenGraph 数据
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

/**
 * 生成文章类型的元数据
 */
export function generateArticleMetadata(
  options: Omit<GenerateMetadataOptions, "type">,
): Metadata {
  return generateMetadata({ ...options, type: "article" });
}

/**
 * 生成个人资料类型的元数据
 */
export function generateProfileMetadata(
  options: Omit<GenerateMetadataOptions, "type">,
): Metadata {
  return generateMetadata({ ...options, type: "profile" });
}
