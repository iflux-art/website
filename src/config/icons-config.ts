/**
 * 图标配置
 * 包含网站图标相关配置
 */

/**
 * 图标配置类型
 */
export interface IconsConfig {
  favicon32: string;
  favicon16: string;
  favicon: string;
}

/**
 * 图标配置
 */
export const ICONS_CONFIG: IconsConfig = {
  favicon32: "/images/icons/favicon-32x32.png",
  favicon16: "/images/icons/favicon-16x16.png",
  favicon: "/favicon.ico",
} as const;
