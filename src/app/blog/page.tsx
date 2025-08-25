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

// 由于使用了客户端 hooks，这里不能导出 metadata
// 在实际项目中应该考虑使用 generateMetadata 函数或服务端组件

const BlogPage = () => {
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

  // 左侧边栏内容 - 分类和标签
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

  // 右侧边栏内容 - 相关和最新文章
  const rightSidebar = (
    <>
      <RelatedPostsCard posts={relatedPosts} currentSlug={[]} />
      <LatestPostsCard posts={latestPosts} currentSlug={[]} />
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <ThreeColumnLayout leftSidebar={leftSidebar} rightSidebar={rightSidebar}>
        {/* 页面主内容 */}
        <div className="space-y-6">
          {/* 博客列表内容 */}
          <BlogListContent
            posts={filteredPosts}
            selectedCategory={category}
            selectedTag={tag}
            onCategoryClick={handleCategoryClick}
            onTagClick={handleTagClick}
          />
        </div>
      </ThreeColumnLayout>
    </div>
  );
};

export default BlogPage;
