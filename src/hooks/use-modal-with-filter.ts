"use client";

import { useCallback, useEffect } from "react";
import { useModal } from "./use-modal";
import { useArticleFilter } from "./use-article-filter";
import type { BlogPost } from "@/features/blog/types";

interface UseModalWithFilterReturn {
  // Modal state
  modalState: ReturnType<typeof useModal>["modalState"];
  closeModal: () => void;
  clearError: () => void;

  // Filter actions
  openCategoryModal: (category: string, allPosts: BlogPost[]) => void;
  openTagModal: (tag: string, allPosts: BlogPost[]) => void;

  // Filter state
  isFiltering: boolean;
  cacheStats: {
    size: number;
    hitRate: number;
  };
  clearFilterCache: () => void;
}

/**
 * 结合模态对话框和文章筛选的复合 Hook
 *
 * 功能特性：
 * - 集成模态对话框状态管理和文章筛选功能
 * - 自动处理筛选过程中的加载状态
 * - 统一的错误处理机制
 * - 智能缓存管理
 * - 动态标题更新
 */
export function useModalWithFilter(): UseModalWithFilterReturn {
  const {
    modalState,
    openCategoryModal: openCategoryModalBase,
    openTagModal: openTagModalBase,
    closeModal,
    setLoading,
    setError,
    clearError,
    updatePosts,
  } = useModal();

  const {
    filterByCategory,
    filterByTag,
    clearCache: clearFilterCache,
    isFiltering,
    cacheStats,
  } = useArticleFilter();

  // 处理分类模态对话框打开
  const openCategoryModal = useCallback(
    (category: string, allPosts: BlogPost[]) => {
      try {
        // 立即打开模态对话框，显示加载状态
        openCategoryModalBase(category, []);
        setLoading(true);

        // 执行筛选
        const filterResult = filterByCategory(allPosts, category);

        if (filterResult.error) {
          setError(
            `加载${category}分类文章失败: ${filterResult.error.message}`,
          );
          return;
        }

        // 更新文章列表
        updatePosts(filterResult.posts);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "未知错误";
        setError(`打开${category}分类失败: ${errorMessage}`);
      }
    },
    [
      openCategoryModalBase,
      setLoading,
      setError,
      updatePosts,
      filterByCategory,
    ],
  );

  // 处理标签模态对话框打开
  const openTagModal = useCallback(
    (tag: string, allPosts: BlogPost[]) => {
      try {
        // 立即打开模态对话框，显示加载状态
        openTagModalBase(tag, []);
        setLoading(true);

        // 执行筛选
        const filterResult = filterByTag(allPosts, tag);

        if (filterResult.error) {
          setError(`加载${tag}标签文章失败: ${filterResult.error.message}`);
          return;
        }

        // 更新文章列表
        updatePosts(filterResult.posts);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "未知错误";
        setError(`打开${tag}标签失败: ${errorMessage}`);
      }
    },
    [openTagModalBase, setLoading, setError, updatePosts, filterByTag],
  );

  // 监听筛选状态变化，同步到模态对话框
  useEffect(() => {
    if (!isFiltering && modalState.isLoading) {
      setLoading(false);
    }
  }, [isFiltering, modalState.isLoading, setLoading]);

  return {
    modalState,
    closeModal,
    clearError,
    openCategoryModal,
    openTagModal,
    isFiltering,
    cacheStats,
    clearFilterCache,
  };
}
