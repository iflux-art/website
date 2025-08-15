"use client";

import { CategoryGrid } from "@/features/blog/components";
import { ArticleModal } from "@/features/blog";
import { useBlogPosts } from "@/features/blog/hooks";
import { useModal } from "@/hooks/use-modal";
import { useArticleFilter } from "@/hooks/use-article-filter";
import { useMemo } from "react";

// 内联 Category 类型定义
interface Category {
  id: string;
  name: string;
  count: number;
}

export default function CategoriesPage() {
  const { posts, categories: rawCategories } = useBlogPosts();
  const { modalState, openModal, closeModal } = useModal();
  const { filterByCategory } = useArticleFilter();

  // 转换分类数据格式并计算文章数量
  const categories = useMemo<Category[]>(() => {
    const categoryStats = new Map<string, number>();

    // 计算每个分类的文章数量
    posts.forEach((post) => {
      if (post.category) {
        categoryStats.set(
          post.category,
          (categoryStats.get(post.category) || 0) + 1,
        );
      }
    });

    // 转换为 Category 格式
    return rawCategories.map((cat) => ({
      id: cat,
      name: cat,
      count: categoryStats.get(cat) || 0,
    }));
  }, [posts, rawCategories]);

  // 处理分类点击事件
  const handleCategoryClick = (categoryName: string) => {
    const filterResult = filterByCategory(posts, categoryName);
    const title = `${categoryName}分类文章 (${filterResult.posts.length}篇)`;
    openModal(title, filterResult.posts);
  };

  // handleTagClick 函数已移除，因为新的 ArticleModal 不再支持标签点击

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold tracking-tight">文章分类</h1>
          <p className="text-muted-foreground">
            按分类浏览所有文章，快速找到感兴趣的内容
          </p>
        </div>

        {/* 分类网格 */}
        <CategoryGrid
          categories={categories}
          onCategoryClick={handleCategoryClick}
          className="mb-8"
        />

        {/* 文章模态对话框 */}
        <ArticleModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={modalState.title}
          posts={modalState.posts}
          isLoading={modalState.isLoading}
          error={modalState.error}
        />
      </div>
    </div>
  );
}
