import { Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
// 内联 Category 类型定义
export interface Category {
  id: string;
  name: string;
  icon?: any;
}

// 内联 TagType 类型定义
export interface TagType {
  name: string;
  count: number;
}

interface UnifiedFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  tags: TagType[];
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  categoryButtonClassName?: string;
  className?: string;
  showAllCategoryButton?: boolean;
  allCategoryText?: string;
  showTagCount?: boolean;
  tagTitle?: string;
  maxVisibleTags?: number;
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

  const sortedTags = [...tags].sort((a, b) => b.count - a.count);
  const visibleTags = tagsExpanded
    ? sortedTags
    : sortedTags.slice(0, maxVisibleTags);
  const hasMoreTags = sortedTags.length > maxVisibleTags;

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === selectedCategory) {
      onCategoryChange("");
    } else {
      onCategoryChange(categoryId);
    }
    onTagChange(null);
  };

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
            className={
              categoryButtonClassName +
              (selectedCategory === "" ? " font-medium" : "")
            }
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
              className={`flex items-center gap-2${selectedCategory === category.id ? "font-medium" : ""} ${categoryButtonClassName}`}
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
                className={
                  "cursor-pointer transition-colors " +
                  (selectedTag === tag.name
                    ? "font-medium text-primary"
                    : "hover:text-primary")
                }
                onClick={() => handleTagClick(tag.name)}
              >
                {tag.name}
                {showTagCount && tag.count !== undefined && ` (${tag.count})`}
              </Badge>
            ))}
            {hasMoreTags && (
              <Badge
                variant="secondary"
                className="cursor-pointer transition-colors hover:text-primary"
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
