"use client";

import React from "react";
import { useModalWithFilter, useModalErrorHandler } from "../index";
import type { BlogPost } from "@/features/blog/types";

// Mock data for demonstration
const mockPosts: BlogPost[] = [
  {
    slug: "react-hooks-guide",
    title: "React Hooks 完全指南",
    description: "深入理解 React Hooks 的使用方法和最佳实践",
    excerpt: "深入理解 React Hooks 的使用方法和最佳实践",
    category: "技术",
    tags: ["React", "JavaScript", "Frontend"],
    date: "2024-01-15",
  },
  {
    slug: "typescript-tips",
    title: "TypeScript 实用技巧",
    description: "提高 TypeScript 开发效率的实用技巧分享",
    excerpt: "提高 TypeScript 开发效率的实用技巧分享",
    category: "技术",
    tags: ["TypeScript", "JavaScript"],
    date: "2024-01-10",
  },
  {
    slug: "life-thoughts",
    title: "生活随想",
    description: "关于生活的一些思考和感悟",
    excerpt: "关于生活的一些思考和感悟",
    category: "生活",
    tags: ["生活", "思考"],
    date: "2024-01-05",
  },
];

/**
 * 模态对话框状态管理示例组件
 *
 * 演示如何使用 useModalWithFilter 和 useModalErrorHandler
 * 来管理博客分类和标签的模态对话框交互
 */
export function ModalStateExample() {
  const {
    modalState,
    closeModal,
    clearError,
    openCategoryModal,
    openTagModal,
    isFiltering,
    cacheStats,
    clearFilterCache,
  } = useModalWithFilter();

  const { createError, getErrorMessage, getRetryMessage, isRetryable } =
    useModalErrorHandler();

  // 模拟网络错误的处理
  const handleNetworkError = () => {
    const error = createError("network", "连接超时");
    console.log("Error created:", error);
    console.log("Error message:", getErrorMessage(error));
    console.log("Retry message:", getRetryMessage(error));
    console.log("Is retryable:", isRetryable(error));
  };

  // 处理分类点击
  const handleCategoryClick = (category: string) => {
    openCategoryModal(category, mockPosts);
  };

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    openTagModal(tag, mockPosts);
  };

  // 获取所有分类
  const categories = Array.from(
    new Set(mockPosts.map((post) => post.category).filter(Boolean)),
  ) as string[];

  // 获取所有标签
  const allTags = mockPosts.flatMap((post) => post.tags || []);
  const uniqueTags = Array.from(new Set(allTags));

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">模态对话框状态管理示例</h1>

      {/* 缓存统计信息 */}
      <div className="mb-6 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">缓存统计</h2>
        <p>缓存大小: {cacheStats.size}</p>
        <p>命中率: {(cacheStats.hitRate * 100).toFixed(1)}%</p>
        <p>筛选状态: {isFiltering ? "筛选中..." : "空闲"}</p>
        <button
          onClick={clearFilterCache}
          className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
        >
          清除缓存
        </button>
      </div>

      {/* 分类按钮 */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">分类</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              {category} (
              {mockPosts.filter((post) => post.category === category).length})
            </button>
          ))}
        </div>
      </div>

      {/* 标签按钮 */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">标签</h2>
        <div className="flex flex-wrap gap-2">
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="rounded bg-green-500 px-3 py-1 text-white transition-colors hover:bg-green-600"
            >
              {tag} ({allTags.filter((t) => t === tag).length})
            </button>
          ))}
        </div>
      </div>

      {/* 错误处理示例 */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">错误处理示例</h2>
        <button
          onClick={handleNetworkError}
          className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          模拟网络错误 (查看控制台)
        </button>
      </div>

      {/* 模态对话框状态显示 */}
      {modalState.isOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">{modalState.title}</h3>
              <button
                onClick={closeModal}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {modalState.isLoading && (
              <div className="py-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                <p className="mt-2">加载中...</p>
              </div>
            )}

            {modalState.error && (
              <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                <p>{modalState.error}</p>
                <button
                  onClick={clearError}
                  className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  清除错误
                </button>
              </div>
            )}

            {!modalState.isLoading && !modalState.error && (
              <div>
                {modalState.posts.length === 0 ? (
                  <p className="py-8 text-center text-gray-500">
                    {modalState.filterType === "category"
                      ? "该分类暂无文章"
                      : "该标签暂无文章"}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {modalState.posts.map((post) => (
                      <div key={post.slug} className="rounded-lg border p-4">
                        <h4 className="mb-2 font-semibold">{post.title}</h4>
                        <p className="mb-2 text-sm text-gray-600">
                          {post.description}
                        </p>
                        <div className="mb-2 flex flex-wrap gap-1">
                          {post.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          {post.category} •{" "}
                          {typeof post.date === "string"
                            ? post.date
                            : post.date?.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 调试信息 */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-500">
                调试信息
              </summary>
              <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                {JSON.stringify(modalState, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
