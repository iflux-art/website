"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Tag, Clock, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { BlogList } from '@/components/features/blog/blog-list';
import { useTags } from '@/hooks/use-blog';
import { Button } from '@/components/ui/button';

// 导入标签过滤器组件
import { BlogTagFilter } from '@/components/features/blog/blog-tag-filter';

export default function BlogPage() {
  // 获取所有标签
  const { tags: allTags, loading: tagsLoading } = useTags();

  // 当前选中的标签
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">博客</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          href="/blog"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          <Tag className="h-4 w-4" />
          全部文章
        </Link>
        <Link
          href="/blog/timeline"
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          <Clock className="h-4 w-4" />
          时间轴
        </Link>
      </div>

      {/* 标签过滤器 - 使用Suspense包装 */}
      <Suspense fallback={<div className="mb-8 h-20 bg-muted/20 animate-pulse rounded-md"></div>}>
        {allTags && allTags.length > 0 && (
          <BlogTagFilter
            allTags={allTags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
        )}
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogList
          filterTag={selectedTag}
          onTagClick={handleTagClick}
        />
      </div>
    </main>
  );
}