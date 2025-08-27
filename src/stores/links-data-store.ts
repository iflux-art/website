import { create } from "zustand";
import type { LinksItem } from "@/features/links/types";

// 链接数据状态类型
export interface LinksDataState {
  // 所有链接数据
  items: LinksItem[];

  // 加载状态
  loading: boolean;

  // 错误信息
  error: string | null;

  // 派生状态：过滤后的链接（排除friends和profile分类）
  filteredItems: LinksItem[];
  // 派生状态：分类统计
  categoriesCount: Record<string, number>;
  // 派生状态：标签统计
  tagsCount: Record<string, number>;
}

// 链接数据状态管理动作
export interface LinksDataActions {
  setItems: (items: LinksItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetLinksDataState: () => void;
}

export interface LinksDataStore extends LinksDataState, LinksDataActions {}

export const useLinksDataStore = create<LinksDataStore>((set, _get) => ({
  // 初始状态
  items: [],
  loading: true,
  error: null,
  filteredItems: [],
  categoriesCount: {},
  tagsCount: {},

  // Actions
  setItems: items => {
    // 计算派生状态
    const filteredItems = items.filter(
      item => item.category !== "friends" && item.category !== "profile"
    );

    // 分类统计
    const categoriesCount: Record<string, number> = {};
    items.forEach(item => {
      if (item.category) {
        categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1;
      }
    });

    // 标签统计
    const tagsCount: Record<string, number> = {};
    items.forEach(item => {
      item.tags?.forEach(tag => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1;
      });
    });

    set({
      items,
      filteredItems,
      categoriesCount,
      tagsCount,
    });
  },
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  resetLinksDataState: () =>
    set({
      items: [],
      loading: true,
      error: null,
      filteredItems: [],
      categoriesCount: {},
      tagsCount: {},
    }),
}));
