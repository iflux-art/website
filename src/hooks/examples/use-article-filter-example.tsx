/**
 * useArticleFilter Hook 使用示例
 */

import React from "react";
import { useArticleFilter } from "../use-article-filter";
import type { BlogPost } from "@/features/blog/types";

// 示例文章数据
const samplePosts: BlogPost[] = [
  {
    slug: "react-tutorial",
    title: "React 入门教程",
    description: "React 基础知识介绍",
    excerpt: "React 基础知识介绍",
    date: "2024-01-15",
    category: "技术",
    tags: ["React", "JavaScript", "前端"],
    views: 100,
  },
  {
    slug: "vue-features",
    title: "Vue 3 新特性",
    description: "Vue 3 的新功能详解",
    excerpt: "Vue 3 的新功能详解",
    date: "2024-01-10",
    category: "技术",
    tags: ["Vue", "JavaScript", "前端"],
    views: 80,
  },
  {
    slug: "life-essay",
    title: "生活随笔",
    description: "日常生活感悟",
    excerpt: "日常生活感悟",
    date: "2024-01-05",
    category: "生活",
    tags: ["随笔", "生活"],
    views: 50,
  },
];

export function ArticleFilterExample() {
  const {
    filterByCategory,
    filterByTag,
    filterByMultipleTags,
    clearCache,
    isFiltering,
    cacheStats,
  } = useArticleFilter();

  // 按分类筛选示例
  const handleFilterByCategory = () => {
    const result = filterByCategory(samplePosts, "技术");
    console.log("按分类筛选结果:", result);
  };

  // 按标签筛选示例
  const handleFilterByTag = () => {
    const result = filterByTag(samplePosts, "JavaScript");
    console.log("按标签筛选结果:", result);
  };

  // 按多个标签筛选示例
  const handleFilterByMultipleTags = () => {
    const result = filterByMultipleTags(samplePosts, ["JavaScript", "前端"]);
    console.log("按多个标签筛选结果:", result);
  };

  // 带排序选项的筛选示例
  const handleFilterWithOptions = () => {
    const result = filterByCategory(samplePosts, "技术", {
      sortBy: "views",
      sortOrder: "desc",
      limit: 2,
    });
    console.log("带选项的筛选结果:", result);
  };

  // 清除缓存示例
  const handleClearCache = () => {
    clearCache();
    console.log("缓存已清除");
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        useArticleFilter Hook 使用示例
      </h1>

      {/* 控制按钮 */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <button
          onClick={handleFilterByCategory}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={isFiltering}
        >
          按分类筛选
        </button>

        <button
          onClick={handleFilterByTag}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          disabled={isFiltering}
        >
          按标签筛选
        </button>

        <button
          onClick={handleFilterByMultipleTags}
          className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
          disabled={isFiltering}
        >
          按多个标签筛选
        </button>

        <button
          onClick={handleFilterWithOptions}
          className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          disabled={isFiltering}
        >
          带选项筛选
        </button>

        <button
          onClick={handleClearCache}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          清除缓存
        </button>
      </div>

      {/* 状态显示 */}
      <div className="mb-6 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 text-lg font-semibold">状态信息</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <span className="font-medium">筛选状态:</span>
            <span
              className={`ml-2 ${isFiltering ? "text-orange-600" : "text-green-600"}`}
            >
              {isFiltering ? "筛选中..." : "空闲"}
            </span>
          </div>
          <div>
            <span className="font-medium">缓存大小:</span>
            <span className="ml-2 text-blue-600">{cacheStats.size}</span>
          </div>
          <div>
            <span className="font-medium">缓存命中率:</span>
            <span className="ml-2 text-purple-600">
              {(cacheStats.hitRate * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* 示例文章列表 */}
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">示例文章列表</h2>
        <div className="space-y-3">
          {samplePosts.map((post) => (
            <div key={post.slug} className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.description}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span>分类: {post.category}</span>
                <span>标签: {post.tags?.join(", ")}</span>
                <span>浏览: {post.views}</span>
                <span>
                  日期:{" "}
                  {typeof post.date === "string"
                    ? post.date
                    : post.date?.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h2 className="mb-2 text-lg font-semibold">使用说明</h2>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>点击不同的筛选按钮查看控制台输出</li>
          <li>多次点击相同筛选会使用缓存，提高性能</li>
          <li>支持按分类、单个标签、多个标签筛选</li>
          <li>支持排序（按日期、标题、浏览量）和分页</li>
          <li>提供缓存统计信息和清除功能</li>
        </ul>
      </div>
    </div>
  );
}
