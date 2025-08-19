'use client';

import { AppGrid } from '@/features/layout';
import {
  BlogListContent,
  TagCloudCard,
  BlogCategoryCard,
  RelatedPostsCard,
  LatestPostsCard,
} from '@/features/blog/components';
import type { CategoryWithCount } from '@/features/blog/hooks';
import type { BlogPost } from '@/features/blog/types';
import { getAllPosts } from '@/features/blog/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { category, tag } = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to load posts', error);
      } finally {
        setLoading(false);
      }
    }
    void loadPosts();
  }, []);

  // 过滤文章
  const filteredPosts = posts.filter(post => {
    if (category && post.category !== category) return false;
    if (tag && !post.tags?.includes(tag)) return false;
    return true;
  });

  // 分类统计
  const categoriesCount: Record<string, number> = {};
  posts.forEach(post => {
    if (post.category) {
      categoriesCount[post.category] = (categoriesCount[post.category] || 0) + 1;
    }
  });
  const categories: CategoryWithCount[] = Object.entries(categoriesCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 标签统计
  const postsCount: Record<string, number> = {};
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      postsCount[tag] = (postsCount[tag] || 0) + 1;
    });
  });

  // 相关文章（取最新的10篇）
  const relatedPosts = posts.slice(0, 10).map(post => ({
    title: post.title,
    href: `/blog/${post.slug}`,
    category: post.category,
  }));

  // 最新发布的文章
  const latestPosts = posts
    .filter(post => post.date)
    .slice(0, 5)
    .map(post => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      date: post.date?.toString(),
      category: post.category,
    }));

  // 处理分类/标签点击
  const handleCategoryClick = (newCategory: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      newParams.set('category', newCategory);
    } else {
      newParams.delete('category');
    }
    router.push(`/blog?${newParams.toString()}`, { scroll: false });
  };

  const handleTagClick = (newTag: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (newTag) {
      newParams.set('tag', newTag);
    } else {
      newParams.delete('tag');
    }
    router.push(`/blog?${newParams.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto">
          <AppGrid columns={5} gap="large">
            {/* 左侧边栏 - 加载状态 */}
            <aside className="hide-scrollbar sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:col-span-1 lg:block">
              <div className="space-y-4">
                <div className="h-[200px] animate-pulse rounded-md bg-muted" />
                <div className="h-[300px] animate-pulse rounded-md bg-muted" />
              </div>
            </aside>

            {/* 主内容区 - 加载状态 */}
            <main className="col-span-1 min-w-0 lg:col-span-1 xl:col-span-3">
              <div className="h-[600px] animate-pulse rounded-md bg-muted" />
            </main>

            {/* 右侧边栏 - 加载状态 */}
            <aside className="hide-scrollbar sticky top-[80px] hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:col-span-1 lg:block">
              <div className="space-y-4">
                <div className="h-[200px] animate-pulse rounded-md bg-muted" />
                <div className="h-[300px] animate-pulse rounded-md bg-muted" />
              </div>
            </aside>
          </AppGrid>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <AppGrid columns={5} gap="large">
          {/* 左侧边栏 - 分类导航和标签云 (桌面端) */}
          <aside className="hide-scrollbar sticky top-20 hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:col-span-1 lg:block">
            <div className="space-y-4">
              <BlogCategoryCard
                categories={categories}
                selectedCategory={category ?? undefined}
                onCategoryClick={handleCategoryClick}
              />
              <TagCloudCard
                allTags={Object.entries(postsCount).map(([name, count]) => ({
                  name,
                  count,
                }))}
                selectedTag={tag ?? undefined}
                onTagClick={handleTagClick}
              />
            </div>
          </aside>

          {/* 主内容区 - 文章列表 */}
          <main className="col-span-1 min-w-0 lg:col-span-1 xl:col-span-3">
            <BlogListContent
              posts={filteredPosts}
              selectedCategory={category}
              selectedTag={tag}
              onCategoryClick={handleCategoryClick}
              onTagClick={handleTagClick}
            />
          </main>

          {/* 右侧边栏 - 相关文章和最新发布 (桌面端) */}
          <aside className="hide-scrollbar sticky top-[80px] hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:col-span-1 lg:block">
            <div className="space-y-4">
              <RelatedPostsCard posts={relatedPosts} currentSlug={[]} />
              <LatestPostsCard posts={latestPosts} currentSlug={[]} />
            </div>
          </aside>
        </AppGrid>
      </div>
    </div>
  );
}
