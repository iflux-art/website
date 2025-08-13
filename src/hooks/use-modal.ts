"use client";

import { useState, useCallback } from "react";
import type { BlogPost } from "@/features/blog/types";

interface ModalState {
  isOpen: boolean;
  title: string;
  posts: BlogPost[];
  isLoading: boolean;
  error?: string;
  selectedCategory?: string;
  selectedTag?: string;
  filterType?: "category" | "tag";
}

interface UseModalReturn {
  modalState: ModalState;
  openModal: (title: string, posts: BlogPost[]) => void;
  openCategoryModal: (category: string, posts: BlogPost[]) => void;
  openTagModal: (tag: string, posts: BlogPost[]) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
  updatePosts: (posts: BlogPost[]) => void;
}

/**
 * 模态对话框状态管理 Hook
 *
 * 功能特性：
 * - 管理模态对话框的打开/关闭状态
 * - 管理当前选中的分类或标签信息
 * - 处理模态对话框标题的动态更新
 * - 实现错误状态的处理和显示
 * - 支持分类和标签的专门处理方法
 */
export function useModal(): UseModalReturn {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    posts: [],
    isLoading: false,
    error: undefined,
    selectedCategory: undefined,
    selectedTag: undefined,
    filterType: undefined,
  });

  const openModal = useCallback((title: string, posts: BlogPost[]) => {
    setModalState({
      isOpen: true,
      title,
      posts,
      isLoading: false,
      error: undefined,
      selectedCategory: undefined,
      selectedTag: undefined,
      filterType: undefined,
    });
  }, []);

  const openCategoryModal = useCallback(
    (category: string, posts: BlogPost[]) => {
      const title = `${category}分类文章 (${posts.length}篇)`;
      setModalState({
        isOpen: true,
        title,
        posts,
        isLoading: false,
        error: undefined,
        selectedCategory: category,
        selectedTag: undefined,
        filterType: "category",
      });
    },
    [],
  );

  const openTagModal = useCallback((tag: string, posts: BlogPost[]) => {
    const title = `${tag}标签文章 (${posts.length}篇)`;
    setModalState({
      isOpen: true,
      title,
      posts,
      isLoading: false,
      error: undefined,
      selectedCategory: undefined,
      selectedTag: tag,
      filterType: "tag",
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      // 保留选中的分类/标签信息，以便重新打开时使用
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setModalState((prev) => ({
      ...prev,
      isLoading: loading,
      // 开始加载时清除之前的错误
      error: loading ? undefined : prev.error,
    }));
  }, []);

  const setError = useCallback((error?: string) => {
    setModalState((prev) => ({
      ...prev,
      isLoading: false,
      error,
    }));
  }, []);

  const clearError = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      error: undefined,
    }));
  }, []);

  const updatePosts = useCallback((posts: BlogPost[]) => {
    setModalState((prev) => {
      // 根据当前的筛选类型更新标题
      let newTitle = prev.title;
      if (prev.filterType === "category" && prev.selectedCategory) {
        newTitle = `${prev.selectedCategory}分类文章 (${posts.length}篇)`;
      } else if (prev.filterType === "tag" && prev.selectedTag) {
        newTitle = `${prev.selectedTag}标签文章 (${posts.length}篇)`;
      }

      return {
        ...prev,
        posts,
        title: newTitle,
        isLoading: false,
        error: undefined,
      };
    });
  }, []);

  return {
    modalState,
    openModal,
    openCategoryModal,
    openTagModal,
    closeModal,
    setLoading,
    setError,
    clearError,
    updatePosts,
  };
}
