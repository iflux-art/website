"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Greeting } from "@/components/layout/home/sections/greeting";
import { SearchBox } from "@/components/layout/home/sections/search-box";
import { RecommendationTags } from "@/components/layout/home/tags/recommendation-tags";

const Background = dynamic(() =>
  import("./background").then((mod) => mod.Background),
);

/**
 * ChatGPT 风格的首页英雄区组件
 * 模块化设计，将各功能拆分为独立组件
 */
export function HomeHero() {
  const [isSearchMode, setIsSearchMode] = useState(false);

  return (
    <div className="relative flex h-full w-full flex-col justify-center overflow-x-hidden overflow-y-auto pb-8">
      <Background />

      {/* 中央内容区域 */}
      <div className="mx-auto flex w-full flex-col items-center justify-center px-4 py-4 md:py-8">
        {/* 欢迎标题 - 随机问候语 - 搜索模式时隐藏 */}
        {!isSearchMode && <Greeting />}

        {/* 搜索框 */}
        <SearchBox onSearchModeChange={setIsSearchMode} />

        {/* 推荐标签 - 搜索模式时隐藏 */}
        {!isSearchMode && <RecommendationTags />}
      </div>
    </div>
  );
}
