import { create } from "zustand";
import type { GlobalDocsStructure } from "@/features/docs/components/global-docs";

// 全局文档结构状态类型
export interface DocsGlobalStructureState {
  // 全局文档结构数据
  structure: GlobalDocsStructure | null;

  // 加载状态
  loading: boolean;

  // 错误信息
  error: string | null;

  // 缓存时间戳
  timestamp: number;

  // 派生状态：是否缓存有效
  isCacheValid: boolean;
  // 派生状态：结构中的分类列表
  categories: GlobalDocsStructure["categories"] | null;
  // 派生状态：结构中的所有文档项
  allDocs: Array<{ id: string; title: string; path: string; category: string }> | null;
}

// 全局文档结构状态管理动作
export interface DocsGlobalStructureActions {
  setStructure: (structure: GlobalDocsStructure | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTimestamp: (timestamp: number) => void;
  resetDocsGlobalStructureState: () => void;
}

export interface DocsGlobalStructureStore
  extends DocsGlobalStructureState,
    DocsGlobalStructureActions {}

// Cache validity period (5 minutes)
const CACHE_VALIDITY_MS = 5 * 60 * 1000;

export const useDocsGlobalStructureStore = create<DocsGlobalStructureStore>((set, _get) => ({
  // 初始状态
  structure: null,
  loading: true,
  error: null,
  timestamp: 0,
  isCacheValid: false,
  categories: null,
  allDocs: null,

  // Actions
  setStructure: structure => {
    // 计算派生状态
    const isCacheValid = structure !== null && Date.now() - _get().timestamp < CACHE_VALIDITY_MS;

    let categories = null;
    let allDocs: Array<{ id: string; title: string; path: string; category: string }> | null = null;

    if (structure) {
      categories = structure.categories;

      const docs: Array<{ id: string; title: string; path: string; category: string }> = [];
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

      allDocs = docs;
    }

    set({
      structure,
      isCacheValid,
      categories,
      allDocs,
    });
  },
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setTimestamp: timestamp => set({ timestamp }),
  resetDocsGlobalStructureState: () =>
    set({
      structure: null,
      loading: true,
      error: null,
      timestamp: 0,
      isCacheValid: false,
      categories: null,
      allDocs: null,
    }),
}));

// 检查缓存是否有效（保持向后兼容）
export const isCacheValid = (timestamp: number): boolean => {
  const now = Date.now();
  return now - timestamp < CACHE_VALIDITY_MS;
};
