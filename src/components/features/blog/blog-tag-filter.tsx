'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogTagFilterProps {
  allTags: string[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export function BlogTagFilter({ allTags, selectedTag, setSelectedTag }: BlogTagFilterProps) {
  // 获取URL参数
  const searchParams = useSearchParams();
  const tagParam = searchParams.get('tag');

  // 从URL参数中获取标签
  useEffect(() => {
    if (tagParam) {
      setSelectedTag(decodeURIComponent(tagParam));
    }
  }, [tagParam, setSelectedTag]);

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    // 如果已经选中该标签，则取消选中
    if (selectedTag === tag) {
      setSelectedTag(null);
      // 更新URL，移除tag参数
      window.history.pushState({}, '', '/blog');
    } else {
      setSelectedTag(tag);
      // 更新URL，添加tag参数
      window.history.pushState({}, '', `/blog?tag=${encodeURIComponent(tag)}`);
    }
  };

  // 清除标签筛选
  const clearTagFilter = () => {
    setSelectedTag(null);
    // 更新URL，移除tag参数
    window.history.pushState({}, '', '/blog');
  };

  if (!allTags || allTags.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Tag className="h-4 w-4" />
          按标签浏览
        </h2>
        {selectedTag && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTagFilter}
            className="text-muted-foreground hover:text-foreground rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            清除筛选 <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {allTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(tag)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${
              selectedTag === tag
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted hover:bg-primary/10 hover:text-primary hover:shadow-md'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
