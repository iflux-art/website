import type { Metadata } from 'next';

/**
 * 站点配置接口
 */
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage?: string;
  twitterHandle?: string;
  locale?: string;
  keywords?: string[];
}

/**
 * SEO页面选项接口
 */
export interface SEOPageOptions {
  title: string;
  description?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  category?: string;
  image?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
}

/**
 * 默认站点配置
 */
const DEFAULT_SITE_CONFIG: SiteConfig = {
  name: '个人网站',
  description: '个人博客和作品展示网站',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'zh-CN',
  keywords: ['博客', '技术', '前端', '开发'],
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
    keywords: allKeywords.join(', '),
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
    type: type as 'website' | 'article',
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
    card: 'summary_large_image' as const,
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

  return {
    ...(category && { 'article:section': category }),
    ...(tags.length > 0 && { 'article:tag': tags.join(',') }),
  };
}

/**
 * 过滤undefined值
 */
function filterUndefinedValues(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
}

/**
 * 生成完整的SEO元数据
 */
export function generateSEOMetadata(
  options: SEOPageOptions,
  siteConfig: SiteConfig = DEFAULT_SITE_CONFIG
): Metadata {
  const {
    title,
    description,
    keywords = [],
    type = 'website',
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

  const fullTitle = title.includes(siteConfig.name) ? title : `${title} - ${siteConfig.name}`;
  const fullDescription = description || siteConfig.description;
  const allKeywords = [...(siteConfig.keywords || []), ...keywords, ...tags];
  const imageUrl = image || siteConfig.ogImage;

  const basicMetadata = generateBasicMetadata({
    title,
    fullTitle,
    fullDescription,
    allKeywords,
    authors,
    category,
    noIndex,
    noFollow,
    canonicalUrl,
  });

  const openGraph = generateOpenGraphMetadata({
    fullTitle,
    fullDescription,
    type,
    canonicalUrl,
    siteUrl: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    imageUrl,
    title,
    publishedTime,
    modifiedTime,
    authors,
    tags,
  });

  const twitter = generateTwitterMetadata({
    fullTitle,
    fullDescription,
    twitterHandle: siteConfig.twitterHandle,
    imageUrl,
  });

  const other = generateOtherMetadata({ category, tags });

  const metadata = {
    ...basicMetadata,
    openGraph,
    twitter,
    other,
  };

  return filterUndefinedValues(metadata) as Metadata;
}

/**
 * 生成博客文章元数据
 */
export function generateBlogMetadata(options: {
  title: string;
  description?: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  tags?: string[];
  category?: string;
  image?: string;
}): Metadata {
  return generateSEOMetadata({
    ...options,
    type: 'article',
    authors: [options.author],
  });
}

/**
 * 生成博客列表页元数据
 */
export function generateBlogListMetadata(options: {
  title?: string;
  description?: string;
  keywords?: string[];
}): Metadata {
  return generateSEOMetadata({
    title: options.title || '博客',
    description: options.description || '分享技术、生活和思考的博客文章',
    keywords: options.keywords || ['博客', '技术', '编程', '前端', '开发'],
    type: 'website',
  });
}

/**
 * 生成文档页面元数据
 */
export function generateDocsMetadata(options: {
  title: string;
  description?: string;
  section?: string;
  lastUpdated?: string;
}): Metadata {
  return generateSEOMetadata({
    title: options.title,
    description: options.description,
    category: options.section || '文档',
    modifiedTime: options.lastUpdated,
    type: 'website',
  });
}

/**
 * 生成产品页面元数据
 */
export function generateProductMetadata(options: {
  name: string;
  description?: string;
  image?: string;
  tags?: string[];
}): Metadata {
  return generateSEOMetadata({
    title: options.name,
    description: options.description,
    image: options.image,
    tags: options.tags,
    type: 'website',
  });
}

/**
 * 生成JSON-LD结构化数据
 */
export function generateJsonLd(type: string, data: Record<string, unknown>) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return JSON.stringify(baseData, null, 2);
}

/**
 * 生成文章JSON-LD
 */
export function generateArticleJsonLd(options: {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
  url: string;
}) {
  return generateJsonLd('Article', {
    headline: options.title,
    description: options.description,
    author: {
      '@type': 'Person',
      name: options.author,
    },
    datePublished: options.publishedTime,
    dateModified: options.modifiedTime || options.publishedTime,
    image: options.image,
    url: options.url,
  });
}

/**
 * 获取面包屑JSON-LD
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return generateJsonLd('BreadcrumbList', {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * 验证元数据配置
 */
export function validateMetadata(metadata: Metadata): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];

  // 检查标题长度
  if (metadata.title) {
    const titleLength = metadata.title.toString().length;
    if (titleLength > 60) {
      warnings.push(`标题过长 (${titleLength} 字符)，建议控制在60字符以内`);
    }
    if (titleLength < 10) {
      warnings.push(`标题过短 (${titleLength} 字符)，建议至少10字符`);
    }
  } else {
    errors.push('缺少页面标题');
  }

  // 检查描述长度
  if (metadata.description) {
    const descLength = metadata.description.length;
    if (descLength > 160) {
      warnings.push(`描述过长 (${descLength} 字符)，建议控制在160字符以内`);
    }
    if (descLength < 50) {
      warnings.push(`描述过短 (${descLength} 字符)，建议至少50字符`);
    }
  } else {
    warnings.push('建议添加页面描述');
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}
