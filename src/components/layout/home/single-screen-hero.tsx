'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 单屏首页英雄区组件
 */
export function SingleScreenHero() {
  return (
    <div className="relative w-full h-full flex flex-col justify-center overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.03] z-0" />

        {/* 装饰性渐变 */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-primary/5 to-transparent opacity-70" />
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-tl from-primary/5 to-transparent opacity-70" />

        {/* 装饰性圆形 */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center max-w-4xl w-full px-6 md:px-8 mx-auto">
          {/* 标题区域 */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-5 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium shadow-sm">
              斐流艺创
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 tracking-tight">
              iFluxArt
            </h1>

            <p className="text-2xl md:text-3xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              斐启智境 · 流韵新生
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="rounded-full px-5 py-2.5 text-sm shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Link href="/docs" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  浏览文档
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full px-5 py-2.5 text-sm border hover:bg-primary/5"
              >
                <Link href="/blog" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  阅读博客
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
