import { create } from "zustand";

// 状态接口
export interface SearchState {
  // 搜索状态
  searchTerm: string;
  selectedCategory: string;
}

// 动作接口
export interface SearchActions {
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  resetState: () => void;
}

// 派生状态接口 (空类型)
export type SearchDerivedState = Record<never, never>;

// 完整的Store接口
export interface SearchStore extends SearchState, SearchActions {}

// 初始状态
export const initialState: SearchState = {
  searchTerm: "",
  selectedCategory: "",
};

// 创建函数
export const createSearchStore = () => {
  return create<SearchStore>()((set, _get) => ({
    // ...initialState,
    searchTerm: "",
    selectedCategory: "",

    // Actions
    setSearchTerm: searchTerm => set({ searchTerm }),
    setSelectedCategory: category => set({ selectedCategory: category }),
    resetState: () => set({ ...initialState }),
  }));
};

// 默认导出store实例
export const useSearchStore = createSearchStore();
