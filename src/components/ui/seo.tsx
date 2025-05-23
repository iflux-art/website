import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SITE_METADATA } from '@/lib/constants';

/**
 * SEO 组件属性
 */
export interface SeoProps {
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
  type?: 'website' | 'article' | 'blog' | 'profile';

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
   * 是否禁用图片索引
   */
  noimageindex?: boolean;

  /**
   * 是否禁用存档
   */
  noarchive?: boolean;

  /**
   * 是否禁用嗅探
   */
  nositelinkssearchbox?: boolean;

  /**
   * 是否禁用翻译
   */
  notranslate?: boolean;

  /**
   * 是否禁用缓存
   */
  nocache?: boolean;

  /**
   * 子元素
   */
  children?: React.ReactNode;
}

/**
 * SEO 组件
 *
 * 用于优化 SEO，添加 meta 标签
 *
 * @example
 * ```tsx
 * <Seo
 *   title="页面标题"
 *   description="页面描述"
 *   keywords={["关键词1", "关键词2"]}
 * />
 * ```
 */
export function Seo({
  title,
  description = SITE_METADATA.description,
  keywords = SITE_METADATA.keywords,
  image = SITE_METADATA.image,
  type = 'website',
  author = SITE_METADATA.author,
  date,
  modified,
  locale = 'zh_CN',
  url,
  noindex = false,
  nofollow = false,
  noimageindex = false,
  noarchive = false,
  nositelinkssearchbox = false,
  notranslate = false,
  nocache = false,
  children,
}: SeoProps) {
  const router = useRouter();
  
  // 完整标题
  const fullTitle = title
    ? `${title} | ${SITE_METADATA.title}`
    : SITE_METADATA.title;
  
  // 完整 URL
  const fullUrl = url || `${SITE_METADATA.url}${router.asPath}`;
  
  // 完整图片 URL
  const fullImage = image.startsWith('http')
    ? image
    : `${SITE_METADATA.url}${image}`;
  
  // 机器人指令
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
    noimageindex ? 'noimageindex' : null,
    noarchive ? 'noarchive' : null,
    nositelinkssearchbox ? 'nositelinkssearchbox' : null,
    notranslate ? 'notranslate' : null,
    nocache ? 'nocache' : null,
  ]
    .filter(Boolean)
    .join(', ');
  
  return (
    <Head>
      {/* 基本 Meta 标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta 标签 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={SITE_METADATA.title} />
      
      {/* Twitter Meta 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* 文章 Meta 标签 */}
      {(type === 'article' || type === 'blog') && author && (
        <meta property="article:author" content={author} />
      )}
      {(type === 'article' || type === 'blog') && date && (
        <meta property="article:published_time" content={date} />
      )}
      {(type === 'article' || type === 'blog') && modified && (
        <meta property="article:modified_time" content={modified} />
      )}
      
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' || type === 'blog' ? 'Article' : 'WebPage',
            headline: title,
            description: description,
            image: fullImage,
            url: fullUrl,
            ...(type === 'article' || type === 'blog'
              ? {
                  author: {
                    '@type': 'Person',
                    name: author,
                  },
                  datePublished: date,
                  dateModified: modified || date,
                  publisher: {
                    '@type': 'Organization',
                    name: SITE_METADATA.title,
                    logo: {
                      '@type': 'ImageObject',
                      url: `${SITE_METADATA.url}/logo.png`,
                    },
                  },
                }
              : {}),
          }),
        }}
      />
      
      {/* 其他 Meta 标签 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* 子元素 */}
      {children}
    </Head>
  );
}
