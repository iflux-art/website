"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { ResourceFilter } from "@/components/features/navigation/resource-filter";
import { ResourceList } from "@/components/features/navigation/resource-list";
import { designResources } from "@/data/navigation/design";

export default function DesignResourcesPage() {

  // 获取所有分类
  const categories = [...new Set(designResources.map(resource => resource.category))];
  
  // 状态管理
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  // 根据选中的分类筛选资源
  const filteredResources = selectedCategory
    ? designResources.filter(resource => resource.category === selectedCategory)
    : designResources;

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/navigation" className="flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回导航
        </Link>
        <h1 className="text-3xl font-bold mb-4">设计资源</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          探索UI/UX设计工具和资源，包括设计软件、灵感来源、素材库和配色工具等。
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

// 资源卡片组件
interface Resource {
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  author: string;
  free: boolean;
}

function ResourceCard({ resource, index }: { resource: Resource, index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      variants={slideUp}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      transition={{ delay: index * 0.1 }}
    >
      <a href={resource.url} target="_blank" rel="noopener noreferrer">
        <Card className="h-full hover:shadow-md transition-all hover:border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {resource.icon && (
                  <span className="text-2xl mr-2">{resource.icon}</span>
                )}
                <h3 className="text-lg font-semibold">{resource.title}</h3>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-muted">{resource.category}</span>
            </div>
            <p className="text-muted-foreground mb-4">{resource.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{resource.author}</span>
              {resource.free ? (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  免费
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                  付费
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}