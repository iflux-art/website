export interface IconConfig {
  icon?: string;
  shortcut?: string;
  apple?: string;
  mask?: string;
  manifest?: string;
}

export interface VerificationConfig {
  google?: string;
  yandex?: string;
  yahoo?: string;
  other?: Record<string, string[]>;
}

export interface JsonLdConfig {
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

export interface SocialConfig {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

export interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  date?: string;
  modified?: string;
  locale?: string;
  url?: string;
  noindex?: boolean;
  nofollow?: boolean;
  icons?: IconConfig;
  verification?: VerificationConfig;
  jsonLd?: JsonLdConfig;
  social?: SocialConfig;
}

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
  type?: "website" | "article" | "profile";
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
