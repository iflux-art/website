'use client';

import React from 'react';
import {
  BlogCategoryCard,
  BlogListContent,
  LatestPostsCard,
  RelatedPostsCard,
  TagCloudCard,
} from '@/features/blog/components';
import { ThreeColumnLayout } from '@/features/layout';
import { useBlogPage } from '@/features/blog/hooks/use-blog-page';

/**
 * Blog页面容器组件
 * 使用三栏布局展示博客内容
 */
export const BlogPageContainer = () => {
  const {
    filteredPosts,
    categories,
    postsCount,
    relatedPosts,
    latestPosts,
    loading,
    category,
    tag,
    handleCategoryClick,
    handleTagClick,
  } = useBlogPage();

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-12 lg:gap-8 lg:pt-8">
            {/* 左侧边栏 - 加载状态 */}
            <aside className="hide-scrollbar sticky top-[96px] hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:col-span-3 lg:block">
              <div className="space-y-4">
                <div className="h-[200px] animate-pulse rounded-md bg-muted" />
                <div className="h-[300px] animate-pulse rounded-md bg-muted" />
              </div>
            </aside>

            {/* 主内容区 - 加载状态 */}
            <main className="col-span-1 min-w-0 lg:col-span-6">
              <div className="h-[600px] animate-pulse rounded-md bg-muted" />
            </main>

            {/* 右侧边栏 - 加载状态 */}
            <aside className="hide-scrollbar sticky top-[96px] hidden max-h-[calc(100vh-5rem-env(safe-area-inset-bottom))] overflow-y-auto lg:col-span-3 lg:block">
              <div className="space-y-4">
                <div className="h-[200px] animate-pulse rounded-md bg-muted" />
                <div className="h-[300px] animate-pulse rounded-md bg-muted" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // 左侧边栏内容
  const leftSidebar = (
    <>
      <BlogCategoryCard
        categories={categories}
        selectedCategory={category}
        onCategoryClick={handleCategoryClick}
      />
      <TagCloudCard
        allTags={Object.entries(postsCount).map(([name, count]) => ({
          name,
          count,
        }))}
        selectedTag={tag}
        onTagClick={handleTagClick}
      />
    </>
  );

  // 右侧边栏内容
  const rightSidebar = (
    <>
      <RelatedPostsCard posts={relatedPosts} currentSlug={[]} />
      <LatestPostsCard posts={latestPosts} currentSlug={[]} />
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <ThreeColumnLayout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
        <BlogListContent
          posts={filteredPosts}
          selectedCategory={category}
          selectedTag={tag}
          onCategoryClick={handleCategoryClick}
          onTagClick={handleTagClick}
        />
      </ThreeColumnLayout>
    </div>
  );
};

export default BlogPageContainer;
