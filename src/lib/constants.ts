// 导航项类型
interface NavItem {
  key: string;
  label: string;
}

// 站点元数据类型
interface SiteMetadata {
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

// PWA配置类型
interface PwaConfig {
  manifestPath: string;
  applicationName: string;
  themeColor: string;
  mobileWebAppCapable: string;
}

// 移动设备配置类型
interface MobileConfig {
  viewport: string;
  formatDetection: string;
  msapplicationTapHighlight: string;
}

// iOS配置类型
interface IosConfig {
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

// Windows配置类型
interface WindowsConfig {
  msapplicationTileColor: string;
  msapplicationTileImage: string;
}

// 图标配置类型
interface IconsConfig {
  favicon32: string;
  favicon16: string;
  favicon: string;
}

/**
 * 全局常量配置文件
 * 集中管理应用中使用的常量，便于维护和复用
 */

// 导航菜单项配置
export const NAV_ITEMS: NavItem[] = [
  { key: 'blog', label: '博客' },
  { key: 'docs', label: '文档' },
  { key: 'tools', label: '工具' },
  { key: 'navigation', label: '导航' },
];
// 网站元数据
export const SITE_METADATA: SiteMetadata = {
  // 基本信息
  title: 'iFluxArt · 斐流艺创',
  description: '斐启智境 · 流韵新生',
  author: 'iFluxArt Team',

  // SEO 相关
  url: 'https://iflux.art',
  image: '/images/og-image.png',
  keywords: ['iFluxArt', '斐流艺创', '人工智能', 'AI', '艺术创作', '数字艺术'],

  // 社交媒体
  twitter: '@ifluxart',
  github: 'iflux-art',

  // 联系方式
  email: 'hello@iflux.art',

  // 版权信息
  copyright: `© ${new Date().getFullYear()} iFluxArt · 斐流艺创`,
};
// PWA 配置
export const PWA_CONFIG: PwaConfig = {
  manifestPath: '/manifest.json',
  applicationName: 'iFluxArt · 斐流艺创',

  themeColor: '#000000',
  mobileWebAppCapable: 'yes',
};
// 移动设备配置
export const MOBILE_CONFIG: MobileConfig = {
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
  formatDetection: 'telephone=no',
  msapplicationTapHighlight: 'no',
};
// iOS 设备配置
export const IOS_CONFIG: IosConfig = {
  mobileWebAppCapable: 'yes',
  statusBarStyle: 'black-translucent',
  appTitle: 'iFluxArt · 斐流艺创',
  icons: {
    touchIcon: '/images/icons/apple-touch-icon.png',
  },
  splashScreens: [
    {
      href: '/images/splash/apple-splash-2048-2732.png',
      media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    },
    {
      href: '/images/splash/apple-splash-1668-2388.png',
      media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    },
    {
      href: '/images/splash/apple-splash-1536-2048.png',
      media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
    },
    {
      href: '/images/splash/apple-splash-1125-2436.png',
      media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
    },
  ],
};
// Windows 设备配置
export const WINDOWS_CONFIG: WindowsConfig = {
  msapplicationTileColor: '#000000',
  msapplicationTileImage: '/images/icons/ms-icon-144x144.png',
};
// 图标配置
export const ICONS_CONFIG: IconsConfig = {
  favicon32: '/images/icons/favicon-32x32.png',
  favicon16: '/images/icons/favicon-16x16.png',
  favicon: '/favicon.ico',
};