"use client";

import React, { useState } from "react";
import { ArticleGrid } from "../article-grid";
import { EmptyState } from "../empty-state";
import { LoadingState } from "../loading-state";
import type { BlogPost } from "@/features/blog/types";

// Mock data for demonstration
const mockPosts: BlogPost[] = [
  {
    slug: "react-hooks-guide",
    title: "React Hooks 完全指南",
    description: "深入理解 React Hooks 的工作原理和最佳实践",
    excerpt:
      "深入理解 React Hooks 的工作原理和最佳实践，包括 useState、useEffect 等核心 Hook 的使用方法。",
    date: "2024-01-15",
    tags: ["React", "JavaScript", "前端"],
    category: "技术",
    image: "/images/react-hooks.jpg",
    author: "张三",
  },
  {
    slug: "typescript-advanced",
    title: "TypeScript 高级类型系统",
    description: "掌握 TypeScript 的高级类型特性，提升代码质量",
    excerpt:
      "掌握 TypeScript 的高级类型特性，包括泛型、条件类型、映射类型等，提升代码质量和开发效率。",
    date: "2024-01-10",
    tags: ["TypeScript", "JavaScript"],
    category: "技术",
    image: "/images/typescript.jpg",
    author: "李四",
  },
  {
    slug: "css-grid-layout",
    title: "CSS Grid 布局完全指南",
    description: "学习现代 CSS Grid 布局技术，创建复杂的网页布局",
    excerpt:
      "学习现代 CSS Grid 布局技术，从基础概念到高级应用，创建复杂而灵活的网页布局。",
    date: "2024-01-05",
    tags: ["CSS", "布局", "前端"],
    category: "教程",
    image: "/images/css-grid.jpg",
    author: "王五",
  },
  {
    slug: "nodejs-performance",
    title: "Node.js 性能优化实践",
    description: "提升 Node.js 应用性能的实用技巧和最佳实践",
    excerpt:
      "提升 Node.js 应用性能的实用技巧和最佳实践，包括内存管理、异步优化、缓存策略等。",
    date: "2024-01-01",
    tags: ["Node.js", "性能优化", "后端"],
    category: "技术",
    image: "/images/nodejs.jpg",
    author: "赵六",
  },
];

/**
 * 响应式网格布局演示组件
 *
 * 展示 ArticleGrid 组件的响应式特性：
 * - 桌面：4列
 * - 平板：3列
 * - 移动：2列/1列
 */
export function ResponsiveGridDemo() {
  const [currentView, setCurrentView] = useState<"grid" | "loading" | "empty">(
    "grid",
  );

  const handleTagClick = (tag: string) => {
    console.log("Tag clicked:", tag);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">响应式文章网格布局演示</h1>
        <p className="mb-6 text-muted-foreground">
          调整浏览器窗口大小查看响应式效果：桌面4列，平板3列，移动2列/1列
        </p>

        {/* 状态切换按钮 */}
        <div className="mb-6 flex justify-center gap-2">
          <button
            onClick={() => setCurrentView("grid")}
            className={`rounded-md px-4 py-2 text-sm ${
              currentView === "grid"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            文章网格
          </button>
          <button
            onClick={() => setCurrentView("loading")}
            className={`rounded-md px-4 py-2 text-sm ${
              currentView === "loading"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            加载状态
          </button>
          <button
            onClick={() => setCurrentView("empty")}
            className={`rounded-md px-4 py-2 text-sm ${
              currentView === "empty"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            空状态
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="rounded-lg border bg-background p-6">
        {currentView === "grid" && (
          <ArticleGrid posts={mockPosts} onTagClick={handleTagClick} />
        )}

        {currentView === "loading" && <LoadingState text="正在加载文章..." />}

        {currentView === "empty" && (
          <EmptyState
            title="暂无文章"
            description="该分类下暂时没有相关文章，请尝试其他分类"
            icon="📚"
          />
        )}
      </div>

      {/* 响应式说明 */}
      <div className="space-y-2 text-sm text-muted-foreground">
        <h3 className="font-medium">响应式断点说明：</h3>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <strong>移动设备 (&lt; 640px):</strong> 1列布局
          </li>
          <li>
            <strong>小平板 (640px - 768px):</strong> 2列布局
          </li>
          <li>
            <strong>大平板 (768px - 1024px):</strong> 3列布局
          </li>
          <li>
            <strong>桌面 (&gt; 1024px):</strong> 4列布局
          </li>
        </ul>
      </div>
    </div>
  );
}
