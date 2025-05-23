'use client';

import React from 'react';
import { EnhancedBackground } from './enhanced-background';
import { Greeting } from './greeting';
import { SearchBox } from './search-box';
import { RecommendationTags } from './recommendation-tags';

/**
 * ChatGPT 风格的首页英雄区组件
 * 模块化设计，将各功能拆分为独立组件
 */
export function ChatStyleHero() {
  return (
    <div className="relative w-full h-full flex flex-col justify-center overflow-y-auto overflow-x-hidden pb-8">
      {/* 增强型背景效果 - 可以选择不同的背景样式 */}
      <EnhancedBackground style="gradient-mesh" />

      {/* 中央内容区域 */}
      <div className="flex flex-col items-center justify-center px-4 w-full mx-auto py-4 md:py-8">
        {/* 欢迎标题 - 随机问候语 */}
        <Greeting />

        {/* 搜索框 */}
        <SearchBox />

        {/* 推荐标签 */}
        <RecommendationTags />
      </div>
    </div>
  );
}
