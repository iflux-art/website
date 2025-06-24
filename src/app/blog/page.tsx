'use client';

import { UnifiedFilter, type Category } from '@/components/common/filter/unified-filter';
import { UnifiedCard } from '@/components/common/unified-card';
import { UnifiedGrid } from '@/components/layout/unified-grid';
import { useFilterState } from '@/components/common/filter/use-filter-state';
import { useBlogPosts } from '@/hooks/use-blog';
import { useMemo } from 'react';
import type { BlogPost } from '@/types/blog-types';

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return '';

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}年${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`;
  } catch {
    return '';
  }
}
function BlogContent() {
  const { posts, categories: rawCategories } = useBlogPosts();

  // 转换分类数据格式
  const categories = useMemo<Category[]>(
    () =>
      rawCategories.map(cat => ({
        id: cat,
        name: cat,
      })),
    [rawCategories]
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
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">博客文章</h1>
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

          <UnifiedGrid columns={3} className="mt-8 gap-6">
            {filteredPosts.map((post: BlogPost) => (
              <UnifiedCard
                key={post.slug}
                title={post.title}
                description={post.description}
                href={`/blog/${post.slug}`}
                image={post.image}
                tags={post.tags}
                onTagClick={handleTagChange}
              >
                <div className="flex justify-between items-center mt-6">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.date?.toString())}
                  </span>
                  <span className="text-sm text-primary font-medium">阅读全文 →</span>
                </div>
              </UnifiedCard>
            ))}
          </UnifiedGrid>
        </div>
      </div>
    </div>
  );
}

export default BlogContent;
