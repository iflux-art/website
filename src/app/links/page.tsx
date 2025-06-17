'use client';

import React from 'react';
import { LinksHeader } from '@/components/layout/links/frontend/links-header';
import { LinksGrid } from '@/components/layout/links/frontend/links-grid';
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

      <LinksGrid
        items={filteredItems}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onTagClick={handleTagClick}
      />
    </div>
  );
}
