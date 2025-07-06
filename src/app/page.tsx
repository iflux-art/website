'use client';

import React from 'react';

// 导入 ChatGPT 风格的首页组件
import { HomeHero } from '@/components/layout/home/sections/home-hero';

export default function Home() {
  // 强制组件重新渲染，以便在每次页面刷新时获取新的问候语
  React.useEffect(() => {
    const timestamp = new Date().getTime();
    sessionStorage.setItem('refreshTimestamp', timestamp.toString());
  }, []);

  return (
    <main className="relative flex flex-col min-h-[calc(100vh-4rem-4rem)] h-[calc(100vh-4rem-4rem)] overflow-hidden">
      <HomeHero />
    </main>
  );
}
