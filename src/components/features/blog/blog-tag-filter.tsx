'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TagFilter } from '@/components/ui/utils/tag-filter';

interface BlogTagFilterProps {
  allTags: string[];
  selectedTag: string | null;
  setSelectedTagAction: (tag: string | null) => void;
}

export function BlogTagFilter({ allTags, selectedTag, setSelectedTagAction }: BlogTagFilterProps) {
  // 获取URL参数
  const searchParams = useSearchParams();
  const tagParam = searchParams?.get('tag');

  // 从URL参数中获取标签
  useEffect(() => {
    if (tagParam) {
      setSelectedTagAction(decodeURIComponent(tagParam));
    }
  }, [tagParam, setSelectedTagAction]);

  // 处理标签点击
  const handleTagSelect = (tag: string | null) => {
    if (tag === null) {
      setSelectedTagAction(null);
      // 更新URL，移除tag参数
      window.history.pushState({}, '', '/blog');
    } else {
      setSelectedTagAction(tag);
      // 更新URL，添加tag参数
      window.history.pushState({}, '', `/blog?tag=${encodeURIComponent(tag)}`);
    }
  };

  if (!allTags || allTags.length === 0) {
    return null;
  }

  return (
    <TagFilter
      tags={allTags}
      selectedTag={selectedTag}
      onTagSelectAction={handleTagSelect}
      title="按标签浏览"
      showCount={false}
      maxVisible={8}
      className="mb-8"
      variant="secondary"
    />
  );
}
