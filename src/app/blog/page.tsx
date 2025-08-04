"use client";

import { UnifiedFilter } from "@/components/layout/unified-filter";
import { BlogCard } from "@/components/card/blog-card";
import { AppGrid } from "@/components/layout/app-grid";
import { useFilterState } from "@/hooks/filter/use-filter-state";
import { useBlogPosts } from "@/hooks/use-blog";
import { useMemo } from "react";
import type { BlogPost } from "@/types/blog-types";
import { formatDate } from "@/utils/date";
// 内联 Category 类型定义
type Category = { id: string; name: string };

function BlogContent() {
  const { posts, categories: rawCategories } = useBlogPosts();

  // 转换分类数据格式
  const categories = useMemo<Category[]>(
    () =>
      rawCategories.map((cat) => ({
        id: cat,
        name: cat,
      })),
    [rawCategories],
  );

  // 使用统一的过滤状态管理
  const {
    filteredItems: filteredPosts,
    selectedCategory,
    selectedTag,
    handleCategoryChange: baseHandleCategoryChange,
    handleTagChange,
    filteredTags: tags,
  } = useFilterState(posts);

  // 处理分类切换，同时清空标签选择
  const handleCategoryChange = (category: string) => {
    baseHandleCategoryChange(category);
    handleTagChange(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">博客文章</h1>
          <p className="text-muted-foreground">分享技术见解和经验</p>
        </div>

        <UnifiedFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          tags={tags}
          selectedTag={selectedTag}
          onTagChange={handleTagChange}
          onCardTagClick={handleTagChange}
          categoryButtonClassName="rounded-full"
          className="mb-6"
        />

        <AppGrid columns={4} className="mt-8 gap-6">
          {filteredPosts.map((post: BlogPost) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              description={post.description}
              href={`/blog/${post.slug}`}
              image={post.image}
              tags={post.tags}
              date={formatDate(post.date?.toString())}
              onTagClick={handleTagChange}
            />
          ))}
        </AppGrid>
      </div>
    </div>
  );
}

export default BlogContent;
