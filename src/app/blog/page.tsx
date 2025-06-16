'use client';

import { UnifiedFilter } from '@/components/common/filter/unified-filter';
import { UnifiedGrid } from '@/components/layout/unified-grid';
import { UnifiedCard } from '@/components/common/cards/unified-card';
import { PageLayout, PageTitle } from '@/components/layout/page-layout';
import { useBlogFilter } from '@/hooks/use-blog-filter';
import type { BlogPost } from '@/types/blog-types';

function BlogContent() {
  const {
    categories,
    selectedCategory,
    selectedTag,
    filteredPosts,
    tags,
    handleCategoryChange,
    handleTagChange,
  } = useBlogFilter();

  return (
    <div className="container mx-auto px-4">
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
      <UnifiedGrid columns={4} className="items-stretch">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {selectedCategory || selectedTag ? '没有找到匹配的文章' : '暂无博客文章'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post: BlogPost) => (
            <UnifiedCard
              key={post.slug}
              title={post.title}
              description={post.description}
              href={`/blog/${post.slug}`}
              image={post.image}
              tags={post.tags}
              onTagClick={(tag: string) => handleTagChange(tag)}
              className="hover:border-primary/50 hover:bg-muted/50 h-full"
            />
          ))
        )}
      </UnifiedGrid>
    </div>
  );
}

export default function BlogPage() {
  return (
    <PageLayout>
      <PageTitle>博客</PageTitle>
      <BlogContent />
    </PageLayout>
  );
}
