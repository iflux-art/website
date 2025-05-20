/**
 * search 组件
 * 提供站内搜索功能
 */

// 导出旧版搜索组件（保持向后兼容）
export { SearchButton as SearchButtonLegacy, SearchDialog as SearchDialogLegacy } from './search-dialog';

// 导出新版搜索组件
export { SearchButton, SearchCommandDialog } from './search-command';

// 导出类型
export type { SearchButtonProps, SearchDialogProps } from '@/types/search';