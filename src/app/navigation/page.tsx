"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fadeIn, slideUp } from "@/lib/animations";

export default function NavigationPage() {
  // 导航分类数据
  const navigationCategories = [
    { 
      id: 'ai', 
      title: 'AI工具',
      description: '人工智能和机器学习相关工具',
      icon: '🤖',
      color: 'bg-blue-100 dark:bg-blue-950'
    },
    { 
      id: 'design', 
      title: '设计资源',
      description: 'UI/UX设计工具和资源',
      icon: '🎨',
      color: 'bg-purple-100 dark:bg-purple-950'
    },
    { 
      id: 'development', 
      title: '开发工具',
      description: '编程和开发相关工具',
      icon: '💻',
      color: 'bg-green-100 dark:bg-green-950'
    },
    { 
      id: 'productivity', 
      title: '效率工具',
      description: '提高工作效率的应用和服务',
      icon: '⚡',
      color: 'bg-yellow-100 dark:bg-yellow-950'
    }
  ];

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
        {navigationCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </motion.div>

      {/* 精选资源 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">精选资源</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFeaturedResources().map((resource, index) => (
            <ResourceCard key={index} resource={resource} index={index} />
          ))}
        </div>
      </section>

      {/* 最新添加 */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">最新添加</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getRecentResources().map((resource, index) => (
            <ResourceCard key={index} resource={resource} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}

// 分类卡片组件
interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

function CategoryCard({ category }: { category: Category }) {
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      variants={fadeIn}
      whileHover={{ scale: 1.03 }}
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
  const { ref, inView } = useInView({
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
              {resource.free && (
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  免费
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}

// 获取精选资源
function getFeaturedResources() {
  return [
    {
      title: "Figma",
      description: "专业的在线设计工具，支持协作和原型设计",
      url: "https://www.figma.com",
      category: "设计",
      icon: "🎨",
      author: "Figma, Inc.",
      free: true
    },
    {
      title: "ChatGPT",
      description: "OpenAI开发的强大AI对话模型",
      url: "https://chat.openai.com",
      category: "AI",
      icon: "🤖",
      author: "OpenAI",
      free: true
    },
    {
      title: "VS Code",
      description: "微软开发的轻量级代码编辑器",
      url: "https://code.visualstudio.com",
      category: "开发",
      icon: "💻",
      author: "Microsoft",
      free: true
    }
  ];
}

// 获取最新资源
function getRecentResources() {
  return [
    {
      title: "Notion",
      description: "集笔记、知识库、任务管理于一体的协作平台",
      url: "https://www.notion.so",
      category: "效率",
      icon: "📝",
      author: "Notion Labs",
      free: true
    },
    {
      title: "Midjourney",
      description: "AI图像生成工具，可创建高质量艺术图像",
      url: "https://www.midjourney.com",
      category: "AI",
      icon: "🖼️",
      author: "Midjourney, Inc.",
      free: false
    },
    {
      title: "Vercel",
      description: "前端应用部署平台，支持Next.js等框架",
      url: "https://vercel.com",
      category: "开发",
      icon: "🚀",
      author: "Vercel, Inc.",
      free: true
    }
  ];
}