import { create } from "zustand";
import type { LinksItem } from "@/features/links/types";

// 状态接口
export interface LinkFilterState {
  // 过滤状态
  selectedCategory: string;
  selectedTag: string;

  // 过滤后的数据
  filteredItems: LinksItem[];

  // 可用标签
  availableTags: string[];
}

// 动作接口
export interface LinkFilterActions {
  setSelectedCategory: (category: string) => void;
  setSelectedTag: (tag: string) => void;
  setFilteredItems: (items: LinksItem[]) => void;
  setAvailableTags: (tags: string[]) => void;
  resetFilters: () => void;
  resetState: () => void;
}

// 派生状态接口 (已移除)
// export type LinkFilterDerivedState = Record<string, never>;

// 完整的Store接口
export interface LinkFilterStore extends LinkFilterState, LinkFilterActions {}

// 初始状态
export const initialState: LinkFilterState = {
  selectedCategory: "",
  selectedTag: "",
  filteredItems: [],
  availableTags: [],
};

// 创建函数
export const createLinkFilterStore = () => {
  return create<LinkFilterStore>()((set, _get) => ({
    // 使用展开运算符确保初始状态正确
    ...initialState,

    // Actions
    setSelectedCategory: category => set({ selectedCategory: category }),
    setSelectedTag: tag => set({ selectedTag: tag }),
    setFilteredItems: items => set({ filteredItems: items }),
    setAvailableTags: tags => set({ availableTags: tags }),
    resetFilters: () => set({ selectedCategory: "", selectedTag: "", filteredItems: [] }),
    resetState: () => set({ ...initialState }),
  }));
};

// 默认导出store实例
export const useLinkFilterStore = createLinkFilterStore();
