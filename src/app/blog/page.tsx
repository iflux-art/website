"use client";

import { UnifiedFilter } from "@/components/layout/unified-filter";
import { BlogCard } from "@/components/card/blog-card";
import { AppGrid } from "@/components/layout/app-grid";
import { useFilterState } from "@/hooks/filter/use-filter-state";
import { useBlogPosts } from "@/features/blog/hooks";
import { useMemo } from "react";
import type { BlogPost } from "@/features/blog/types";
// ====== 迁移自 src/utils/date.ts ======
/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 可选格式 (支持 'MM月dd日')
 * @returns 格式化后的日期字符串
 */
function formatDate(date: string | Date | undefined, format?: string): string {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  if (format === "MM月dd日") {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
// ====== END ======
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
