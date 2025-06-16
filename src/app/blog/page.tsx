'use client';

import { UnifiedFilter } from '@/components/common/filter/unified-filter';
import { motion } from 'framer-motion';
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
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 break-inside-avoid">
            <p className="text-muted-foreground">
              {selectedCategory || selectedTag ? '没有找到匹配的文章' : '暂无博客文章'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post: BlogPost) => (
            <motion.div
              key={post.slug}
              className="mb-6 break-inside-avoid block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <UnifiedCard
                title={post.title}
                description={post.description}
                href={`/blog/${post.slug}`}
                image={post.image}
                tags={post.tags}
                onTagClick={(tag: string) => handleTagChange(tag)}
                className="hover:border-primary/50 hover:bg-muted/50 transition-all duration-300 border rounded-lg overflow-hidden w-full block"
              />
            </motion.div>
          ))
        )}
      </div>
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
