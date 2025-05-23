/**
 * 全局常量配置文件
 * 集中管理应用中使用的常量，便于维护和复用
 */

// 导航菜单项配置
export const NAV_ITEMS = [
  { key: 'docs', label: '文档' },
  { key: 'blog', label: '博客' },
  { key: 'navigation', label: '导航' },
  { key: 'friends', label: '友链' },
];

// 网站元数据
export const SITE_METADATA = {
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
