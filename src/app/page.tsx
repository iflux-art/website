'use client';

import React, { useEffect } from 'react';

// 导入 ChatGPT 风格的首页组件
import { HomeHero } from '@/components/layout/home';

export default function Home() {
  // 添加首页特殊类名，用于隐藏滚动条
  useEffect(() => {
    document.body.classList.add('home-page');

    // 强制组件重新渲染，以便在每次页面刷新时获取新的问候语
    const timestamp = new Date().getTime();
    sessionStorage.setItem('refreshTimestamp', timestamp.toString());

    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <main className="relative flex flex-col min-h-[calc(100vh-4rem-4rem)] h-[calc(100vh-4rem-4rem)] overflow-hidden">
      <HomeHero />
    </main>
  );
}
