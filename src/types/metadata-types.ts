export const PAGE_TYPES = {
  WEBSITE: 'website',
  ARTICLE: 'article',
  PROFILE: 'profile',
} as const;

export type PageType = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES];

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
  type?: PageType;
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
