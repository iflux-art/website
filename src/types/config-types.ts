/**
 * 配置相关类型定义
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
 * iOS 设备配置类型
 */
export interface IosConfig {
  mobileWebAppCapable: string;
  statusBarStyle: string;
  appTitle: string;
  icons: {
    touchIcon: string;
  };
  splashScreens: {
    href: string;
    media: string;
  }[];
}

/**
 * Windows 设备配置类型
 */
export interface WindowsConfig {
  msapplicationTileColor: string;
  msapplicationTileImage: string;
}
