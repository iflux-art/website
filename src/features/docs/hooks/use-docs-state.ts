"use client";

import type { DocCategory, DocItem } from "@/features/docs/types";
import { useCallback } from "react";
import { useDocsStore } from "@/stores";
// 导入新的异步操作工具
import { executeAsyncOperation } from "@/utils/async";

export interface UseDocsStateReturn {
  // 数据状态
  categories: DocCategory[];
  currentDoc: DocItem | null;
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;

  // Actions (来自 Zustand)
  setCategories: (categories: DocCategory[]) => void;
  setCurrentDoc: (doc: DocItem | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  resetState: () => void;

  // 自定义方法
  loadCategories: () => void;
  loadDocContent: (path: string) => void;
  selectCategory: (category: string | null) => void;
}

/**
 * Docs状态管理Hook (使用 Zustand)
 * 封装了文档模块的所有状态管理和数据处理逻辑
 */
export function useDocsState(): UseDocsStateReturn {
  // 从 Zustand store 获取状态和 actions
  const {
    categories,
    currentDoc,
    loading,
    error,
    selectedCategory,
    setCategories,
    setCurrentDoc,
    setLoading,
    setError,
    setSelectedCategory,
    resetState,
  } = useDocsStore();

  // 加载文档分类
  const loadCategories = useCallback(() => {
    const operation = () => {
      // 这里应该调用实际的 API 或数据获取函数
      // 暂时使用模拟数据
      const mockCategories: DocCategory[] = [
        {
          id: "getting-started",
          name: "getting-started",
          title: "Getting Started",
          slug: "getting-started",
          description: "入门指南",
          count: 5,
        },
        {
          id: "api",
          name: "api",
          title: "API",
          slug: "api",
          description: "API 文档",
          count: 12,
        },
      ];

      return Promise.resolve(mockCategories);
    };

    void executeAsyncOperation(operation, {
      setLoading,
      setError,
      onSuccess: mockCategories => {
        // 更新 Zustand 状态
        setCategories(mockCategories);
      },
      onError: () => {
        setCategories([]);
      },
      contentType: "docs",
    });
  }, [setCategories, setLoading, setError]);

  // 加载文档内容
  const loadDocContent = useCallback(
    (path: string) => {
      const operation = () => {
        // 这里应该调用实际的 API 或数据获取函数
        // 暂时使用模拟数据
        const mockDoc = {
          title: "文档标题",
          content: "# 文档标题\n\n这是文档内容。\n\n## 子标题\n\n更多内容...",
          frontmatter: {
            title: "文档标题",
            description: "文档描述",
          },
          headings: [],
        };

        return Promise.resolve(mockDoc);
      };

      void executeAsyncOperation(operation, {
        setLoading,
        setError,
        onSuccess: mockDoc => {
          // 更新当前文档状态
          setCurrentDoc({
            title: mockDoc.title,
            content: mockDoc.content,
            frontmatter: mockDoc.frontmatter,
            headings: mockDoc.headings,
          });
        },
        onError: () => {
          setCurrentDoc(null);
        },
        contentType: "docs",
        contentId: path,
      });
    },
    [setCurrentDoc, setLoading, setError]
  );

  // 选择分类
  const selectCategory = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
    },
    [setSelectedCategory]
  );

  return {
    // 数据状态
    categories,
    currentDoc,
    loading,
    error,
    selectedCategory,

    // Actions
    setCategories,
    setCurrentDoc,
    setLoading,
    setError,
    setSelectedCategory,
    resetState,

    // 自定义方法
    loadCategories,
    loadDocContent,
    selectCategory,
  };
}
