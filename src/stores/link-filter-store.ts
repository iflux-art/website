import { create } from "zustand";
import type { LinksItem } from "@/features/links/types";

interface LinkFilterState {
  // 过滤状态
  selectedCategory: string;
  selectedTag: string;

  // 过滤后的数据
  filteredItems: LinksItem[];

  // 可用标签
  availableTags: string[];

  // Actions
  setSelectedCategory: (category: string) => void;
  setSelectedTag: (tag: string) => void;
  setFilteredItems: (items: LinksItem[]) => void;
  setAvailableTags: (tags: string[]) => void;
  resetFilters: () => void;
}

export const useLinkFilterStore = create<LinkFilterState>(set => ({
  selectedCategory: "",
  selectedTag: "",
  filteredItems: [],
  availableTags: [],

  setSelectedCategory: category => set({ selectedCategory: category, selectedTag: "" }),
  setSelectedTag: tag => set({ selectedTag: tag }),
  setFilteredItems: items => set({ filteredItems: items }),
  setAvailableTags: tags => set({ availableTags: tags }),
  resetFilters: () => set({ selectedCategory: "", selectedTag: "" }),
}));
