'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import * as Icons from 'lucide-react';
import { ArrowLeft, ExternalLink, Search, Filter, Globe } from 'lucide-react';
import { getTagColorClasses } from '@/lib/color-utils';

interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  tags?: string[];
  featured?: boolean;
}

interface SubcategoryData {
  id: string;
  title: string;
  description: string;
  links: LinkItem[];
}

interface CategoryData {
  id: string;
  title: string;
  description: string;
  subcategories: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [subcategoriesData, setSubcategoriesData] = useState<SubcategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 筛选状态
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [faviconCache, setFaviconCache] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        // 使用 API 获取分类数据
        const response = await fetch(`/api/navigation/category-data/${category}`);

        if (!response.ok) {
          throw new Error(`获取分类数据失败: ${response.status}`);
        }

        const data = await response.json();

        // 添加调试日志
        console.log('API 响应数据:', data);
        console.log('子分类数量:', data.subcategories.length);
        console.log(
          '链接总数:',
          data.subcategories.reduce((total: number, sub: any) => total + sub.links.length, 0)
        );

        // 设置分类数据
        setCategoryData(data.category);

        // 设置子分类数据
        setSubcategoriesData(data.subcategories);

        // 收集所有标签
        const allTagsSet = new Set<string>();
        data.subcategories.forEach((subcategory: any) => {
          subcategory.links.forEach((link: any) => {
            if (link.tags) {
              link.tags.forEach((tag: string) => allTagsSet.add(tag));
            }
          });
        });

        setAllTags(Array.from(allTagsSet).sort());
      } catch (err) {
        console.error('加载分类数据失败:', err);
        setError('无法加载该分类数据');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [category]);

  // 获取网站图标
  const getFavicon = async (url: string) => {
    if (faviconCache[url]) {
      return faviconCache[url];
    }

    try {
      const response = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('获取图标失败');
      }

      const data = await response.json();
      setFaviconCache(prev => ({ ...prev, [url]: data.faviconUrl }));
      return data.faviconUrl;
    } catch (error) {
      console.error('获取网站图标失败:', error);
      return null;
    }
  };

  // 加载网站图标
  useEffect(() => {
    if (!loading && subcategoriesData.length > 0) {
      subcategoriesData.forEach(subcategory => {
        subcategory.links.forEach(link => {
          getFavicon(link.url);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, subcategoriesData]);

  // 筛选链接
  const filteredLinks = React.useMemo(() => {
    if (!subcategoriesData.length) return [];

    let links: (LinkItem & { subcategory: string })[] = [];

    // 收集所有链接
    subcategoriesData.forEach(subcategory => {
      console.log(`子分类 ${subcategory.title} 的链接数量:`, subcategory.links?.length || 0);
      console.log(`子分类 ${subcategory.title} 的链接:`, JSON.stringify(subcategory.links));

      if (subcategory.links && Array.isArray(subcategory.links)) {
        subcategory.links.forEach(link => {
          links.push({
            ...link,
            subcategory: subcategory.title,
          });
        });
      }
    });

    console.log('收集到的链接总数:', links.length);
    console.log('收集到的链接:', JSON.stringify(links));

    // 按子分类筛选
    if (activeTab !== 'all') {
      links = links.filter(link => {
        const subcategory = subcategoriesData.find(sub => sub.title === activeTab);
        return subcategory && link.subcategory === subcategory.title;
      });
    }

    // 按搜索词筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      links = links.filter(
        link =>
          link.title.toLowerCase().includes(query) ||
          link.description.toLowerCase().includes(query) ||
          (link.tags &&
            Array.isArray(link.tags) &&
            link.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // 按标签筛选
    if (selectedTags.length > 0) {
      links = links.filter(
        link =>
          link.tags &&
          Array.isArray(link.tags) &&
          selectedTags.every(tag => link.tags!.includes(tag))
      );
    }

    // 特色链接排在前面
    return links.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [subcategoriesData, activeTab, searchQuery, selectedTags]);

  // 加载状态
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center space-x-2 mb-8">
          <Link
            href="/navigation"
            className="text-sm text-muted-foreground hover:text-primary flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回导航首页
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
          <div className="h-10 bg-muted rounded w-full mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !categoryData) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link
          href="/navigation"
          className="text-sm text-muted-foreground hover:text-primary flex items-center"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          返回导航首页
        </Link>
        <h1 className="text-3xl font-bold mt-2">{categoryData.title}</h1>
        <p className="text-muted-foreground">{categoryData.description}</p>
      </div>

      {/* 筛选工具栏 */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索资源..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">标签:</span>
            <div className="flex flex-wrap gap-1">
              {allTags.slice(0, 5).map(tag => (
                <div
                  key={tag}
                  className={`text-xs px-2 py-1 rounded-md cursor-pointer border ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-primary-foreground border-primary/50'
                      : getTagColorClasses(
                          tag.toLowerCase().includes('react')
                            ? 'blue'
                            : tag.toLowerCase().includes('vue')
                            ? 'green'
                            : tag.toLowerCase().includes('angular')
                            ? 'red'
                            : tag.toLowerCase().includes('design')
                            ? 'purple'
                            : 'default'
                        )
                  }`}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                >
                  {tag}
                </div>
              ))}
              {allTags.length > 5 && (
                <div className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                  +{allTags.length - 5}
                </div>
              )}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-sm text-muted-foreground mr-1">已选标签:</span>
              {selectedTags.map(tag => (
                <div
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-primary text-primary-foreground border border-primary/50"
                >
                  {tag}
                  <span
                    className="cursor-pointer ml-1"
                    onClick={() => {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    }}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 子分类标签页 */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            {subcategoriesData.map(subcategory => (
              <TabsTrigger key={subcategory.id} value={subcategory.title}>
                {subcategory.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 链接列表 */}
      {filteredLinks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredLinks.map((link, index) => {
            const favicon = faviconCache[link.url];

            return (
              <a
                key={`${link.subcategory}-${link.id || index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card
                  className={`h-full hover:shadow-md transition-shadow ${
                    link.featured ? 'border-2 border-primary/20' : ''
                  }`}
                >
                  <CardHeader className="pb-2 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {favicon ? (
                        <div className="w-6 h-6 flex-shrink-0">
                          <Image
                            src={favicon}
                            alt={`${link.title} 图标`}
                            width={24}
                            height={24}
                            className="rounded-sm"
                          />
                        </div>
                      ) : (
                        <Globe className="w-5 h-5 text-muted-foreground" />
                      )}
                      <CardTitle className="text-base flex items-center gap-1 truncate">
                        {link.title}
                        <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  {link.tags && Array.isArray(link.tags) && link.tags.length > 0 && (
                    <CardContent className="pt-0 p-4">
                      <div className="flex flex-wrap gap-1">
                        <div className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground mr-1">
                          {link.subcategory}
                        </div>
                        {link.tags.slice(0, 2).map((tag, tagIndex) => {
                          // 根据标签名称选择颜色
                          const tagColor = tag.toLowerCase().includes('react')
                            ? 'blue'
                            : tag.toLowerCase().includes('vue')
                            ? 'green'
                            : tag.toLowerCase().includes('angular')
                            ? 'red'
                            : tag.toLowerCase().includes('design')
                            ? 'purple'
                            : 'default';

                          return (
                            <div
                              key={`${tag}-${tagIndex}`}
                              className={`text-xs px-2 py-1 rounded-md border ${
                                selectedTags.includes(tag)
                                  ? 'bg-primary/10 border-primary/30 text-primary-foreground'
                                  : getTagColorClasses(tagColor)
                              }`}
                            >
                              {tag}
                            </div>
                          );
                        })}
                        {link.tags.length > 2 && (
                          <div className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                            +{link.tags.length - 2}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">没有找到符合条件的资源</p>
        </div>
      )}
    </div>
  );
}
