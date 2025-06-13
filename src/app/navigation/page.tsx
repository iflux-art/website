'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { NavigationCard } from '@/components/cards/navigation-card';
import { NavigationItem, NavigationCategory } from '@/types/navigation';
import { TagFilter } from '@/components/ui/tag-filter';

export default function NavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagsExpanded, setTagsExpanded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (categoryId?: string) => {
    try {
      const [navigationData, categoriesData] = await Promise.all([
        fetch('/api/navigation').then(res => res.json()),
        fetch('/api/navigation?type=categories').then(res => res.json()),
      ]);

      const tagsResponse = await fetch(
        `/api/navigation?type=tags${categoryId ? `&category=${categoryId}` : ''}`
      );
      const tagsData = await tagsResponse.json();

      setItems(navigationData.items || []);
      setCategories(categoriesData || []);
      setAllTags(
        categoryId
          ? tagsData.filter((tag: string) =>
              navigationData.items.some(
                (item: NavigationItem) => item.category === categoryId && item.tags.includes(tag)
              )
            )
          : tagsData || []
      );
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const categoryMatch = !selectedCategory || item.category === selectedCategory;
    const tagMatch = !selectedTag || item.tags.includes(selectedTag);
    return categoryMatch && tagMatch;
  });

  const handleCategoryClick = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTag(null);
    try {
      await loadData(categoryId);
    } catch (error) {
      console.error('加载分类数据时出错:', error);
    }
  };

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const sortedTags = allTags
    .map(tag => ({
      name: tag,
      count: items.filter(item => item.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">导航</h1>
        {selectedCategory || selectedTag ? (
          <p>
            显示 {filteredItems.length} 个网址
            {selectedCategory && ` · ${getCategoryName(selectedCategory)}`}
            {selectedTag && ` · ${selectedTag}`}
          </p>
        ) : (
          <p className="text-muted-foreground">
            共收录 {items.length} 个优质网站，欢迎
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

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => handleCategoryClick('')}
            className="rounded-full"
          >
            全部
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => handleCategoryClick(category.id)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {allTags.length > 0 && (
        <TagFilter
          tags={sortedTags}
          selectedTag={selectedTag}
          onTagSelectAction={handleTagClick}
          showCount={true}
          maxVisible={8}
          className="mb-6"
          expanded={tagsExpanded}
          onExpandChange={setTagsExpanded}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              {selectedCategory || selectedTag ? '没有找到匹配的网址' : '暂无网址数据'}
            </p>
          </div>
        ) : (
          filteredItems.map(item => (
            <NavigationCard
              key={item.id}
              title={item.title}
              description={item.description}
              url={item.url}
              icon={item.icon}
              iconType={item.iconType}
              featured={item.featured}
            />
          ))
        )}
      </div>
    </div>
  );
}
