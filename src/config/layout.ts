/**
 * 布局相关的配置常量
 */

/**
 * 页面顶部固定导航栏的高度
 */
export const NAVBAR_HEIGHT = 80;

/**
 * 滚动偏移量，用于锚点定位时避免被导航栏遮挡
 */
export const SCROLL_OFFSET = NAVBAR_HEIGHT;

/**
 * 内容类型及其对应的基础路由
 */
export const CONTENT_BASE_ROUTES = {
  blog: '/blog',
  docs: '/docs',
} as const;
