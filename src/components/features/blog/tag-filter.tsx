import { useState, useMemo } from 'react';
import { Tag, X } from 'lucide-react';

export interface TagFilterProps {
  /**
   * 所有可用的标签
   */
  tags: string[];

  /**
   * 当前选中的标签
   */
  selectedTag: string | null;

  /**
   * 标签选择回调
   */
  onTagSelectAction: (tag: string | null) => void;

  /**
   * 每个标签对应的文章数量
   */
  postsCount: Record<string, number>;
}

/**
 * 标签过滤器组件
 */
export function TagFilter({ tags, selectedTag, onTagSelectAction, postsCount }: TagFilterProps) {
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
          onClick={() => onTagSelectAction(null)}
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
            onClick={() => onTagSelectAction(tagInfo.name)}
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
          <button onClick={() => onTagSelectAction(null)} className="p-1 hover:bg-muted rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}