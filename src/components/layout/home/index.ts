/**
 * 首页组件统一导出
 * 便于统一管理和导入首页相关组件
 */

// 主要组件
export { HomeHero } from './home-hero';
export { SearchBox } from './search-box';
export { Greeting } from './greeting';
export { RecommendationTags } from './recommendation-tags';
export { EnhancedBackground } from './enhanced-background';

// 常量和工具
export * from './constants';
export * from './utils';

// 类型定义
export type {
  TimeOfDay,
  BackgroundStyle,
  SearchEngineId,
  AIModelId,
} from './constants';
