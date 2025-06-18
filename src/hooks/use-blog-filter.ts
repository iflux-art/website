import { useMemo } from 'react';
import { useBlogPosts } from '@/hooks/use-blog';
import { useFilterState } from '@/hooks/use-filter-state';
import type { Category } from '@/components/common/unified-filter';

export const useBlogFilter = () => {
  const { posts, categories: rawCategories } = useBlogPosts();

  // 使用通用的过滤state管理
  const {
    filteredItems: filteredPosts,
    selectedCategory,
    selectedTag,
    handleCategoryChange,
    handleTagChange,
    filteredTags: tags,
  } = useFilterState(posts);

  // 只处理分类数据的转换
  const categories = useMemo<Category[]>(
    () =>
      rawCategories.map((cat) => ({
        id: cat,
        name: cat,
      })),
    [rawCategories]
  );

  return {
    posts,
    categories,
    selectedCategory,
    selectedTag,
    filteredPosts,
    tags,
    handleCategoryChange,
    handleTagChange,
  };
};
