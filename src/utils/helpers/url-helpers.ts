/**
 * URL相关工具函数
 *
 * 提供与URL处理相关的工具函数。
 *
 * @author 系统重构
 * @since 2024
 */

/**
 * 创建页面URL
 */
export function createPageUrl(baseUrl: string, ...segments: (string | number)[]): string {
  const cleanSegments = segments
    .filter(segment => segment !== undefined && segment !== null && segment !== "")
    .map(segment => String(segment).replace(/^\/+|\/+$/g, ""));

  return [baseUrl.replace(/\/+$/, ""), ...cleanSegments].filter(Boolean).join("/");
}

/**
 * 检查是否为移动端设备（服务端安全）
 */
export function isMobileUserAgent(userAgent = ""): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}
