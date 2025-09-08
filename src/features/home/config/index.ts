/**
 * @file src/features/home/config/index.ts
 * @description 主页模块配置文件
 */

// 主页特定的配置
export const HOME_CONFIG = {
  // 主页标题
  title: "iFluxArt · 斐流艺创",

  // 主页描述
  description: "iFluxArt · 斐流艺创 - 智能技术与艺术创作的有机融合",

  // Hero区域配置
  hero: {
    title: "斐启智境，流韵新生",
    subtitle: "探索 AI 与艺术的无限可能，分享技术与创意的完美结合",
    ctaButtons: [],
  },

  // SEO配置
  seo: {
    title: "首页",
    description: "iFluxArt · 斐流艺创 - 智能技术与艺术创作的有机融合，探索AI与艺术的无限可能",
    type: "website",
  },
} as const;
