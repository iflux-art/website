/**
 * Windows 设备配置
 * 包含Windows平台特定配置
 */

/**
 * Windows配置类型
 */
export interface WindowsConfig {
  msapplicationTileColor: string;
  msapplicationTileImage: string;
}

/**
 * Windows 设备配置
 */
export const WINDOWS_CONFIG: WindowsConfig = {
  msapplicationTileColor: "#000000",
  msapplicationTileImage: "/images/icons/ms-icon-144x144.png",
} as const;
