"use client";

import React from "react";
import { PageTransition } from "@/components/ui/page-transition";

// 导入新的首页组件
import { NewHeroSection } from "@/components/layout/home/new-hero-section";
import { FeaturesSection } from "@/components/layout/home/features-section";
import { BlogSection } from "@/components/layout/home/blog-section";
import { NewNavigationSection } from "@/components/layout/home/new-navigation-section";
import { NewFriendsSection } from "@/components/layout/home/new-friends-section";
import { NewContactSection } from "@/components/layout/home/new-contact-section";
import { ScrollIndicator } from "@/components/layout/home/scroll-indicator";
import { FullscreenScrollController } from "@/components/layout/home/fullscreen-scroll-controller";

export default function Home() {
  // 定义页面各部分
  const sections = [
    { id: "hero-section", label: "首页" },
    { id: "features-section", label: "功能" },
    { id: "blog-section", label: "博客" },
    { id: "navigation-section", label: "导航" },
    { id: "friends-section", label: "友链" },
    { id: "contact-section", label: "联系" },
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
          <section id="hero-section" className="flex items-center justify-center bg-gradient-to-b from-background to-background/95 w-full">
            <div className="w-full">
              <NewHeroSection />
            </div>
          </section>

          <section id="features-section" className="flex items-center justify-center bg-muted/30 w-full">
            <FeaturesSection />
          </section>

          <section id="blog-section" className="flex items-center justify-center bg-background w-full">
            <BlogSection />
          </section>

          <section id="navigation-section" className="flex items-center justify-center bg-muted/30 w-full">
            <NewNavigationSection />
          </section>

          <section id="friends-section" className="flex items-center justify-center bg-background w-full">
            <NewFriendsSection />
          </section>

          <section id="contact-section" className="flex items-center justify-center bg-muted/30 w-full">
            <NewContactSection />
          </section>
        </main>
      </FullscreenScrollController>
    </PageTransition>
  );
}
