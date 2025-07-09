import { LucideIcon, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface TagType {
  name: string;
  count: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: LucideIcon;
}

interface UnifiedFilterProps {
  // 分类相关
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  // 标签相关
  tags: TagType[];
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  // 样式相关
  categoryButtonClassName?: string;
  className?: string;
  // 显示设置
  showAllCategoryButton?: boolean;
  allCategoryText?: string;
  showTagCount?: boolean;
  tagTitle?: string;
  maxVisibleTags?: number;
  // 标签点击回调
  onCardTagClick?: (tag: string) => void;
}

export function UnifiedFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  tags,
  selectedTag,
  onTagChange,
  categoryButtonClassName = "",
  className = "",
  showAllCategoryButton = true,
  allCategoryText = "全部",
  showTagCount = true,
  tagTitle = "按标签筛选",
  maxVisibleTags = 8,
}: UnifiedFilterProps) {
  const [tagsExpanded, setTagsExpanded] = useState(false);

  // 按计数排序标签
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);
  const visibleTags = tagsExpanded
    ? sortedTags
    : sortedTags.slice(0, maxVisibleTags);
  const hasMoreTags = sortedTags.length > maxVisibleTags;

  // 处理分类点击
  const handleCategoryClick = (categoryId: string) => {
    // 如果点击当前选中的分类，则切换到全部状态
    if (categoryId === selectedCategory) {
      onCategoryChange("");
    } else {
      onCategoryChange(categoryId);
    }
    onTagChange(null); // 清除已选标签
  };

  // 统一处理标签点击
  const handleTagClick = (tagName: string) => {
    if (selectedTag === tagName) {
      onTagChange(null);
    } else {
      onTagChange(tagName);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 分类过滤 */}
      <div className="flex flex-wrap gap-2">
        {showAllCategoryButton && (
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            onClick={() => handleCategoryClick("")}
            className={categoryButtonClassName}
          >
            {allCategoryText}
          </Button>
        )}
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-2 ${categoryButtonClassName}`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* 标签过滤器 */}
      {tags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Tag className="h-4 w-4" />
              {tagTitle}
            </h2>
            {selectedTag && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTagChange(null)}
                className="rounded-xl text-muted-foreground shadow-sm transition-all hover:text-foreground hover:shadow-md"
              >
                清除筛选 <X className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <Badge
                key={tag.name}
                variant={selectedTag === tag.name ? "default" : "outline"}
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => handleTagClick(tag.name)}
              >
                {tag.name}
                {showTagCount && tag.count !== undefined && ` (${tag.count})`}
              </Badge>
            ))}
            {hasMoreTags && (
              <Badge
                variant="secondary"
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => setTagsExpanded(!tagsExpanded)}
              >
                {tagsExpanded
                  ? "收起"
                  : `显示更多 (${sortedTags.length - maxVisibleTags})`}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
