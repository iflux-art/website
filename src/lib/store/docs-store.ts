'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DocCategory, DocSidebarItem } from '@/types/docs';

/**
 * 文档状态接口
 */
interface DocsState {
  // 文档分类
  categories: DocCategory[];
  // 当前分类
  currentCategory: string | null;
  // 当前文档
  currentDoc: string | null;
  // 侧边栏项目
  sidebarItems: DocSidebarItem[];
  // 侧边栏折叠状态
  openCategories: Record<string, boolean>;
  // 加载状态
  loading: boolean;
  // 错误信息
  error: Error | null;
  
  // 操作方法
  setCategories: (categories: DocCategory[]) => void;
  setCurrentCategory: (category: string) => void;
  setCurrentDoc: (doc: string) => void;
  setSidebarItems: (items: DocSidebarItem[]) => void;
  setOpenCategory: (id: string, isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  
  // 复合操作
  fetchCategories: () => Promise<void>;
  fetchSidebarItems: (category: string) => Promise<void>;
}

/**
 * 文档状态存储
 */
export const useDocsStore = create<DocsState>()(
  persist(
    (set, get) => ({
      // 初始状态
      categories: [],
      currentCategory: null,
      currentDoc: null,
      sidebarItems: [],
      openCategories: {},
      loading: false,
      error: null,
      
      // 基本操作
      setCategories: (categories) => set({ categories }),
      setCurrentCategory: (category) => set({ currentCategory: category }),
      setCurrentDoc: (doc) => set({ currentDoc: doc }),
      setSidebarItems: (items) => set({ sidebarItems: items }),
      setOpenCategory: (id, isOpen) => set((state) => ({
        openCategories: { ...state.openCategories, [id]: isOpen }
      })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // 复合操作
      fetchCategories: async () => {
        const { setLoading, setError, setCategories } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch('/api/docs/categories?t=' + Date.now());
          if (!response.ok) {
            throw new Error('Failed to fetch document categories');
          }
          
          const data = await response.json();
          setCategories(data);
        } catch (err) {
          console.error('获取文档分类失败:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
          setLoading(false);
        }
      },
      
      fetchSidebarItems: async (category) => {
        const { setLoading, setError, setSidebarItems, setCurrentCategory } = get();
        
        try {
          setLoading(true);
          setError(null);
          setCurrentCategory(category);
          
          const response = await fetch(`/api/docs/sidebar/${encodeURIComponent(category)}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch sidebar for category: ${category}`);
          }
          
          const data = await response.json();
          setSidebarItems(data);
        } catch (err) {
          console.error(`获取分类 ${category} 的侧边栏结构失败:`, err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'docs-storage',
      partialize: (state) => ({
        openCategories: state.openCategories,
        currentCategory: state.currentCategory,
      }),
    }
  )
);

/**
 * 文档操作钩子
 * 
 * 提供更简洁的API来操作文档状态
 */
export function useDocOperations() {
  const store = useDocsStore();
  
  return {
    // 状态
    categories: store.categories,
    currentCategory: store.currentCategory,
    currentDoc: store.currentDoc,
    sidebarItems: store.sidebarItems,
    openCategories: store.openCategories,
    loading: store.loading,
    error: store.error,
    
    // 操作
    loadCategories: store.fetchCategories,
    loadSidebar: store.fetchSidebarItems,
    setCurrentDoc: store.setCurrentDoc,
    toggleCategory: (id: string) => {
      const isCurrentlyOpen = store.openCategories[id] || false;
      store.setOpenCategory(id, !isCurrentlyOpen);
    },
    
    // 辅助方法
    isActive: (href: string, doc: string | null) => {
      if (!href) return false;
      
      // 直接比较路径
      if (window.location.pathname === href) return true;
      
      // 如果有当前文档，尝试匹配
      if (doc) {
        const hrefSegments = href.split('/').filter(Boolean);
        const lastSegment = hrefSegments[hrefSegments.length - 1];
        return lastSegment === doc;
      }
      
      return false;
    }
  };
}
