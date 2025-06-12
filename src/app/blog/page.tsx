'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Tag, Clock, X } from 'lucide-react';

import { BlogList } from '@/components/features/blog/blog-list';
import { useTags, useBlogPosts } from '@/hooks/use-blog';

/**
 * 标签过滤器组件
 */
function TagFilter({
  tags,
  selectedTag,
  onTagSelect,
  postsCount,
}: {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  postsCount: Record<string, number>;
}) {
  const [showAllTags, setShowAllTags] = useState(false);

  // 按使用数量排序标签
  const sortedTags = useMemo(() => {
    return tags
      .map(tag => ({
        name: tag,
        count: postsCount[tag] || 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [tags, postsCount]);

  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, 6);
  const hasMoreTags = sortedTags.length > 6;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Tag className="h-5 w-5 mr-2" />
        按标签筛选
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagSelect(null)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            selectedTag === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          全部
        </button>
        {visibleTags.map(tagInfo => (
          <button
            key={tagInfo.name}
            onClick={() => onTagSelect(tagInfo.name)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
              selectedTag === tagInfo.name
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {tagInfo.name}
            <span className="text-xs opacity-70">({tagInfo.count})</span>
          </button>
        ))}
        {hasMoreTags && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="px-3 py-1.5 rounded-lg text-sm transition-all bg-muted hover:bg-muted/80 text-muted-foreground"
          >
            {showAllTags ? '收起' : `更多 (+${sortedTags.length - 6})`}
          </button>
        )}
      </div>
      {selectedTag && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">当前筛选：</span>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
            {selectedTag}
          </span>
          <button onClick={() => onTagSelect(null)} className="p-1 hover:bg-muted rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function BlogPage() {
  // 预加载博客文章
  const { posts } = useBlogPosts();
  const { tags: allTags } = useTags();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 计算每个标签的文章数量
  const postsCount = useMemo(() => {
    return posts.reduce((acc, post) => {
      post.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
  }, [posts]);
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          {/* 页面标题 */}
          <h1 className="text-3xl font-bold mb-6">博客</h1>

          {/* 导航按钮 */}
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

          {/* 标签过滤器 */}
          <TagFilter
            tags={allTags}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
            postsCount={postsCount}
          />

          {/* 博客列表 */}
          <BlogList filterTag={selectedTag} onTagClick={setSelectedTag} />
        </div>
      </div>
    </div>
  );
}
