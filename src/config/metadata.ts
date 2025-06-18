/**
 * @file metadata.ts
 * @description Next.js 元数据配置文件
 *
 * 本文件集中管理网站的元数据配置，包括：
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

import { Metadata } from 'next';
import { PWA_CONFIG, IOS_CONFIG, WINDOWS_CONFIG, ICONS_CONFIG } from '@/lib/constants';

/**
 * 基础站点元数据配置
 * @description 包含网站的基本信息
 */
const siteMetadata = {
  title: 'iFluxArt · 斐流艺创',
  description:
    '“斐流艺创” 是 “iFluxArt” 的中文翻译，代表智能技术与艺术创作的有机融合，“斐然成章” 的创作力与 “川流不息” 的技术流。我们致力于通过智能技术推动艺术创作，让创意与技术交融共生。探索未来艺术的可能性，共创数字时代的视觉盛宴。',
};

/**
 * 视口配置
 * @description 控制页面在移动设备上的显示
 */
const viewportConfig = {
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: PWA_CONFIG.themeColor,
};

/**
 * PWA配置
 * @description Progressive Web App 相关配置
 */
const pwaConfig = {
  manifest: PWA_CONFIG.manifestPath,
  apple: {
    mobileWebAppCapable: 'yes',
    applicationName: PWA_CONFIG.applicationName,
  },
};

/**
 * iOS设备特定配置
 * @description 包含iOS设备上的显示和行为配置
 * @property {boolean} appleMobileWebAppCapable - 是否作为独立应用运行
 * @property {string} appleMobileWebAppStatusBarStyle - 状态栏样式
 * @property {string} appleMobileWebAppTitle - iOS上显示的应用名称
 * @property {string} touchIcon - 添加到主屏幕的图标
 * @property {Array} splashScreens - 启动画面配置
 */
const iosConfig = {
  appleMobileWebAppCapable: IOS_CONFIG.mobileWebAppCapable === 'yes',
  appleMobileWebAppStatusBarStyle: IOS_CONFIG.statusBarStyle as
    | 'default'
    | 'black'
    | 'black-translucent',
  appleMobileWebAppTitle: IOS_CONFIG.appTitle as string,
  touchIcon: IOS_CONFIG.icons.touchIcon as string,
  splashScreens: IOS_CONFIG.splashScreens as Array<{
    href: string;
    media: string;
  }>,
};

/**
 * 网站元数据导出配置
 * @description 符合 Next.js Metadata API 的配置对象
 */
export const metadata: Metadata = {
  ...siteMetadata,
  manifest: pwaConfig.manifest,
  appleWebApp: {
    capable: iosConfig.appleMobileWebAppCapable,
    statusBarStyle: iosConfig.appleMobileWebAppStatusBarStyle,
    title: iosConfig.appleMobileWebAppTitle,
  },
  icons: {
    icon: [
      { url: ICONS_CONFIG.favicon16, sizes: '16x16', type: 'image/png' },
      { url: ICONS_CONFIG.favicon32, sizes: '32x32', type: 'image/png' },
    ],
    shortcut: [{ url: ICONS_CONFIG.favicon }],
    apple: [{ url: iosConfig.touchIcon, sizes: '180x180' }],
  },
  other: {
    'msapplication-TileColor': WINDOWS_CONFIG.msapplicationTileColor,
    'msapplication-TileImage': WINDOWS_CONFIG.msapplicationTileImage,
  },
};

/**
 * 视口配置导出
 * @description 用于控制页面在各种设备上的显示方式
 */
export const viewport = {
  ...viewportConfig.viewport,
  themeColor: viewportConfig.themeColor,
};

/**
 * iOS启动画面配置导出
 * @description 用于自定义iOS设备上的启动画面
 * @example
 * ```tsx
 * {splashScreens.map((screen, index) => (
 *   <link
 *     key={index}
 *     rel="apple-touch-startup-image"
 *     href={screen.href}
 *     media={screen.media}
 *   />
 * ))}
 * ```
 */
export const splashScreens = iosConfig.splashScreens;
