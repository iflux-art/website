import { create } from "zustand";
import type { GlobalDocsStructure } from "@/features/docs/components/global-docs";

// 状态接口
export interface DocsGlobalStructureState {
  // 全局文档结构数据
  structure: GlobalDocsStructure | null;

  // 加载状态
  loading: boolean;

  // 错误信息
  error: string | null;

  // 缓存时间戳
  timestamp: number;
}

// 动作接口
export interface DocsGlobalStructureActions {
  setStructure: (structure: GlobalDocsStructure | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTimestamp: (timestamp: number) => void;
  resetState: () => void;
}

// 派生状态接口
export interface DocsGlobalStructureDerivedState {
  // 派生状态通过getter函数实现
  get isCacheValid(): boolean;
  get categories(): GlobalDocsStructure["categories"] | null;
  get allDocs(): Array<{
    id: string;
    title: string;
    path: string;
    category: string;
  }> | null;
}

// 完整的Store接口
export interface DocsGlobalStructureStore
  extends DocsGlobalStructureState,
    DocsGlobalStructureActions,
    DocsGlobalStructureDerivedState {}

// Cache validity period (5 minutes)
const CACHE_VALIDITY_MS = 5 * 60 * 1000;

// 初始状态
export const initialState: DocsGlobalStructureState = {
  structure: null,
  loading: true,
  error: null,
  timestamp: 0,
};

// 创建函数
export const createDocsGlobalStructureStore = () => {
  return create<DocsGlobalStructureStore>()((set, get) => ({
    // ...initialState,
    structure: null,
    loading: true,
    error: null,
    timestamp: 0,

    // Actions
    setStructure: structure => set({ structure }),
    setLoading: loading => set({ loading }),
    setError: error => set({ error }),
    setTimestamp: timestamp => set({ timestamp }),
    resetState: () => set({ ...initialState }),

    // 派生状态通过getter函数实现
    get isCacheValid() {
      const state = get();
      return state.structure !== null && Date.now() - state.timestamp < CACHE_VALIDITY_MS;
    },

    get categories() {
      const structure = get().structure;
      return structure ? structure.categories : null;
    },

    get allDocs() {
      const structure = get().structure;
      if (!structure) return null;

      const docs: Array<{
        id: string;
        title: string;
        path: string;
        category: string;
      }> = [];

      structure.categories.forEach(category => {
        category.docs.forEach(item => {
          // SidebarItem 可能没有 id 属性，使用 title 作为 id
          docs.push({
            id: item.title, // 使用 title 作为 id，因为 SidebarItem 可能没有 id 属性
            title: item.title,
            path: item.href || item.path || "",
            category: category.id,
          });
        });
      });

      return docs;
    },
  }));
};

// 默认导出store实例
export const useDocsGlobalStructureStore = createDocsGlobalStructureStore();

// 检查缓存是否有效（保持向后兼容）
export const isCacheValid = (timestamp: number): boolean => {
  const now = Date.now();
  return now - timestamp < CACHE_VALIDITY_MS;
};
