"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { slideUp } from "@/lib/animations";

export default function DesignResourcesPage() {
  // 设计资源数据
  const designResources = [
    {
      title: "Figma",
      description: "专业的在线设计工具，支持协作和原型设计，是UI/UX设计师的首选工具",
      url: "https://www.figma.com",
      category: "设计工具",
      icon: "🎨",
      author: "Figma, Inc.",
      free: true
    },
    {
      title: "Dribbble",
      description: "设计师社区平台，展示UI、插画、网页和移动应用设计作品",
      url: "https://dribbble.com",
      category: "设计灵感",
      icon: "🏀",
      author: "Dribbble LLC",
      free: true
    },
    {
      title: "Behance",
      description: "创意作品展示平台，包含各类设计项目和创意作品集",
      url: "https://www.behance.net",
      category: "作品集",
      icon: "🎭",
      author: "Adobe",
      free: true
    },
    {
      title: "Coolors",
      description: "色彩搭配生成工具，帮助设计师快速创建和探索配色方案",
      url: "https://coolors.co",
      category: "配色工具",
      icon: "🎨",
      author: "Coolors",
      free: true
    },
    {
      title: "Unsplash",
      description: "免费高质量图片资源网站，提供可商用的摄影作品",
      url: "https://unsplash.com",
      category: "图片资源",
      icon: "📷",
      author: "Unsplash Inc.",
      free: true
    },
    {
      title: "Adobe Creative Cloud",
      description: "专业创意设计软件套件，包含Photoshop、Illustrator等工具",
      url: "https://www.adobe.com/creativecloud.html",
      category: "设计软件",
      icon: "🖌️",
      author: "Adobe Inc.",
      free: false
    }
  ];

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
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">按分类筛选</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-primary/10 hover:text-primary'}`}
          >
            全部
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-primary/10 hover:text-primary'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 资源列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => (
          <ResourceCard key={index} resource={resource} index={index} />
        ))}
      </div>
      
      {/* 无结果提示 */}
      {filteredResources.length === 0 && (
        <div className="text-center py-10">
          <p>没有找到相关资源</p>
        </div>
      )}
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