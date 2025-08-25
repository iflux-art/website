/**
 * 全局共享组件统一导出
 * 集中管理所有通用共享组件，便于引用和维护
 * 业务相关组件已移动到对应的 features 目录中
 */

// ==================== MDX 组件 ====================
export * from './mdx';

// ==================== 主题提供者 ====================
export * from './theme/theme-provider';

// ==================== 全局功能组件 ====================
export * from './global-context-menu';

// ==================== 业务按钮组件 ====================
export * from './button';

// ==================== UI 组件库 ====================
export * from './ui/alert';
export * from './ui/alert-dialog';
export * from './ui/avatar';
export * from './ui/back-button';
export * from './ui/badge';
export * from './ui/button';
export * from './ui/card';
export * from './ui/collapsible';
export * from './ui/context-menu';
export * from './ui/dialog';
export * from './ui/dropdown-menu';
export * from './ui/input';
export * from './ui/label';
export * from './ui/select';
export * from './ui/separator';
export * from './ui/sheet';
export * from './ui/switch';
export * from './ui/textarea';
