import { create } from "zustand";
import type { LinksItem } from "@/features/links/types";

// 状态接口
export interface LinksDataState {
  // 所有链接数据
  items: LinksItem[];

  // 加载状态
  loading: boolean;

  // 错误信息
  error: string | null;
}

// 动作接口
export interface LinksDataActions {
  setItems: (items: LinksItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

// 完整的Store接口
export interface LinksDataStore extends LinksDataState, LinksDataActions {}

// 初始状态
export const initialState: LinksDataState = {
  items: [],
  loading: true,
  error: null,
};

// 创建函数
export const createLinksDataStore = () => {
  return create<LinksDataStore>()((set, _get) => ({
    // 使用展开运算符确保初始状态正确
    ...initialState,

    // Actions
    setItems: items => set({ items }),
    setLoading: loading => set({ loading }),
    setError: error => set({ error }),
    resetState: () => set({ ...initialState }),
  }));
};

// 默认导出store实例
export const useLinksDataStore = createLinksDataStore();
