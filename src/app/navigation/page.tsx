'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavigationCard } from '@/components/cards/navigation-card';
import { NavigationItem, NavigationCategory } from '@/types/navigation';

export default function NavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [navigationData, categoriesData, tagsData] = await Promise.all([
        fetch('/api/navigation').then(res => res.json()),
        fetch('/api/navigation?type=categories').then(res => res.json()),
        fetch('/api/navigation?type=tags').then(res => res.json()),
      ]);

      setItems(navigationData.items || []);
      setCategories(categoriesData || []);
      setAllTags(tagsData || []);

      // 默认选择第一个分类
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 过滤数据
  const filteredItems = items.filter(item => {
    const categoryMatch = !selectedCategory || item.category === selectedCategory;
    const tagMatch = !selectedTag || item.tags.includes(selectedTag);
    return categoryMatch && tagMatch;
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTag(null); // 切换分类时清除标签筛选
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">导航</h1>
        <p className="text-muted-foreground">精选的网站和工具集合，帮助你提高效率</p>
      </div>

      {/* 分类选择 */}
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

      {/* 标签筛选 */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-muted-foreground">按标签筛选</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 网址卡片网格 */}
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

      {/* 统计信息 */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        {selectedCategory || selectedTag ? (
          <p>
            显示 {filteredItems.length} 个网址
            {selectedCategory && ` · ${getCategoryName(selectedCategory)}`}
            {selectedTag && ` · ${selectedTag}`}
          </p>
        ) : (
          <p>共收录 {items.length} 个优质网址</p>
        )}
      </div>
    </div>
  );
}
