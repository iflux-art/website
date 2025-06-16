import { useMemo, useState } from 'react';
import { useBlogPosts } from '@/hooks/use-blog';
import type { BlogPost } from '@/types/blog-types';
import type { Category } from '@/components/common/filter/unified-filter';

export const useBlogFilter = () => {
  const { posts, categories: rawCategories } = useBlogPosts();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { categories, tags, filteredPosts } = useMemo(() => {
    // 构造分类数据
    const categories: Category[] = rawCategories.map((cat) => ({
      id: cat,
      name: cat,
    }));

    // 获取所有标签（当未选择分类时）或当前分类下的标签
    const relevantPosts = !selectedCategory
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

    // 获取标签映射
    const tagMap = relevantPosts.reduce((acc: Record<string, number>, post: BlogPost) => {
      post.tags?.forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    const tags = Object.entries(tagMap).map(([name, count]) => ({
      name,
      count: count as number,
    }));

    // 按标签和分类筛选文章
    const filteredPosts = posts.filter((post) => {
      const categoryMatch = !selectedCategory || post.category === selectedCategory;
      const tagMatch = !selectedTag || post.tags?.includes(selectedTag);
      return categoryMatch && tagMatch;
    });

    return { categories, tags, filteredPosts };
  }, [posts, rawCategories, selectedCategory, selectedTag]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedTag(null);
  };

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
  };

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
