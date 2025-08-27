import { create } from "zustand";
import type { LinksItem } from "@/features/links/types";

// 管理员页面状态类型
export interface AdminState {
  // 数据状态
  items: LinksItem[];
  loading: boolean;
  error: string | null;

  // 搜索和过滤状态
  searchTerm: string;
  selectedCategory: string;

  // 对话框状态
  showAddDialog: boolean;
  editingItem: LinksItem | null;
  deletingItem: LinksItem | null;

  // 统计数据
  itemCount: number;
}

// 管理员页面状态管理动作
export interface AdminActions {
  // 数据操作
  setItems: (items: LinksItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addItem: (item: LinksItem) => void;
  updateItem: (item: LinksItem) => void;
  deleteItem: (id: string) => void;

  // 搜索和过滤操作
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;

  // 对话框操作
  setShowAddDialog: (show: boolean) => void;
  setEditingItem: (item: LinksItem | null) => void;
  setDeletingItem: (item: LinksItem | null) => void;

  // 统计操作
  updateItemCount: (count: number) => void;

  // 重置操作
  resetAdminState: () => void;
  resetFilters: () => void;
}

export interface AdminStore extends AdminState, AdminActions {}

export const useAdminStore = create<AdminStore>(set => ({
  // 初始状态
  items: [],
  loading: false,
  error: null,
  searchTerm: "",
  selectedCategory: "",
  showAddDialog: false,
  editingItem: null,
  deletingItem: null,
  itemCount: 0,

  // 数据操作
  setItems: items => set({ items, itemCount: items.length }),

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  addItem: item =>
    set(state => ({
      items: [...state.items, item],
      itemCount: state.items.length + 1,
    })),

  updateItem: updatedItem =>
    set(state => ({
      items: state.items.map(item => (item.id === updatedItem.id ? updatedItem : item)),
    })),

  deleteItem: id =>
    set(state => ({
      items: state.items.filter(item => item.id !== id),
      itemCount: state.items.length - 1,
    })),

  // 搜索和过滤操作
  setSearchTerm: term => set({ searchTerm: term }),

  setSelectedCategory: category => set({ selectedCategory: category }),

  // 对话框操作
  setShowAddDialog: show => set({ showAddDialog: show }),

  setEditingItem: item => set({ editingItem: item }),

  setDeletingItem: item => set({ deletingItem: item }),

  // 统计操作
  updateItemCount: count => set({ itemCount: count }),

  // 重置操作
  resetAdminState: () => ({
    items: [],
    loading: false,
    error: null,
    searchTerm: "",
    selectedCategory: "",
    showAddDialog: false,
    editingItem: null,
    deletingItem: null,
    itemCount: 0,
  }),

  resetFilters: () => ({
    searchTerm: "",
    selectedCategory: "",
  }),
}));
