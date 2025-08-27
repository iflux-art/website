import { create } from "zustand";

interface SearchState {
  // 搜索状态
  searchTerm: string;
  selectedCategory: string;

  // Actions
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  resetSearch: () => void;
}

export const useSearchStore = create<SearchState>(set => ({
  searchTerm: "",
  selectedCategory: "",

  setSearchTerm: term => set({ searchTerm: term }),
  setSelectedCategory: category => set({ selectedCategory: category }),
  resetSearch: () => set({ searchTerm: "", selectedCategory: "" }),
}));
