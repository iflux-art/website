"use client";

import React, { useEffect, useRef, useState } from "react";
import { TableOfContentsClientWrapper } from "./toc-client-wrapper";
import { AdvertisementCard } from "../advertisement-card";
import { cn } from "@/lib/utils";

interface AdaptiveSidebarProps {
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;
  className?: string;
}

/**
 * 自适应侧边栏组件
 * 
 * 根据目录内容的高度动态调整广告卡片的位置：
 * - 当目录内容较短时，广告卡片直接跟随在目录下方
 * - 当目录内容即将超出视口高度时，广告卡片固定在右下角
 * 
 * @param props 组件属性
 * @returns 侧边栏组件
 */
export function AdaptiveSidebar({ headings, className }: AdaptiveSidebarProps) {
  const tocRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [tocHeight, setTocHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // 检测目录高度和视口高度
  useEffect(() => {
    if (!tocRef.current) return;

    // 初始化视口高度
    setViewportHeight(window.innerHeight);

    // 计算目录高度
    const updateTocHeight = () => {
      if (tocRef.current) {
        const height = tocRef.current.scrollHeight;
        setTocHeight(height);
        
        // 判断是否需要固定广告卡片
        // 如果目录高度 + 广告卡片高度(约150px) + 顶部间距(80px) > 视口高度 - 底部间距(20px)
        const shouldFix = height + 150 + 80 > window.innerHeight - 20;
        setIsFixed(shouldFix);
      }
    };

    // 监听窗口大小变化
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      updateTocHeight();
    };

    // 初始计算
    updateTocHeight();

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [headings]);

  return (
    <div className={cn("space-y-4 flex flex-col h-[calc(100vh-5rem)]", className)}>
      {/* 目录容器 */}
      <div 
        ref={tocRef} 
        className={cn(
          "overflow-y-auto scrollbar-hide",
          isFixed ? "flex-grow" : ""
        )}
      >
        {headings.length > 0 && (
          <TableOfContentsClientWrapper headings={headings} />
        )}
        
        {/* 当不需要固定时，广告卡片直接跟随在目录下方 */}
        {!isFixed && (
          <div className="mt-4">
            <AdvertisementCard />
          </div>
        )}
      </div>

      {/* 当需要固定时，广告卡片固定在底部 */}
      {isFixed && (
        <div className="flex-shrink-0 sticky bottom-4">
          <AdvertisementCard />
        </div>
      )}
    </div>
  );
}
