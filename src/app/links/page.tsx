"use client";

import React from "react";
import type { LinksHeaderProps } from "@/types/links-types";
import { FRIEND_LINK_FORM_URL } from "@/config/links";

function LinksHeader({
  totalItems,
  filteredCount,
  selectedCategory,
  selectedTag,
  getCategoryName,
}: LinksHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">网址</h1>
      {selectedCategory || selectedTag ? (
        <p className="text-muted-foreground">
          显示 {filteredCount} 个网址
          {selectedCategory && ` · ${getCategoryName(selectedCategory)}`}
          {selectedTag && ` · ${selectedTag}`}
        </p>
      ) : (
        <p className="text-muted-foreground">
          共收录 {totalItems} 个优质网站，欢迎
          <a href={FRIEND_LINK_FORM_URL} target="_blank" rel="noreferrer">
            互换友链
          </a>
        </p>
      )}
    </div>
  );
}
import { AppGrid } from "@/components/layout/app-grid";
import { LinkCard } from "@/components/common/card/link-card";
import { UnifiedFilter } from "@/components/common/filter/unified-filter";
import { useLinksData } from "@/hooks";
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

  if (!items.length) return null;
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
        categories={categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: undefined, // LinksCategory 的 icon 是 string，不是 LucideIcon
        }))}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryClick}
        tags={sortedTags}
        selectedTag={selectedTag}
        onTagChange={handleTagClick}
        onCardTagClick={handleTagClick}
        categoryButtonClassName="rounded-full"
        className="mb-6"
      />

      <AppGrid columns={5} className="items-stretch">
        {filteredItems.map((item) => (
          <LinkCard
            key={item.id}
            title={item.title}
            description={item.description || item.url}
            href={item.url}
            icon={item.icon}
            iconType={item.iconType as "image" | "text" | undefined}
            isExternal={true}
            className="h-full"
          />
        ))}
      </AppGrid>
    </div>
  );
}
