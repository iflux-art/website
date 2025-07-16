"use client";

import React, { useState } from "react";
import { Greeting } from "packages/src/ui/components/greeting";
import { SearchBox } from "@/app/chat/src/components/search-box";
import { RecommendationTags } from "@/app/chat/src/components/recommendation-tags";
import { cn } from "packages/src/lib/utils";

// 直接内联 Background 组件
function Background({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10", className)}>
      <div className="absolute bottom-0 left-0 h-64 w-full opacity-10">
        <div
          className="animate-wave absolute bottom-0 left-0 h-40 w-[200%] rounded-[100%] bg-primary/20"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="animate-wave absolute bottom-5 left-0 h-40 w-[200%] rounded-[100%] bg-primary/15"
          style={{ animationDuration: "15s", animationDelay: "2s" }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 强制组件重新渲染，以便在每次页面刷新时获取新的问候语
  React.useEffect(() => {
    const timestamp = new Date().getTime();
    sessionStorage.setItem("refreshTimestamp", timestamp.toString());
  }, []);

  return (
    <main className="relative flex h-[calc(100vh-4rem-4rem)] min-h-[calc(100vh-4rem-4rem)] flex-col overflow-hidden">
      <div className="relative flex h-full w-full flex-col justify-center overflow-x-hidden overflow-y-auto pb-8">
        <Background />
        <div className="mx-auto flex w-full flex-col items-center justify-center px-4 py-4 md:py-8">
          {/* 欢迎标题 - 随机问候语 - 搜索模式时隐藏 */}
          {!isSearchMode && <Greeting />}
          {/* 搜索框 */}
          <SearchBox onSearchModeChange={setIsSearchMode} />
          {/* 推荐标签 - 搜索模式时隐藏 */}
          {!isSearchMode && <RecommendationTags />}
        </div>
      </div>
    </main>
  );
}
