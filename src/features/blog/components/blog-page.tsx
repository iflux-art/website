'use client';

import React from 'react';
import {
  BlogCategoryCard,
  BlogListContent,
  LatestPostsCard,
  RelatedPostsCard,
  TagCloudCard,
} from '@/features/blog/components';
import { ThreeColumnLayout } from '@/components/layout';
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
    category,
    tag,
    handleCategoryClick,
    handleTagClick,
  } = useBlogPage();

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
