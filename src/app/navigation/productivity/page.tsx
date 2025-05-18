"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { slideUp } from "@/lib/animations";

export default function ProductivityToolsPage() {
  // 效率工具资源数据
  const productivityResources = [
    {
      title: "Notion",
      description: "集笔记、知识库、任务管理于一体的协作平台，提高团队协作效率",
      url: "https://www.notion.so",
      category: "全能工具",
      icon: "📝",
      author: "Notion Labs",
      free: true
    },
    {
      title: "Trello",
      description: "可视化项目管理工具，基于看板方法组织任务和工作流程",
      url: "https://trello.com",
      category: "项目管理",
      icon: "📋",
      author: "Atlassian",
      free: true
    },
    {
      title: "Todoist",
      description: "简洁高效的任务管理应用，帮助用户组织日常工作和生活",
      url: "https://todoist.com",
      category: "任务管理",
      icon: "✅",
      author: "Doist",
      free: true
    },
    {
      title: "Obsidian",
      description: "基于本地Markdown文件的知识库工具，支持双向链接和图谱可视化",
      url: "https://obsidian.md",
      category: "知识管理",
      icon: "🧠",
      author: "Obsidian",
      free: true
    },
    {
      title: "Grammarly",
      description: "AI驱动的写作助手，提供拼写、语法检查和写作建议",
      url: "https://www.grammarly.com",
      category: "写作工具",
      icon: "✍️",
      author: "Grammarly, Inc.",
      free: true
    },
    {
      title: "Calendly",
      description: "智能日程安排工具，简化会议预约流程，避免来回邮件沟通",
      url: "https://calendly.com",
      category: "日程管理",
      icon: "📅",
      author: "Calendly LLC",
      free: true
    }
  ];

  // 获取所有分类
  const categories = [...new Set(productivityResources.map(resource => resource.category))];
  
  // 状态管理
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  // 根据选中的分类筛选资源
  const filteredResources = selectedCategory
    ? productivityResources.filter(resource => resource.category === selectedCategory)
    : productivityResources;

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/navigation" className="flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回导航
        </Link>
        <h1 className="text-3xl font-bold mb-4">效率工具</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          探索提高工作效率的应用和服务，包括任务管理、笔记工具、协作平台和自动化工具等。
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