import { create } from "zustand";
import type { BlogPost } from "@/features/blog/types";

interface BlogState {
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

  // Actions
  setPosts: (posts: BlogPost[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
  setCategoriesCount: (count: Record<string, number>) => void;
  setTagsCount: (count: Record<string, number>) => void;
  resetFilters: () => void;
  resetBlogState: () => void;
}

export const useBlogStore = create<BlogState>(set => ({
  // 初始状态
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
  resetBlogState: () =>
    set({
      posts: [],
      loading: false,
      error: null,
      selectedCategory: null,
      selectedTag: null,
      categoriesCount: {},
      tagsCount: {},
    }),
}));
