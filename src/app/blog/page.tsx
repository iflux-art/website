'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tag, Clock } from 'lucide-react';
import { BlogList } from '@/components/features/blog/blog-list';
import { TagFilter } from '@/components/layout/filter/tag-filter';
import { useTagCounts } from '@/components/features/blog/use-blog';

// 创建一个包装组件来处理动态数据
function BlogContent() {
  const { tagCounts } = useTagCounts();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const formattedTags = tagCounts.map(({ tag, count }) => ({
    name: tag,
    count: count,
  }));

  return (
    <>
      <TagFilter
        tags={formattedTags}
        selectedTag={selectedTag}
        onTagSelectAction={setSelectedTag}
        showCount={true}
        maxVisible={8}
        className="mb-6"
        expanded={tagsExpanded}
        onExpandChange={setTagsExpanded}
      />
      <BlogList filterTag={selectedTag} onTagClickAction={setSelectedTag} />
    </>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto">
          <h1 className="text-3xl font-bold mb-6">博客</h1>

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

          <BlogContent />
        </div>
      </div>
    </div>
  );
}
