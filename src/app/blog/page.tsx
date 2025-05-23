'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Tag, Clock, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { BlogList } from '@/components/features/blog/blog-list';
import { useTags, useBlogPosts } from '@/hooks/use-blog';


// 导入标签过滤器组件
import { BlogTagFilter } from '@/components/features/blog/blog-tag-filter';

export default function BlogPage() {
  const pathname = usePathname();

  // 预加载博客文章
  const { posts, loading: postsLoading } = useBlogPosts();

  // 获取所有标签
  const { tags: allTags, loading: tagsLoading } = useTags();

  // 当前选中的标签
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  // 调试信息
  useEffect(() => {
    console.log('博客页面路径:', pathname);
    console.log('博客文章加载状态:', postsLoading);
    console.log('博客文章数量:', posts.length);
  }, [pathname, postsLoading, posts.length]);

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 tracking-tight">博客</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          href="/blog"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <Tag className="h-4 w-4" />
          全部文章
        </Link>
        <Link
          href="/blog/timeline"
          className="flex items-center gap-2 px-5 py-2.5 bg-muted hover:bg-muted/80 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <Clock className="h-4 w-4" />
          时间轴
        </Link>
      </div>

      {/* 标签过滤器 - 使用Suspense包装 */}
      <Suspense
        fallback={<div className="mb-8 h-20 bg-muted/20 animate-pulse rounded-xl shadow-sm"></div>}
      >
        {allTags && allTags.length > 0 && (
          <BlogTagFilter
            allTags={allTags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
        )}
      </Suspense>

      {/* 直接使用 BlogList 组件，不需要额外的网格容器 */}
      <BlogList filterTag={selectedTag} onTagClick={handleTagClick} />
    </main>
  );
}
