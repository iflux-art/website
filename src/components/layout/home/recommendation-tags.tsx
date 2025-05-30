'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MoreHorizontal } from 'lucide-react';
import { RECOMMENDATION_TAGS } from './constants';

const DynamicMoreRecommendationTags = dynamic(() =>
  import('./more-recommendation-tags').then((mod) => mod.MoreRecommendationTags)
);

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
    <div
      className={`flex flex-col items-center gap-2 mt-4 mb-4 max-w-3xl mx-auto ${className || ''}`}
    >
      {/* 第一行标签 */}
      <div className="flex items-center justify-center gap-2.5 overflow-x-auto scrollbar-hide pb-1 w-full max-w-full">
        <div className="flex items-center gap-2.5 px-1 md:px-0">
          {RECOMMENDATION_TAGS.initial.map((tag, index) => {
            const IconComponent = tag.icon;
            return (
              <Link href={tag.href} key={index} className="flex-shrink-0">
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent/30 hover:border-primary/20 transition-all text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
                  <IconComponent className="size-4" />
                  <span>{tag.text}</span>
                </div>
              </Link>
            );
          })}

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
      {showMoreTags && <DynamicMoreRecommendationTags />}
    </div>
  );
}
