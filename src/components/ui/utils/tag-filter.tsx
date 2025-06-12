/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Tag, X } from 'lucide-react';
import { Badge } from '../display/badge';
import { Button } from '../input/button';
import { ReactNode } from 'react';

export interface TagFilterProps {
  tags: Array<string | { name: string; count?: number }>;
  selectedTag: string | null;
  onTagSelectAction: (tag: string | null) => void;
  title?: string;
  showCount?: boolean;
  showClear?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
  maxVisible?: number;
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export function TagFilter({
  tags,
  selectedTag,
  onTagSelectAction,
  title = '按标签筛选',
  showCount = true,
  showClear = true,
  variant = 'outline',
  className = '',
  maxVisible = 8,
  expanded = false,
  onExpandChange,
}: TagFilterProps): ReactNode {
  const processedTags = tags.map(tag =>
    typeof tag === 'string' ? { name: tag, count: undefined } : tag
  );

  const sortedTags = processedTags.sort((a: any, b: any) => {
    if (a.count !== undefined && b.count !== undefined) {
      return b.count - a.count;
    }
    return 0;
  });

  const visibleTags = expanded ? sortedTags : sortedTags.slice(0, maxVisible);
  const hasMoreTags = sortedTags.length > maxVisible;
  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      onTagSelectAction(null);
    } else {
      onTagSelectAction(tagName);
    }
  };

  const handleExpandClick = () => {
    onExpandChange?.(!expanded);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Tag className="h-4 w-4" />
          {title}
        </h2>
        {showClear && selectedTag && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTagSelectAction(null)}
            className="text-muted-foreground hover:text-foreground rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            清除筛选 <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleTags.map(tag => (
          <Badge
            key={tag.name}
            variant={selectedTag === tag.name ? 'default' : variant}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => handleTagClick(tag.name)}
          >
            {tag.name}
            {showCount && tag.count !== undefined && ` (${tag.count})`}
          </Badge>
        ))}
        {hasMoreTags && (
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={handleExpandClick}
          >
            {expanded ? '收起' : `显示更多 (${sortedTags.length - maxVisible})`}
          </Badge>
        )}
      </div>
    </div>
  );
}