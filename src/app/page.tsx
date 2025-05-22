'use client';

import React from 'react';
import { PageTransition } from '@/components/ui/page-transition';

// 导入首页组件
import { HeroSection } from '@/components/layout/home/hero-section';
import { FeaturesSection } from '@/components/layout/home/features-section-new';
import { BlogSection } from '@/components/layout/home/blog-section';
import { NavigationSection } from '@/components/layout/home/navigation-section';
import { FriendsSection } from '@/components/layout/home/friends-section';
import { ContactSection } from '@/components/layout/home/contact-section';
import { ScrollIndicator } from '@/components/layout/home/scroll-indicator';
import { FullscreenScrollController } from '@/components/layout/home/fullscreen-scroll-controller';

export default function Home() {
  // 定义页面各部分
  const sections = [
    { id: 'hero-section', label: '首页' },
    { id: 'features-section', label: '功能' },
    { id: 'blog-section', label: '博客' },
    { id: 'navigation-section', label: '导航' },
    { id: 'friends-section', label: '友链' },
    { id: 'contact-section', label: '联系' },
  ];

  // 提取部分ID数组
  const sectionIds = sections.map(section => section.id);

  return (
    <PageTransition>
      <FullscreenScrollController sectionIds={sectionIds} navbarHeight={64}>
        <main className="relative">
          {/* 滚动指示器 */}
          <ScrollIndicator sections={sections} />

          {/* 页面各部分 */}
          <section
            id="hero-section"
            className="flex items-center justify-center bg-gradient-to-b from-background to-background/95 w-full"
          >
            <div className="w-full">
              <HeroSection />
            </div>
          </section>

          <section
            id="features-section"
            className="flex items-center justify-center bg-muted/30 w-full"
          >
            <FeaturesSection />
          </section>

          <section
            id="blog-section"
            className="flex items-center justify-center bg-background w-full"
          >
            <BlogSection />
          </section>

          <section
            id="navigation-section"
            className="flex items-center justify-center bg-muted/30 w-full"
          >
            <NavigationSection />
          </section>

          <section
            id="friends-section"
            className="flex items-center justify-center bg-background w-full"
          >
            <FriendsSection />
          </section>

          <section
            id="contact-section"
            className="flex items-center justify-center bg-background w-full"
          >
            <ContactSection />
          </section>
        </main>
      </FullscreenScrollController>
    </PageTransition>
  );
}
