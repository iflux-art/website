'use client';

import React from 'react';

interface LinksHeaderProps {
  totalItems: number;
  filteredCount: number;
  selectedCategory?: string;
  selectedTag?: string | null;
  getCategoryName: (categoryId: string) => string;
}

function LinksHeader({
  totalItems,
  filteredCount,
  selectedCategory,
  selectedTag,
  getCategoryName,
}: LinksHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">网址</h1>
      {selectedCategory || selectedTag ? (
        <p className="text-muted-foreground">
          显示 {filteredCount} 个网址
          {selectedCategory && ` · ${getCategoryName(selectedCategory)}`}
          {selectedTag && ` · ${selectedTag}`}
        </p>
      ) : (
        <p className="text-muted-foreground">
          共收录 {totalItems} 个优质网站，欢迎
          <a
            href="https://ocnzi0a8y98s.feishu.cn/share/base/form/shrcnB0sog9RdZVM8FLJNXVsFFb"
            target="_blank"
            rel="noreferrer"
          >
            互换友链
          </a>
        </p>
      )}
    </div>
  );
}
import { UnifiedGrid } from '@/components/layout/unified-grid';
import { UnifiedCard } from '@/components/common/unified-card';
import { UnifiedFilter } from '@/components/common/filter/unified-filter';
import { useLinksData } from '@/hooks/use-links-data';
export default function LinksPage() {
  const {
    items,
    categories,
    selectedCategory,
    selectedTag,
    filteredItems,
    sortedTags,
    handleCategoryClick,
    handleTagClick,
    getCategoryName,
  } = useLinksData();
  return (
    <div className="container mx-auto px-4 py-8">
      <LinksHeader
        filteredCount={filteredItems.length}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        totalItems={items.length}
        getCategoryName={getCategoryName}
      />

      <UnifiedFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryClick}
        tags={sortedTags}
        selectedTag={selectedTag}
        onTagChange={handleTagClick}
        onCardTagClick={handleTagClick}
        categoryButtonClassName="rounded-full"
        className="mb-6"
      />

      <UnifiedGrid columns={5} className="items-stretch">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {selectedCategory || selectedTag ? '没有找到匹配的网址' : '暂无网址数据'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
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
              onTagClick={handleTagClick}
              className="h-full"
            />
          ))
        )}
      </UnifiedGrid>
    </div>
  );
}
