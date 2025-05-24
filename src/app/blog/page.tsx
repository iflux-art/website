'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Tag, Clock, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { BlogList } from '@/components/features/blog/blog-list';
import { BlogLayout } from '@/components/layouts';
import { useTags, useBlogPosts } from '@/hooks/use-blog';

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
    <BlogLayout
      title="博客"
      showTagFilter={true}
      allTags={allTags}
      selectedTag={selectedTag}
      onTagChange={setSelectedTag}
      extraContent={
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
      }
    >
      {/* 直接使用 BlogList 组件，不需要额外的网格容器 */}
      <BlogList filterTag={selectedTag} onTagClick={handleTagClick} />
    </BlogLayout>
  );
}
