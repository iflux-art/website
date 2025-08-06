"use client";

import React from "react";
// 内联 LinksHeaderProps 类型定义
interface LinksHeaderProps {
  totalItems: number;
  filteredCount: number;
  selectedCategory?: string;
  selectedTag?: string | null;
  getCategoryName: (categoryId: string) => string;
}
// Friend link form URL removed as it's not currently used

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
        <p className="text-muted-foreground">共收录 {totalItems} 个优质网站</p>
      )}
    </div>
  );
}
import { AppGrid } from "@/components/layout/app-grid";
import { LinkCard } from "@/components/card/link-card";
import { UnifiedFilter } from "@/components/layout/unified-filter";
import { useLinksData } from "@/hooks/use-links-data";
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

  // 过滤掉友链和个人主页分类的项目
  const filteredNavItems = filteredItems.filter(
    (item) => item.category !== "friends" && item.category !== "profile",
  );
  // 过滤掉友链和个人主页分类
  const filteredNavCategories = categories.filter(
    (cat) => cat.id !== "friends" && cat.id !== "profile",
  );

  if (!items.length) return null;
  return (
    <div className="container mx-auto py-8">
      <LinksHeader
        filteredCount={filteredNavItems.length}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        totalItems={
          items.filter(
            (item) =>
              item.category !== "friends" && item.category !== "profile",
          ).length
        }
        getCategoryName={getCategoryName}
      />

      <UnifiedFilter
        categories={filteredNavCategories.map((cat) => ({
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
        {filteredNavItems.map((item) => (
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
