/**
 * @file metadata.ts
 * @description Next.js 元数据配置文件
 *
 * 本文件聚合所有元数据配置，包括：
 * - 基础站点信息（标题、描述等）
 * - PWA相关配置
 * - iOS设备特定配置
 * - Windows平台特定配置
 * - 图标配置
 *
 * @usage
 * 在 layout.tsx 中使用：
 * ```typescript
 * import { metadata, viewport, splashScreens } from '@/config/metadata';
 *
 * export { metadata, viewport };
 * ```
 */

/**
 * 网站元数据类型
 */
export interface SiteMetadata {
  title: string;
  description: string;
  author: string;
  url: string;
  image: string;
  keywords: string[];
  twitter: string;
  github: string;
  email: string;
  copyright: string;
}

/**
 * 站点基础配置
 * 包含网站的基本信息
 */
export const SITE_METADATA: SiteMetadata = {
  title: "iFluxArt · 斐流艺创",
  description:
    '"斐流艺创" 是 "iFluxArt" 的中文翻译，代表智能技术与艺术创作的有机融合，"斐然成章" 的创作力与 "川流不息" 的技术流。我们致力于通过智能技术推动艺术创作，让创意与技术交融共生。探索未来艺术的可能性，共创数字时代的视觉盛宴。',
  author: "iFluxArt Team",
  url: "https://iflux.art",
  image: "/images/og-image.png",
  keywords: ["iFluxArt", "斐流艺创", "人工智能", "AI", "艺术创作", "数字艺术"],
  twitter: "@ifluxart",
  github: "iflux-art",
  email: "hello@iflux.art",
  copyright: `© ${new Date().getFullYear()} iFluxArt · 斐流艺创`,
};
export const SITE_AUTHOR = "iFluxArt Team";
export const SITE_URL = "https://iflux.art";
export const SITE_TWITTER = "@ifluxart";
export const SITE_GITHUB = "iflux-art";
export const SITE_EMAIL = "hello@iflux.art";
export const SITE_COPYRIGHT = `© ${new Date().getFullYear()} iFluxArt · 斐流艺创`;

/**
 * 视口配置
 * @description 控制页面在移动设备上的显示
 */
export const VIEWPORT_CONFIG = {
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#000000",
};

/**
 * PWA 配置
 * Progressive Web App 相关配置
 */
export interface PwaConfig {
  manifestPath: string;
  applicationName: string;
  themeColor: string;
  mobileWebAppCapable: string;
}
export const PWA_CONFIG: PwaConfig = {
  manifestPath: "/manifest.json",
  applicationName: "iFluxArt · 斐流艺创",
  themeColor: "#000000",
  mobileWebAppCapable: "yes",
} as const;
export const pwaConfig = {
  manifest: PWA_CONFIG.manifestPath,
  apple: {
    mobileWebAppCapable: "yes",
    applicationName: PWA_CONFIG.applicationName,
  },
} as const;

/**
 * iOS 设备配置
 * 包含iOS设备上的显示和行为配置
 */
export interface IosConfig {
  mobileWebAppCapable: string;
  statusBarStyle: string;
  appTitle: string;
  icons: {
    touchIcon: string;
  };
  splashScreens: Array<{
    href: string;
    media: string;
  }>;
}
export const IOS_CONFIG: IosConfig = {
  mobileWebAppCapable: "yes",
  statusBarStyle: "black-translucent",
  appTitle: "iFluxArt · 斐流艺创",
  icons: {
    touchIcon: "/images/icons/apple-touch-icon.png",
  },
  splashScreens: [
    {
      href: "/images/splash/apple-splash-2048-2732.png",
      media:
        "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "/images/splash/apple-splash-1668-2388.png",
      media:
        "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "/images/splash/apple-splash-1536-2048.png",
      media:
        "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
    },
    {
      href: "/images/splash/apple-splash-1125-2436.png",
      media:
        "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    },
  ],
} as const;
export const iosConfig = {
  appleMobileWebAppCapable: IOS_CONFIG.mobileWebAppCapable === "yes",
  appleMobileWebAppStatusBarStyle: IOS_CONFIG.statusBarStyle as
    | "default"
    | "black"
    | "black-translucent",
  appleMobileWebAppTitle: IOS_CONFIG.appTitle as string,
  touchIcon: IOS_CONFIG.icons.touchIcon as string,
  splashScreens: IOS_CONFIG.splashScreens as Array<{
    href: string;
    media: string;
  }>,
} as const;

/**
 * Windows 设备配置
 * 包含Windows平台特定配置
 */
export interface WindowsConfig {
  msapplicationTileColor: string;
  msapplicationTileImage: string;
}
export const WINDOWS_CONFIG: WindowsConfig = {
  msapplicationTileColor: "#000000",
  msapplicationTileImage: "/images/icons/ms-icon-144x144.png",
} as const;

/**
 * API路径配置
 */
export const API_PATHS = {
  BLOG: {
    POSTS: "/api/blog/posts",
    TAGS_COUNT: "/api/blog/tags/count",
    CATEGORIES: "/api/blog/categories",
    TIMELINE: "/api/blog/timeline",
  },
  DOCS: {
    CATEGORIES: "/api/docs/categories",
    CATEGORY: (category: string) =>
      `/api/docs/categories/${encodeURIComponent(category)}`,
    META: (path: string) => `/api/docs/${encodeURIComponent(path)}/meta`,
    CONTENT: (path: string) => `/api/docs/${encodeURIComponent(path)}`,
  },
} as const;

export {
  generateMetadata,
  generateViewport,
  generateArticleMetadata,
  generateProfileMetadata,
} from "@/lib/metadata";
export type {
  PageType,
  IconConfig,
  VerificationConfig,
  JsonLdConfig,
  SocialConfig,
  GenerateMetadataOptions,
} from "@/types";
