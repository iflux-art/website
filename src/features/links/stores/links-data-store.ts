import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LinksItem } from "@/features/links/types";

// 链接数据状态类型
export interface LinksDataState {
  // 所有链接数据
  items: LinksItem[];

  // 加载状态
  loading: boolean;

  // 错误信息
  error: string | null;

  // 数据版本信息
  version: string;

  // 最后更新时间
  lastUpdated: number;

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
  updateItem: (updatedItem: LinksItem) => void;
  updateItems: (updatedItems: LinksItem[]) => void;
  updateVersion: (version: string) => void;
  resetLinksDataState: () => void;
  // 选择性更新方法
  updateCategoriesCount: (categoriesCount: Record<string, number>) => void;
  updateTagsCount: (tagsCount: Record<string, number>) => void;
  updateFilteredItems: (filteredItems: LinksItem[]) => void;
}

export interface LinksDataStore extends LinksDataState, LinksDataActions {}

// 计算派生状态的辅助函数
const computeFilteredItems = (items: LinksItem[]): LinksItem[] => {
  return items.filter(item => item.category !== "friends" && item.category !== "profile");
};

const computeCategoriesCount = (items: LinksItem[]): Record<string, number> => {
  const categoriesCount: Record<string, number> = {};
  items.forEach(item => {
    if (item.category) {
      categoriesCount[item.category] = (categoriesCount[item.category] || 0) + 1;
    }
  });
  return categoriesCount;
};

const computeTagsCount = (items: LinksItem[]): Record<string, number> => {
  const tagsCount: Record<string, number> = {};
  items.forEach(item => {
    item.tags?.forEach(tag => {
      tagsCount[tag] = (tagsCount[tag] || 0) + 1;
    });
  });
  return tagsCount;
};

export const useLinksDataStore = create<LinksDataStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      items: [],
      loading: true,
      error: null,
      version: "0",
      lastUpdated: 0,
      filteredItems: [],
      categoriesCount: {},
      tagsCount: {},

      // Actions
      setItems: items => {
        // 计算派生状态
        const filteredItems = computeFilteredItems(items);
        const categoriesCount = computeCategoriesCount(items);
        const tagsCount = computeTagsCount(items);

        set({
          items,
          filteredItems,
          categoriesCount,
          tagsCount,
          lastUpdated: Date.now(),
        });
      },

      setLoading: loading => set({ loading }),

      setError: error => set({ error }),

      updateItem: updatedItem => {
        const currentItems = [...get().items];
        const index = currentItems.findIndex(item => item.id === updatedItem.id);

        if (index !== -1) {
          // 更新现有项
          currentItems[index] = { ...currentItems[index], ...updatedItem };
          get().setItems(currentItems);
        } else {
          // 添加新项
          get().setItems([...currentItems, updatedItem]);
        }
      },

      updateItems: updatedItems => {
        if (!updatedItems.length) return;

        const currentItems = [...get().items];
        let hasChanges = false;

        // 更新或添加项
        updatedItems.forEach(updatedItem => {
          const index = currentItems.findIndex(item => item.id === updatedItem.id);

          if (index !== -1) {
            // 更新现有项
            currentItems[index] = { ...currentItems[index], ...updatedItem };
            hasChanges = true;
          } else {
            // 添加新项
            currentItems.push(updatedItem);
            hasChanges = true;
          }
        });

        // 只有在有变更时才更新状态
        if (hasChanges) {
          get().setItems(currentItems);
        }
      },

      updateVersion: version => {
        set({ version, lastUpdated: Date.now() });
      },

      resetLinksDataState: () =>
        set({
          items: [],
          loading: true,
          error: null,
          version: "0",
          lastUpdated: 0,
          filteredItems: [],
          categoriesCount: {},
          tagsCount: {},
        }),

      // 选择性更新方法，避免不必要的重渲染
      updateCategoriesCount: categoriesCount => set({ categoriesCount }),
      updateTagsCount: tagsCount => set({ tagsCount }),
      updateFilteredItems: filteredItems => set({ filteredItems }),
    }),
    {
      name: "links-data-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        items: state.items,
        version: state.version,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
