'use client';

import React from 'react';
import { NavigationHeader } from '@/components/layout/navigation/frontend/navigation-header';
import { NavigationGrid } from '@/components/layout/navigation/frontend/navigation-grid';
import { UnifiedFilter } from '@/components/common/filter/unified-filter';
import { useNavigationData } from '@/components/layout/navigation/frontend/use-navigation-data';
export default function NavigationPage() {
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
  } = useNavigationData();
  return (
    <div className="container mx-auto px-4 py-8">
      <NavigationHeader
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

      <NavigationGrid
        items={filteredItems}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        onTagClick={handleTagClick}
      />
    </div>
  );
}
