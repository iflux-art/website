'use client';

import React from 'react';
import { NavigationHeader } from '@/components/features/navigation/navigation-header';
import { NavigationGrid } from '@/components/features/navigation/navigation-grid';
import { UnifiedFilter } from '@/components/layout/filter/unified-filter';
import { useNavigationData } from '@/components/features/navigation/hooks/use-navigation-data';
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
    getCategoryName
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