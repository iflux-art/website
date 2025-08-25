/**
 * 工具函数统一导出
 * 整合所有通用工具函数，避免重复实现
 */

// ==================== 元数据和SEO工具函数 ====================
export * from './metadata'; // 基础元数据生成函数和SEO工具函数

// ==================== API工具函数 ====================
export * from './api'; // API工具函数、中间件和路径常量

// ==================== 错误处理工具函数 ====================
export * from './error'; // 统一错误处理工具

// ==================== 布局工具函数 ====================
// 页面容器和网格布局工具函数（直接从布局模块导入）
export {
  getMainContentClasses,
  getSidebarClasses,
  DEFAULT_SIDEBAR_CONFIG,
  THREE_COLUMN_LAYOUT_CONFIG,
  gridColsMap,
  gridGapMap,
} from '@/lib/layout/layout-utils';
export type { GridColsMap, GridGapMap } from '@/types';
