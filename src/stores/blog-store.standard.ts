import { create } from "zustand";
import type { BlogPost } from "@/features/blog/types";

// 状态接口
export interface BlogState {
  // 数据状态
  posts: BlogPost[];
  loading: boolean;
  error: string | null;

  // 过滤状态
  selectedCategory: string | null;
  selectedTag: string | null;

  // 统计数据
  categoriesCount: Record<string, number>;
  tagsCount: Record<string, number>;
}

// 动作接口
export interface BlogActions {
  setPosts: (posts: BlogPost[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
  setCategoriesCount: (count: Record<string, number>) => void;
  setTagsCount: (count: Record<string, number>) => void;
  resetFilters: () => void;
  resetState: () => void;
}

// 派生状态接口 (空类型)
export type BlogDerivedState = Record<never, never>;

// 完整的Store接口
export interface BlogStore extends BlogState, BlogActions {}

// 初始状态
export const initialState: BlogState = {
  posts: [],
  loading: false,
  error: null,
  selectedCategory: null,
  selectedTag: null,
  categoriesCount: {},
  tagsCount: {},
};

// 创建函数
export const createBlogStore = () => {
  return create<BlogStore>()((set, _get) => ({
    // ...initialState,
    posts: [],
    loading: false,
    error: null,
    selectedCategory: null,
    selectedTag: null,
    categoriesCount: {},
    tagsCount: {},

    // Actions
    setPosts: posts => set({ posts }),
    setLoading: loading => set({ loading }),
    setError: error => set({ error }),
    setSelectedCategory: category => set({ selectedCategory: category }),
    setSelectedTag: tag => set({ selectedTag: tag }),
    setCategoriesCount: count => set({ categoriesCount: count }),
    setTagsCount: count => set({ tagsCount: count }),
    resetFilters: () => set({ selectedCategory: null, selectedTag: null }),
    resetState: () => set({ ...initialState }),
  }));
};

// 默认导出store实例
export const useBlogStore = createBlogStore();
