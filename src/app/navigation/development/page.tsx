"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { slideUp } from "@/lib/animations";

export default function DevelopmentToolsPage() {
  // 开发工具资源数据
  const developmentResources = [
    {
      title: "VS Code",
      description: "微软开发的轻量级代码编辑器，拥有丰富的插件生态系统",
      url: "https://code.visualstudio.com",
      category: "编辑器",
      icon: "💻",
      author: "Microsoft",
      free: true
    },
    {
      title: "GitHub",
      description: "代码托管和协作平台，支持Git版本控制和项目管理",
      url: "https://github.com",
      category: "版本控制",
      icon: "🐙",
      author: "GitHub, Inc.",
      free: true
    },
    {
      title: "Vercel",
      description: "前端应用部署平台，支持Next.js等框架的自动部署和预览",
      url: "https://vercel.com",
      category: "部署",
      icon: "🚀",
      author: "Vercel, Inc.",
      free: true
    },
    {
      title: "Stack Overflow",
      description: "程序员问答社区，解决编程问题的最大资源库",
      url: "https://stackoverflow.com",
      category: "社区",
      icon: "❓",
      author: "Stack Exchange Inc.",
      free: true
    },
    {
      title: "MDN Web Docs",
      description: "Web技术文档库，提供HTML、CSS和JavaScript等详细参考资料",
      url: "https://developer.mozilla.org",
      category: "文档",
      icon: "📚",
      author: "Mozilla",
      free: true
    },
    {
      title: "CodePen",
      description: "在线代码编辑器和社区，用于测试和展示HTML、CSS和JavaScript代码片段",
      url: "https://codepen.io",
      category: "工具",
      icon: "✏️",
      author: "CodePen",
      free: true
    }
  ];

  // 获取所有分类
  const categories = [...new Set(developmentResources.map(resource => resource.category))];
  
  // 状态管理
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  // 根据选中的分类筛选资源
  const filteredResources = selectedCategory
    ? developmentResources.filter(resource => resource.category === selectedCategory)
    : developmentResources;

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/navigation" className="flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回导航
        </Link>
        <h1 className="text-3xl font-bold mb-4">开发工具</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          探索编程和开发相关工具，包括代码编辑器、版本控制、部署平台和开发文档等资源。
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