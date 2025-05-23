import { Metadata } from 'next';
import { SITE_METADATA } from '@/lib/constants';

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
  type?: 'website' | 'article' | 'profile';

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
}

/**
 * 生成视口配置
 *
 * @returns 视口配置
 */
export function generateViewport() {
  return {
    // 视口
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,

    // 主题色
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
  };
}

/**
 * 生成 Metadata 对象
 *
 * @param options 选项
 * @returns Metadata 对象
 */
export function generateMetadata(options: GenerateMetadataOptions = {}): Metadata {
  const {
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
  } = options;

  // 完整标题
  const fullTitle = title ? `${title} | ${SITE_METADATA.title}` : SITE_METADATA.title;

  // 完整 URL
  const fullUrl = url || SITE_METADATA.url;

  // 完整图片 URL
  const fullImage = image.startsWith('http') ? image : `${SITE_METADATA.url}${image}`;

  // 机器人指令
  const robots = {
    index: !noindex,
    follow: !nofollow,
  };

  return {
    // 基本信息
    title: fullTitle,
    description,

    // 机器人指令
    robots,

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_METADATA.title,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale,
      type,
      ...(type === 'article'
        ? {
            authors: [author],
            publishedTime: date,
            modifiedTime: modified || date,
          }
        : {}),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: SITE_METADATA.twitter,
    },

    // 其他
    keywords: keywords.join(', '),
    authors: [{ name: author, url: SITE_METADATA.url }],
    creator: author,
    publisher: SITE_METADATA.title,

    // 替代语言
    alternates: {
      canonical: fullUrl,
    },

    // 图标
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },

    // 验证
    verification: {
      google: 'google-site-verification',
      yandex: 'yandex-verification',
      yahoo: 'yahoo-verification',
      bing: 'msvalidate.01',
      other: {
        me: ['hello@iflux.art'],
      },
    },
  };
}
