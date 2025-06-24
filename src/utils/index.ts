/**
 * 工具函数统一导出
 */

// 样式工具
export { cn } from './styles';

// 文本处理工具
export { countWords, formatReadingTime, slugify } from './text';

// DOM 操作工具
export { scrollToElement, isElementInViewport, getElementPosition } from './dom';

// 路由工具
export { buildTagLink, buildCategoryLink } from './route';

// 配置导出
export { MDX_CONFIG } from './config';

// 现有的通用辅助函数
export * from './helpers';
