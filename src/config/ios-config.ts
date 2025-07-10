/**
 * iOS 设备配置
 * 包含iOS设备上的显示和行为配置
 */

/**
 * iOS配置类型
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

/**
 * iOS 设备配置
 */
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

/**
 * iOS设备特定配置
 * @description 包含iOS设备上的显示和行为配置
 * @property {boolean} appleMobileWebAppCapable - 是否作为独立应用运行
 * @property {string} appleMobileWebAppStatusBarStyle - 状态栏样式
 * @property {string} appleMobileWebAppTitle - iOS上显示的应用名称
 * @property {string} touchIcon - 添加到主屏幕的图标
 * @property {Array} splashScreens - 启动画面配置
 */
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
