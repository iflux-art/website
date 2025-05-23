'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Code,
  Palette,
  Lightbulb,
  Pencil,
  BookOpen,
  FileText,
  Compass,
  Github,
  MoreHorizontal,
} from 'lucide-react';

// 推荐标签数据
const initialTags = [
  { icon: <Code className="size-4" />, text: '网页开发', href: '/docs/web-development' },
  { icon: <Palette className="size-4" />, text: '深入研究', href: '/docs/research' },
  { icon: <Lightbulb className="size-4" />, text: '项目模式', href: '/docs/project-patterns' },
  { icon: <Pencil className="size-4" />, text: '图像生成', href: '/docs/image-generation' },
];

const moreTags = [
  { icon: <BookOpen className="size-4" />, text: '文档中心', href: '/docs' },
  { icon: <FileText className="size-4" />, text: '博客文章', href: '/blog' },
  { icon: <Compass className="size-4" />, text: '网址导航', href: '/navigation' },
  { icon: <Github className="size-4" />, text: 'GitHub', href: 'https://github.com/iflux-art/web' },
];

interface RecommendationTagsProps {
  className?: string;
}

/**
 * 推荐标签组件
 * 显示一行标签，点击"更多"可展开更多标签
 */
export function RecommendationTags({ className }: RecommendationTagsProps) {
  const [showMoreTags, setShowMoreTags] = useState(false);

  const toggleMoreTags = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMoreTags(!showMoreTags);
  };

  return (
    <div className={`flex flex-col items-center gap-2 mt-4 mb-4 max-w-3xl mx-auto ${className || ''}`}>
      {/* 第一行标签 */}
      <div className="flex items-center justify-center gap-2.5 overflow-x-auto scrollbar-hide pb-1 w-full max-w-full">
        <div className="flex items-center gap-2.5 px-1 md:px-0">
          {initialTags.map((tag, index) => (
            <Link href={tag.href} key={index} className="flex-shrink-0">
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/30 hover:border-primary/20 transition-all text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
                {tag.icon}
                <span>{tag.text}</span>
              </div>
            </Link>
          ))}

          {/* 更多按钮 */}
          <button
            onClick={toggleMoreTags}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/30 hover:border-primary/20 transition-all text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            <MoreHorizontal className="size-4" />
            <span>更多</span>
          </button>
        </div>
      </div>

      {/* 展开的更多标签 */}
      {showMoreTags && (
        <div className="flex flex-wrap justify-center gap-2.5 w-full animate-in fade-in slide-in-from-top-2 duration-300">
          {moreTags.map((tag, index) => (
            <Link href={tag.href} key={index}>
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/30 hover:border-primary/20 transition-all text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
                {tag.icon}
                <span>{tag.text}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
