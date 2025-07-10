/**
 * PWA 配置
 * Progressive Web App 相关配置
 */

/**
 * PWA配置类型
 */
export interface PwaConfig {
  manifestPath: string;
  applicationName: string;
  themeColor: string;
  mobileWebAppCapable: string;
}

/**
 * PWA 配置
 */
export const PWA_CONFIG: PwaConfig = {
  manifestPath: "/manifest.json",
  applicationName: "iFluxArt · 斐流艺创",
  themeColor: "#000000",
  mobileWebAppCapable: "yes",
} as const;

/**
 * PWA配置导出
 * @description Progressive Web App 相关配置
 */
export const pwaConfig = {
  manifest: PWA_CONFIG.manifestPath,
  apple: {
    mobileWebAppCapable: "yes",
    applicationName: PWA_CONFIG.applicationName,
  },
} as const;
