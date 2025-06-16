import { LucideIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { TagFilter } from './tag-filter';
import { useState } from 'react';

interface Category {
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
  tags: Array<{ name: string; count: number }>;
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  // 样式相关
  categoryButtonClassName?: string;
  className?: string;
  // 显示设置
  showAllCategoryButton?: boolean;
  allCategoryText?: string;
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
  categoryButtonClassName = '',
  className = '',
  showAllCategoryButton = true,
  allCategoryText = '全部',
  onCardTagClick,
}: UnifiedFilterProps) {
  const [tagsExpanded, setTagsExpanded] = useState(false);

  // 处理分类点击
  const handleCategoryClick = (categoryId: string) => {
    // 如果点击当前选中的分类，则切换到全部状态
    if (categoryId === selectedCategory) {
      onCategoryChange('');
    } else {
      onCategoryChange(categoryId);
    }
    onTagChange(null); // 清除已选标签
  };

  // 处理卡片标签点击
  const handleCardTagClick = (tag: string) => {
    if (onCardTagClick) {
      onCardTagClick(tag);
    } else {
      onTagChange(tag);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 分类过滤 */}
      <div className="flex flex-wrap gap-2">
        {showAllCategoryButton && (
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => handleCategoryClick('')}
            className={categoryButtonClassName}
          >
            {allCategoryText}
          </Button>
        )}
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-2 ${categoryButtonClassName}`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* 标签过滤器 */}
      {tags.length > 0 && (
        <TagFilter
          tags={tags}
          selectedTag={selectedTag}
          onTagSelectAction={onTagChange}
          onCardTagClick={handleCardTagClick}
          showCount={true}
          maxVisible={8}
          expanded={tagsExpanded}
          onExpandChange={setTagsExpanded}
        />
      )}
    </div>
  );
}