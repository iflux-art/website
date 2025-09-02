import { create } from "zustand";
import type { DocCategory, DocItem } from "@/features/docs/types";

// 状态接口
export interface DocsState {
  // 数据状态
  categories: DocCategory[];
  currentDoc: DocItem | null;
  loading: boolean;
  error: string | null;

  // 过滤状态
  selectedCategory: string | null;
}

// 动作接口
export interface DocsActions {
  setCategories: (categories: DocCategory[]) => void;
  setCurrentDoc: (doc: DocItem | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  resetState: () => void;
}

// 派生状态接口 (空类型)
export type DocsDerivedState = Record<never, never>;

// 完整的Store接口
export interface DocsStore extends DocsState, DocsActions {}

// 初始状态
export const initialState: DocsState = {
  categories: [],
  currentDoc: null,
  loading: false,
  error: null,
  selectedCategory: null,
};

// 创建函数
export const createDocsStore = () => {
  return create<DocsStore>()((set, _get) => ({
    // ...initialState,
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
    resetState: () => set({ ...initialState }),
  }));
};

// 默认导出store实例
export const useDocsStore = createDocsStore();
