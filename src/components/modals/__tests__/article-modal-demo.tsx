"use client";

import React, { useState } from "react";
import { ArticleModal } from "../article-modal";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/features/blog/types";

// 测试用的文章数据
const mockPosts: BlogPost[] = [
  {
    slug: "react-hooks-guide",
    title: "React Hooks 完全指南",
    description: "深入了解 React Hooks 的使用方法和最佳实践",
    excerpt: "React Hooks 是 React 16.8 引入的新特性...",
    tags: ["React", "JavaScript", "前端"],
    date: "2024-01-15",
    category: "技术",
    author: "张三",
    image: "https://via.placeholder.com/400x200",
  },
  {
    slug: "typescript-advanced",
    title: "TypeScript 高级特性详解",
    description: "探索 TypeScript 的高级类型系统和实用技巧",
    excerpt: "TypeScript 提供了强大的类型系统...",
    tags: ["TypeScript", "JavaScript", "类型系统"],
    date: "2024-01-10",
    category: "技术",
    author: "李四",
    image: "https://via.placeholder.com/400x200",
  },
  {
    slug: "nextjs-performance",
    title: "Next.js 性能优化实战",
    description: "学习如何优化 Next.js 应用的性能",
    excerpt: "Next.js 提供了多种性能优化方案...",
    tags: ["Next.js", "React", "性能优化"],
    date: "2024-01-05",
    category: "技术",
    author: "王五",
    image: "https://via.placeholder.com/400x200",
  },
];

/**
 * ArticleModal 演示组件
 * 用于测试和演示模态对话框的功能
 */
export function ArticleModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleShowLoading = () => {
    setIsLoading(true);
    setError(undefined);
    setPosts([]);
    setIsOpen(true);

    // 模拟加载过程
    setTimeout(() => {
      setIsLoading(false);
      setPosts(mockPosts);
    }, 2000);
  };

  const handleShowError = () => {
    setIsLoading(false);
    setError("网络连接失败，请检查网络后重试");
    setPosts([]);
    setIsOpen(true);
  };

  const handleShowEmpty = () => {
    setIsLoading(false);
    setError(undefined);
    setPosts([]);
    setIsOpen(true);
  };

  const handleTagClick = (tag: string) => {
    console.log("点击标签:", tag);
    // 这里可以实现标签筛选逻辑
  };

  return (
    <div className="space-y-4 p-8">
      <h1 className="mb-6 text-2xl font-bold">ArticleModal 演示</h1>

      <div className="flex flex-wrap gap-4">
        <Button onClick={handleOpenModal}>打开模态对话框 (正常状态)</Button>

        <Button onClick={handleShowLoading} variant="outline">
          显示加载状态
        </Button>

        <Button onClick={handleShowError} variant="outline">
          显示错误状态
        </Button>

        <Button onClick={handleShowEmpty} variant="outline">
          显示空状态
        </Button>
      </div>

      <ArticleModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="技术分类"
        posts={posts}
        isLoading={isLoading}
        error={error}
        onTagClick={handleTagClick}
      />
    </div>
  );
}
