/**
 * 搜索功能统一导出
 * 集中管理所有搜索相关的功能
 *
 * 注意：为避免客户端导入服务端代码，不再导出search-api.ts
 * 服务端 API 函数请直接从 './lib/search-api' 导入
 */

// 类型导出
export type { SearchResult, SearchOptions, SearchResponse } from "./types";

// 客户端搜索引擎导出
export {
  performSearch,
  getSearchSuggestions,
  highlightSearchTerm,
} from "./lib/search-engine";

// Hooks 导出
export { useSearch } from "./hooks/use-search";
export { useSearchState } from "./hooks/use-search-state";

// 组件导出
export {
  SearchDialog,
  SearchBar,
  SearchResults,
  SearchButton,
} from "./components";
