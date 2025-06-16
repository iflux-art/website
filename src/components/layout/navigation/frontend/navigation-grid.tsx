import { UnifiedCard } from '@/components/common/cards/unified-card';
import { UnifiedGrid } from '@/components/layout/unified-grid';
import { NavigationItem } from './navigation-types';

interface NavigationGridProps {
  items: NavigationItem[];
  onTagClick: (tag: string) => void;
  selectedCategory: string;
  selectedTag: string | null;
}

export function NavigationGrid({
  items,
  onTagClick,
  selectedCategory,
  selectedTag,
}: NavigationGridProps) {
  return (
    <UnifiedGrid columns={4}>
      {items.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">
            {selectedCategory || selectedTag ? '没有找到匹配的网址' : '暂无网址数据'}
          </p>
        </div>
      ) : (
        items.map(item => (
          <UnifiedCard
            key={item.id}
            type="category"
            variant="compact"
            title={item.title}
            description={item.description}
            href={item.url}
            icon={item.icon}
            iconType={item.iconType || 'text'}
            isExternal={true}
            tags={item.tags}
            onTagClick={onTagClick}
          />
        ))
      )}
    </UnifiedGrid>
  );
}
