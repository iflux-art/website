"use client";

import { UnifiedFilter } from "packages/ui/components/unified-filter";
import { BlogCard } from "packages/ui/components/blog/blog-card";
import { AppGrid } from "packages/ui/components/app-grid";
import { useFilterState } from "packages/hooks/state/use-filter-state";
import { useBlogPosts } from "packages/hooks/blog/use-blog";
import { useMemo } from "react";
import type { BlogPost } from "packages/types/blog-types";
import { formatDate } from "packages/utils/date";
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
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto">
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
    </div>
  );
}

export default BlogContent;
