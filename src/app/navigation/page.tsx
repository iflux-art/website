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
  const [showAllTags, setShowAllTags] = useState(false);

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (categoryId?: string) => {
    try {
      const [navigationData, categoriesData] = await Promise.all([
        fetch('/api/navigation').then(res => res.json()),
        fetch('/api/navigation?type=categories').then(res => res.json()),
      ]);

      // 根据分类获取标签
      // 根据当前分类获取标签
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

      // 移除默认选择第一个分类的逻辑
      // if (categoriesData.length > 0) {
      //   setSelectedCategory(categoriesData[0].id);
      // }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // 过滤数据
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

  // 按使用数量排序标签并限制显示数量
  const sortedTags = allTags
    .map(tag => ({
      name: tag,
      count: items.filter(item => item.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.count - a.count);

  const visibleTags = showAllTags ? sortedTags : sortedTags.slice(0, 6);
  const hasMoreTags = sortedTags.length > 6;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">导航</h1>
        {/* 统计信息 */}
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
              “互换友链”
            </a>
          </p>
        )}
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
            {visibleTags.map(tagInfo => (
              <Badge
                key={tagInfo.name}
                variant={selectedTag === tagInfo.name ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleTagClick(tagInfo.name)}
              >
                {tagInfo.name} ({tagInfo.count})
              </Badge>
            ))}
            {hasMoreTags && (
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors text-muted-foreground"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags ? '收起' : `更多 (+${sortedTags.length - 6})`}
              </Badge>
            )}
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
    </div>
  );
}
