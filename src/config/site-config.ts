/**
 * 站点基础配置
 * 包含网站的基本信息
 */

/**
 * 标准 Metadata 字段
 */
export const SITE_METADATA = {
  title: "iFluxArt · 斐流艺创",
  description:
    '"斐流艺创" 是 "iFluxArt" 的中文翻译，代表智能技术与艺术创作的有机融合，"斐然成章" 的创作力与 "川流不息" 的技术流。我们致力于通过智能技术推动艺术创作，让创意与技术交融共生。探索未来艺术的可能性，共创数字时代的视觉盛宴。',
  keywords: ["iFluxArt", "斐流艺创", "人工智能", "AI", "艺术创作", "数字艺术"],
};

/**
 * 站点自定义信息
 */
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
