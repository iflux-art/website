import { SITE_METADATA } from "packages/src/config/metadata";
import type { Metadata } from "next";
import type { GenerateMetadataOptions } from "packages/src/types/metadata-types";

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

function generateJsonLd(config: any): string {
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
        "application/ld+json": generateJsonLd(jsonLd),
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
