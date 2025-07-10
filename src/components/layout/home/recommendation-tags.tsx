"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { RECOMMENDATION_TAGS } from "@/data/home/recommendation-tags";
import type { RecommendationTagsProps } from "@/types/home-types";

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
      className={`mx-auto mt-4 mb-4 flex max-w-3xl flex-col items-center gap-2 ${className || ""}`}
    >
      {/* 第一行标签 */}
      <div className="scrollbar-hide flex w-full max-w-full items-center justify-center gap-2.5 overflow-x-auto pb-1">
        <div className="flex items-center gap-2.5 px-1 md:px-0">
          {RECOMMENDATION_TAGS.initial.map((tag, index) => {
            const IconComponent = tag.icon;
            return (
              <Link
                href={tag.href}
                key={index}
                className="flex-shrink-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/80 px-3.5 py-2 text-sm whitespace-nowrap text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-accent/30 hover:text-foreground">
                  <IconComponent className="size-4" />
                  <span>{tag.text}</span>
                </div>
              </Link>
            );
          })}

          {/* 更多按钮 */}
          <button
            onClick={toggleMoreTags}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-md border border-border/50 bg-background/80 px-3.5 py-2 text-sm whitespace-nowrap text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-accent/30 hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
            <span>更多</span>
          </button>
        </div>
      </div>

      {/* 展开的更多标签 */}
      {showMoreTags && (
        <div className="animate-in fade-in slide-in-from-top-2 flex w-full flex-wrap justify-center gap-2.5 duration-300">
          {RECOMMENDATION_TAGS.more.map((tag, index) => {
            const IconComponent = tag.icon;
            return (
              <Link href={tag.href} key={index}>
                <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/80 px-3.5 py-2 text-sm whitespace-nowrap text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-accent/30 hover:text-foreground">
                  <IconComponent className="size-4" />
                  <span>{tag.text}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
