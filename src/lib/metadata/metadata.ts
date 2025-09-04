/**
 * 基础元数据生成工具函数
 * 整合了网站基础元数据生成的所有逻辑
 */

import { SITE_METADATA } from "@/config";
import type { GenerateMetadataOptions } from "@/types";
import type { Metadata } from "next";
import { filterUndefinedValues } from "@/utils/helpers";

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

/**
 * 生成基础元数据
 */
export function generateMetadata(options: GenerateMetadataOptions = {}): Metadata {
  const {
    title,
    description = SITE_METADATA.description,
    keywords = SITE_METADATA.keywords,
    author = SITE_METADATA.author,
    type = "website",
    date: publishedTime,
    modified: modifiedTime,
    image,
    url,
    noindex = false,
    nofollow = false,
    icons,
    verification,
    jsonLd,
    social,
  } = options;

  // 基础元数据
  const metadata: Metadata = {
    title: title ? `${title} | ${SITE_METADATA.title}` : SITE_METADATA.title,
    description,
    keywords: keywords.join(", "),
    authors: author ? [{ name: author }] : undefined,
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
    verification,
    icons,
    robots: createRobotsConfig(noindex, nofollow),
    openGraph: createOpenGraphConfig({
      title,
      description,
      type,
      url,
      image,
      publishedTime,
      modifiedTime,
    }),
    twitter: createTwitterConfig({
      title,
      description,
      image,
    }),
  };

  // 添加 JSON-LD 结构化数据
  if (jsonLd) {
    addJsonLdToMetadata(metadata, jsonLd);
  }

  // 处理社交媒体配置
  if (social) {
    updateSocialMetadata(metadata, social);
  }

  // 过滤掉 undefined 值
  return filterUndefinedValues(metadata);
}

/**
 * 创建 robots 配置
 */
function createRobotsConfig(noindex: boolean, nofollow: boolean) {
  return {
    index: !noindex,
    follow: !nofollow,
    googleBot: {
      index: !noindex,
      follow: !nofollow,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  };
}

/**
 * 创建 Open Graph 配置
 */
function createOpenGraphConfig(options: {
  title: string | undefined;
  description: string;
  type: "website" | "article" | "profile";
  url: string | undefined;
  image: string | undefined;
  publishedTime: string | undefined;
  modifiedTime: string | undefined;
}) {
  const { title, description, type, url, image, publishedTime, modifiedTime } = options;

  return {
    title: title ?? SITE_METADATA.title,
    description,
    type,
    url,
    images: image ? [{ url: image }] : undefined,
    publishedTime,
    modifiedTime,
    siteName: SITE_METADATA.title,
  };
}

/**
 * 创建 Twitter 配置
 */
function createTwitterConfig(options: {
  title: string | undefined;
  description: string;
  image: string | undefined;
}) {
  const { title, description, image } = options;

  return {
    card: "summary_large_image",
    title: title ?? SITE_METADATA.title,
    description,
    images: image ? [image] : undefined,
    creator: SITE_METADATA.twitter,
  };
}

/**
 * 添加 JSON-LD 结构化数据到元数据
 */
function addJsonLdToMetadata(metadata: Metadata, jsonLd: GenerateMetadataOptions["jsonLd"]) {
  if (!jsonLd) return;

  const jsonLdData = {
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
  };

  // 创建一个新的对象来避免类型冲突
  const otherData: Record<string, string> = {};
  otherData["application/ld+json"] = JSON.stringify(jsonLdData);

  metadata.other = {
    ...metadata.other,
    ...otherData,
  };
}

/**
 * 更新社交媒体元数据
 */
function updateSocialMetadata(metadata: Metadata, social: GenerateMetadataOptions["social"]) {
  if (!social) return;

  if (social.twitter && metadata.twitter) {
    metadata.twitter = {
      ...metadata.twitter,
      site: social.twitter,
    };
  }

  if (social.facebook && metadata.openGraph) {
    metadata.openGraph = {
      ...metadata.openGraph,
      siteName: social.facebook,
    };
  }
}

/**
 * 生成文章类型的元数据
 */
export function generateArticleMetadata(options: Omit<GenerateMetadataOptions, "type">): Metadata {
  return generateMetadata({ ...options, type: "article" });
}

/**
 * 生成个人资料类型的元数据
 */
export function generateProfileMetadata(options: Omit<GenerateMetadataOptions, "type">): Metadata {
  return generateMetadata({ ...options, type: "profile" });
}
