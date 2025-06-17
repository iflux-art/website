import { UnifiedCard } from '@/components/common/cards/unified-card';
import { UnifiedGrid } from '@/components/layout/unified-grid';
import { LinksItem } from '@/types/links-types';

interface LinksGridProps {
  items: LinksItem[];
  onTagClick: (tag: string) => void;
  selectedCategory: string;
  selectedTag: string | null;
}

export function LinksGrid({ items, onTagClick, selectedCategory, selectedTag }: LinksGridProps) {
  return (
    <UnifiedGrid columns={5} className="items-stretch">
      {items.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">
            {selectedCategory || selectedTag ? '没有找到匹配的网址' : '暂无网址数据'}
          </p>
        </div>
      ) : (
        items.map((item) => (
          <UnifiedCard
            key={item.id}
            type="category"
            variant="compact"
            title={item.title}
            description={item.description || item.url}
            href={item.url}
            icon={item.icon}
            iconType={item.iconType === 'text' ? 'component' : item.iconType}
            isExternal={true}
            tags={item.tags}
            onTagClick={onTagClick}
            className="hover:border-primary/50 hover:bg-muted/50 h-full"
          />
        ))
      )}
    </UnifiedGrid>
  );
}
