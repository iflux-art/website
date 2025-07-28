import { SITE_METADATA } from "@/config/metadata";
import type { Metadata } from "next";

type GenerateMetadataOptions = {
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
  icons?: {
    icon?: string;
    shortcut?: string;
    apple?: string;
    mask?: string;
    manifest?: string;
  };
  verification?: {
    google?: string;
    yandex?: string;
    yahoo?: string;
    other?: Record<string, string[]>;
  };
  jsonLd?: {
    type: string;
    name?: string;
    description?: string;
    url?: string;
    image?: string;
    author?: string;
    datePublished?: string;
    dateModified?: string;
    [key: string]: string | undefined;
  };
  social?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
  };
};

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

const metadataCache = new Map<string, Metadata>();

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
