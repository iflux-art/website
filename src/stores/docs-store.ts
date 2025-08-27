import { create } from "zustand";
import type { DocCategory, DocItem } from "@/features/docs/types";

interface DocsState {
  // 数据状态
  categories: DocCategory[];
  currentDoc: DocItem | null;
  loading: boolean;
  error: string | null;

  // 过滤状态
  selectedCategory: string | null;

  // Actions
  setCategories: (categories: DocCategory[]) => void;
  setCurrentDoc: (doc: DocItem | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  resetDocsState: () => void;
}

export const useDocsStore = create<DocsState>(set => ({
  // 初始状态
  categories: [],
  currentDoc: null,
  loading: false,
  error: null,
  selectedCategory: null,

  // Actions
  setCategories: categories => set({ categories }),
  setCurrentDoc: doc => set({ currentDoc: doc }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setSelectedCategory: category => set({ selectedCategory: category }),
  resetDocsState: () =>
    set({
      categories: [],
      currentDoc: null,
      loading: false,
      error: null,
      selectedCategory: null,
    }),
}));
