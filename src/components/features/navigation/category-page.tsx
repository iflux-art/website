"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ResourceFilter } from "./resource-filter";
import { ResourceList } from "./resource-list";
import { useCategoryResources, useCategoryDetails } from "@/hooks/use-navigation";

/**
 * 导航分类页面组件属性
 * 
 * @interface CategoryPageProps
 */
interface CategoryPageProps {
  /**
   * 分类ID
   */
  categoryId: string;
}

/**
 * 导航分类页面组件
 * 
 * 用于显示特定分类的资源列表，包括标题、描述、分类筛选和资源列表
 * 
 * @param {CategoryPageProps} props - 组件属性
 * @returns {JSX.Element} 导航分类页面组件
 * 
 * @example
 * ```tsx
 * <CategoryPage categoryId="development" />
 * ```
 */
export function CategoryPage({ categoryId }: CategoryPageProps) {
  // 获取分类详情
  const categoryDetails = useCategoryDetails(categoryId);
  
  // 获取分类资源和筛选状态
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    filteredResources
  } = useCategoryResources(categoryId);
  
  // 如果找不到分类详情，显示错误信息
  if (!categoryDetails) {
    return (
      <main className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <Link href="/navigation" className="flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回导航
          </Link>
          <h1 className="text-3xl font-bold mb-4">分类不存在</h1>
          <p className="text-muted-foreground max-w-3xl mb-8">
            抱歉，找不到该分类的信息。
          </p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/navigation" className="flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回导航
        </Link>
        <h1 className="text-3xl font-bold mb-4">{categoryDetails.title}</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          {categoryDetails.description}
        </p>
      </div>
      
      {/* 分类筛选 */}
      <ResourceFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 资源列表 */}
      <ResourceList resources={filteredResources} />
    </main>
  );
}
