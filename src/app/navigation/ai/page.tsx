"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { slideUp } from "@/lib/animations";

export default function AIToolsPage() {
  // AI工具资源数据
  const aiResources = [
    {
      title: "ChatGPT",
      description: "OpenAI开发的强大AI对话模型，可用于文本生成、问答和创意写作",
      url: "https://chat.openai.com",
      category: "AI对话",
      icon: "🤖",
      author: "OpenAI",
      free: true
    },
    {
      title: "Midjourney",
      description: "AI图像生成工具，可创建高质量艺术图像和概念设计",
      url: "https://www.midjourney.com",
      category: "图像生成",
      icon: "🖼️",
      author: "Midjourney, Inc.",
      free: false
    },
    {
      title: "Runway ML",
      description: "创意AI工具集，支持视频编辑、图像生成和风格迁移",
      url: "https://runwayml.com",
      category: "创意AI",
      icon: "🎬",
      author: "Runway AI, Inc.",
      free: false
    },
    {
      title: "Hugging Face",
      description: "开源AI社区和平台，提供数千个预训练模型和数据集",
      url: "https://huggingface.co",
      category: "AI开发",
      icon: "🤗",
      author: "Hugging Face",
      free: true
    },
    {
      title: "Perplexity AI",
      description: "AI搜索引擎，提供准确的信息和引用来源",
      url: "https://www.perplexity.ai",
      category: "AI搜索",
      icon: "🔍",
      author: "Perplexity AI",
      free: true
    },
    {
      title: "Anthropic Claude",
      description: "先进的AI助手，专注于有帮助、诚实和无害的回答",
      url: "https://www.anthropic.com/claude",
      category: "AI对话",
      icon: "💬",
      author: "Anthropic",
      free: true
    }
  ];

  // 获取所有分类
  const categories = [...new Set(aiResources.map(resource => resource.category))];
  
  // 状态管理
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  // 根据选中的分类筛选资源
  const filteredResources = selectedCategory
    ? aiResources.filter(resource => resource.category === selectedCategory)
    : aiResources;

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <Link href="/navigation" className="flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回导航
        </Link>
        <h1 className="text-3xl font-bold mb-4">AI工具</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          探索人工智能和机器学习相关工具，包括AI对话模型、图像生成、语音识别等智能应用。
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