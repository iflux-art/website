"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fadeIn, slideUp } from "@/lib/animations";
import {
  useNavigationCategories,
  useFeaturedResources,
  useRecentResources
} from "@/hooks/use-navigation";
import { Category, Resource } from "@/types/navigation";


export default function NavigationPage() {

  // 动画效果
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // 获取导航数据
  const { categories, loading: categoriesLoading } = useNavigationCategories();
  const { resources: featuredResources, loading: featuredLoading } = useFeaturedResources();
  const { resources: recentResources, loading: recentLoading } = useRecentResources();

  // 加载状态
  const isLoading = categoriesLoading || featuredLoading || recentLoading;

  // 加载状态显示
  if (isLoading) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">网站导航</h1>

        {/* 加载状态 */}
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-6">精选资源</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-6">最新添加</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">网站导航</h1>

      {/* 分类导航 */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))
        ) : (
          <p className="col-span-4 text-center text-muted-foreground">暂无分类数据</p>
        )}
      </motion.div>

      {/* 精选资源 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">精选资源</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredResources && featuredResources.length > 0 ? (
            featuredResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} index={index} />
            ))
          ) : (
            <p className="col-span-3 text-center text-muted-foreground">暂无精选资源</p>
          )}
        </div>
      </section>

      {/* 最新添加 */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">最新添加</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentResources && recentResources.length > 0 ? (
            recentResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} index={index} />
            ))
          ) : (
            <p className="col-span-3 text-center text-muted-foreground">暂无最新资源</p>
          )}
        </div>
      </section>
    </main>
  );
}

/**
 * 分类卡片组件属性
 *
 * @interface CategoryCardProps
 */
interface CategoryCardProps {
  /**
   * 分类数据
   */
  category: Category;
}

/**
 * 分类卡片组件
 *
 * 用于显示导航页面中的分类卡片，包括图标、标题和描述
 *
 * @param {CategoryCardProps} props - 组件属性
 * @returns {JSX.Element} 分类卡片组件
 */
function CategoryCard({ category }: CategoryCardProps) {
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeIn}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/navigation/${category.id}`}>
        <Card className={`h-full border-2 hover:border-primary transition-colors overflow-hidden`}>
          <CardContent className={`p-6 ${category.color}`}>
            <div className="text-4xl mb-4">{category.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
            <p className="text-muted-foreground">{category.description}</p>
          </CardContent>
          <CardFooter className="p-4 flex justify-end">
            <div className="flex items-center text-sm font-medium">
              浏览
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

// 导入资源卡片组件
import { ResourceCard } from "@/components/features/navigation";