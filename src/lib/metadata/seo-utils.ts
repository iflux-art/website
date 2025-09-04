import type { SEOPageOptions, SiteConfig } from "@/types";
import type { Metadata } from "next";
import { filterUndefinedValues } from "@/utils/helpers";
import { SITE_METADATA } from "@/config";

/**
 * 默认站点配置
 */
const DEFAULT_SITE_CONFIG: SiteConfig = {
  name: SITE_METADATA.title,
  description: SITE_METADATA.description,
  url: SITE_METADATA.url,
  locale: "zh-CN",
  keywords: SITE_METADATA.keywords,
  twitterHandle: SITE_METADATA.twitter,
};

/**
 * 生成基础元数据信息
 */
function generateBasicMetadata(options: {
  title: string;
  fullTitle: string;
  fullDescription: string;
  allKeywords: string[];
  authors: string[];
  category?: string;
  noIndex: boolean;
  noFollow: boolean;
  canonicalUrl?: string;
}) {
  const {
    fullTitle,
    fullDescription,
    allKeywords,
    authors,
    category,
    noIndex,
    noFollow,
    canonicalUrl,
  } = options;

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords.join(","),
    authors: authors.length > 0 ? authors.map(name => ({ name })) : undefined,
    category,
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
      },
    },
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
  };
}

/**
 * 生成 Open Graph 元数据
 */
function generateOpenGraphMetadata(options: {
  fullTitle: string;
  fullDescription: string;
  type: string;
  canonicalUrl?: string;
  siteUrl: string;
  siteName: string;
  locale?: string;
  imageUrl?: string;
  title: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors: string[];
  tags: string[];
}) {
  const {
    fullTitle,
    fullDescription,
    type,
    canonicalUrl,
    siteUrl,
    siteName,
    locale,
    imageUrl,
    title,
    publishedTime,
    modifiedTime,
    authors,
    tags,
  } = options;

  return {
    title: fullTitle,
    description: fullDescription,
    type: type as "website" | "article",
    url: canonicalUrl || siteUrl,
    siteName,
    locale,
    images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
    publishedTime,
    modifiedTime,
    authors: authors.length > 0 ? authors : undefined,
    tags: tags.length > 0 ? tags : undefined,
  };
}

/**
 * 生成 Twitter 卡片元数据
 */
function generateTwitterMetadata(options: {
  fullTitle: string;
  fullDescription: string;
  twitterHandle?: string;
  imageUrl?: string;
}) {
  const { fullTitle, fullDescription, twitterHandle, imageUrl } = options;

  return {
    card: "summary_large_image" as const,
    title: fullTitle,
    description: fullDescription,
    creator: twitterHandle,
    images: imageUrl ? [imageUrl] : undefined,
  };
}

/**
 * 生成其他元数据标签
 */
function generateOtherMetadata(options: { category?: string; tags: string[] }) {
  const { category, tags } = options;

  const other: Record<string, string> = {};

  if (category) {
    other["article:section"] = category;
  }

  if (tags.length > 0) {
    other["article:tag"] = tags.join(",");
  }

  return other;
}

/**
 * 生成文档页面专用元数据
 */
export function generateDocsMetadata(options: {
  title?: string;
  description?: string;
  section?: string;
  lastUpdated?: string;
  image?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}): Metadata {
  const {
    title = "文档",
    description = "技术文档",
    section,
    lastUpdated,
    image,
    noIndex = false,
    noFollow = false,
  } = options;

  const fullTitle = `${title} - 文档`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    robots: {
      index: !noIndex,
      follow: !noFollow,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "article",
      ...(lastUpdated && { modifiedTime: lastUpdated }),
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
    },
  };

  // 添加文章特定的元数据
  const otherMetadata: Record<string, string> = {};

  if (section) {
    otherMetadata["article:section"] = section;
  }

  if (lastUpdated) {
    otherMetadata["article:modified_time"] = lastUpdated;
  }

  if (Object.keys(otherMetadata).length > 0) {
    metadata.other = {
      ...metadata.other,
      ...otherMetadata,
    };
  }

  return filterUndefinedValues(metadata);
}

/**
 * 生成完整的SEO元数据
 */
export function generateSEOMetadata(
  options: SEOPageOptions,
  siteConfig: SiteConfig = DEFAULT_SITE_CONFIG
): Metadata {
  const processedOptions = processSEOMetadataOptions(options, siteConfig);

  // 构建基础元数据
  const baseMetadata = generateBasicMetadata(processedOptions.basic);

  // 构建 Open Graph 元数据
  const openGraphMetadata = generateOpenGraphMetadata(processedOptions.openGraph);

  // 构建 Twitter 元数据
  const twitterMetadata = generateTwitterMetadata(processedOptions.twitter);

  // 构建其他元数据
  const otherMetadata = generateOtherMetadata(processedOptions.other);

  // 合并所有元数据
  const metadata: Metadata = {
    ...baseMetadata,
    openGraph: openGraphMetadata,
    twitter: twitterMetadata,
  };

  if (Object.keys(otherMetadata).length > 0) {
    metadata.other = {
      ...metadata.other,
      ...otherMetadata,
    };
  }

  return filterUndefinedValues(metadata);
}

/**
 * 处理SEO元数据选项
 */
function processSEOMetadataOptions(options: SEOPageOptions, siteConfig: SiteConfig) {
  const {
    title,
    description,
    keywords = [],
    type = "website",
    publishedTime,
    modifiedTime,
    authors = [],
    tags = [],
    category,
    image,
    noIndex = false,
    noFollow = false,
    canonicalUrl,
  } = options;

  const fullTitle = getFullTitle(title, siteConfig.name);
  const fullDescription = description || siteConfig.description;
  const allKeywords = [...(keywords || []), ...(siteConfig.keywords || [])];
  const siteUrl = canonicalUrl || siteConfig.url;

  return {
    basic: {
      title,
      fullTitle,
      fullDescription,
      allKeywords,
      authors,
      category,
      noIndex,
      noFollow,
      canonicalUrl,
    },
    openGraph: {
      fullTitle,
      fullDescription,
      type,
      canonicalUrl,
      siteUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      imageUrl: image,
      title,
      publishedTime,
      modifiedTime,
      authors,
      tags,
    },
    twitter: {
      fullTitle,
      fullDescription,
      twitterHandle: siteConfig.twitterHandle,
      imageUrl: image,
    },
    other: {
      category,
      tags,
    },
  };
}

/**
 * 获取完整标题
 */
function getFullTitle(title: string, siteName: string): string {
  return title.includes(siteName) ? title : `${title} - ${siteName}`;
}
