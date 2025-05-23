'use client';

import React, { useEffect } from 'react';

// 导入新的单屏首页组件
import { SingleScreenHero } from '@/components/layout/home/single-screen-hero';

export default function Home() {
  // 添加首页特殊类名，用于隐藏滚动条
  useEffect(() => {
    document.body.classList.add('home-page');

    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  return (
    <main className="relative flex flex-col h-[calc(100vh-4rem-3rem)] overflow-hidden">
      <SingleScreenHero />
    </main>
  );
}
