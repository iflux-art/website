/**
 * search 组件
 * 提供站内搜索功能
 *
 * 统一导出搜索相关组件
 */

// 导出统一的搜索组件
export { SearchButton, SearchCommandDialog, CleanSearchDialog } from './search-unified';

// 导出类型
export type { SearchButtonProps, SearchDialogProps } from './search-unified';

// 导出旧版搜索组件（保持向后兼容）
export {
  SearchButton as SearchButtonLegacy,
  SearchDialog as SearchDialogLegacy,
} from './search-dialog';
