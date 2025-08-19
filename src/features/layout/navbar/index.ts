/**
 * Navbar 子模块统一导出
 */

// 组件导出
export * from './components';

// 类型导出
export * from './types';

// Hooks 导出
export * from './hooks/use-active-section';
export * from './hooks/use-navbar-scroll';

// 配置导出
export * from './nav-config';

// 解决 BaseNavItem 类型冲突，优先使用 types 中的定义
