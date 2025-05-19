/**
 * 类型定义集中管理索引文件
 * 
 * 此文件作为项目所有类型定义的统一入口点，集中管理所有类型定义
 * 便于维护和引用，减少重复定义和导入路径复杂性
 */

// 导出所有通用类型
export * from './common';

// 导出所有UI组件类型
export * from './ui-types';

// 导出所有功能组件类型
export * from './feature-types';

// 导出所有布局组件类型
export * from './layout-types';

// 导出组件类型（保持向后兼容）
export * from './components';