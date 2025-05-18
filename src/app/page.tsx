"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { LazyImage } from "@/components/ui/lazy-image";
import {
  AnimationSequence,
  AnimationItem,
} from "@/components/ui/animation-sequence";
import { fadeIn, slideUp } from "@/lib/animations/base";
import { staggerContainer } from "@/lib/animations/interactions";

// 使用统一的懒加载组件包装器
import { createLazyComponent } from "@/components/ui/lazy-component";

// 懒加载组件
const LazyFeatureCards = createLazyComponent(
  () =>
    import("@/components/layout/home/feature-cards").then((mod) => ({
      default: mod.FeatureCards,
    })),
  <div className="h-60 flex items-center justify-center">加载中...</div>
);

// 懒加载导航和友链组件
const LazyNavigationSection = createLazyComponent(
  () =>
    import("@/components/layout/home/navigation-section").then((mod) => ({
      default: mod.NavigationSection,
    })),
  <div className="h-60 flex items-center justify-center">加载中...</div>
);

const LazyFriendsSection = createLazyComponent(
  () =>
    import("@/components/layout/home/friends-section").then((mod) => ({
      default: mod.FriendsSection,
    })),
  <div className="h-60 flex items-center justify-center">加载中...</div>
);

const LazyContactSection = createLazyComponent(
  () =>
    import("@/components/layout/home/contact-section").then((mod) => ({
      default: mod.ContactSection,
    })),
  <div className="h-60 flex items-center justify-center">加载中...</div>
);

// 博客文章类型
interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  coverImage?: string;
}

export default function Home() {
  // 滚动动画
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity1 = useTransform(scrollY, [0, 200], [1, 0.5]);

  // 不再需要单独的视图检测，使用ScrollAnimation组件代替

  // 博客文章数据
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 使用useEffect在客户端获取博客文章
  useEffect(() => {
    // 获取博客文章数据的函数
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        // 从API获取数据
        const response = await fetch('/api/blog/posts');
        
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data.slice(0, 3)); // 只显示前3篇文章
        } else {
          // 如果API不可用，使用模拟数据
          const mockPosts: BlogPost[] = [
            {
              title: "Next.js 14 新特性解析",
              excerpt: "探索 Next.js 14 带来的性能优化和开发体验改进",
              date: "2023-10-26",
              slug: "nextjs-14-features",
              coverImage: "/images/blog/1.png",
            },
            {
              title: "使用 Tailwind CSS 构建响应式界面",
              excerpt: "学习如何利用 Tailwind CSS 快速构建美观的响应式用户界面",
              date: "2023-10-18",
              slug: "tailwind-responsive-ui",
              coverImage: "/images/blog/2.png",
            },
            {
              title: "React Server Components 实战指南",
              excerpt: "深入了解 React Server Components 的工作原理及其应用场景",
              date: "2023-10-15",
              slug: "react-server-components",
              coverImage: "/images/blog/3.png",
            }
          ];
          setBlogPosts(mockPosts);
        }
      } catch (error) {
        console.error("获取博客文章失败:", error);
        // 出错时使用模拟数据
        const mockPosts: BlogPost[] = [
          {
            title: "Next.js 14 新特性解析",
            excerpt: "探索 Next.js 14 带来的性能优化和开发体验改进",
            date: "2023-10-26",
            slug: "nextjs-14-features",
          },
          {
            title: "使用 Tailwind CSS 构建响应式界面",
            excerpt: "学习如何使用 Tailwind CSS 快速构建美观的响应式用户界面",
            date: "2023-10-20",
            slug: "tailwind-responsive-ui",
          },
          {
            title: "React Server Components 实战指南",
            excerpt: "深入了解 React Server Components 的工作原理及其应用场景",
            date: "2023-10-15",
            slug: "react-server-components",
          }
        ];
        setBlogPosts(mockPosts);
      } finally {
        setIsLoading(false);
      }
    };

    // 立即执行获取数据
    fetchBlogPosts();
  }, []);

  return (
    <PageTransition>
      {/* 英雄区 */}
      <motion.div
        className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y: y1, opacity: opacity1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/80 z-10" />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.02] z-0" />
        </motion.div>

        <div className="container px-4 text-center relative z-10">
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            variants={slideUp}
          >
            iFluxArt
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
            variants={slideUp}
          >
            斐启智境 · 流韵新生
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={slideUp}
          >
            <Button size="lg" asChild>
              <Link href="/docs">浏览文档</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">阅读博客</Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* 文档模块 */}
      <ScrollAnimation type="fadeIn" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            variants={slideUp}
          >
            文档中心
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-center text-lg text-muted-foreground mb-8">
              查阅详细的产品文档和使用指南，快速了解网站的各项功能和使用方法。
            </p>
            <LazyFeatureCards />
          </div>
        </div>
      </ScrollAnimation>

      {/* 博客模块 */}
      <ScrollAnimation type="slideUp" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex justify-between items-center mb-12"
            variants={slideUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold">最新博客</h2>
            <Link
              href="/blog"
              className="text-primary flex items-center hover:underline"
            >
              查看全部 <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="h-[400px] bg-muted/30 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <AnimationSequence
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={0.1}
              initialDelay={0.2}
            >
              {blogPosts.map((post, index) => (
                <AnimationItem key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 group">
                      <div className="relative h-48 w-full bg-muted overflow-hidden rounded-t-md">
                        {post.coverImage ? (
                          <LazyImage
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            index={index}
                            fadeIn={true}
                            fadeInDuration={800}
                            threshold={0.2}
                            delayLoad={index * 100}
                            placeholderClassName="bg-gradient-to-br from-muted/40 to-muted/80"
                            wrapperClassName="group-hover:opacity-95 transition-opacity"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-primary/5 to-primary/20"></div>
                        )}
                      </div>
                      <CardContent className="p-6 flex-grow flex flex-col">
                        <p className="text-sm text-muted-foreground mb-2">
                          {post.date}
                        </p>
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 text-primary text-sm font-medium">阅读全文 →</div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimationItem>
              ))}
            </AnimationSequence>
          )}
          {!isLoading && blogPosts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">暂无博客文章</p>
            </div>
          )}
        </div>
      </ScrollAnimation>

      {/* 导航模块 */}
      <ScrollAnimation type="fadeIn" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            variants={slideUp}
          >
            网站导航
          </motion.h2>

          <LazyNavigationSection />
        </div>
      </ScrollAnimation>

      {/* 友链模块 */}
      <ScrollAnimation type="slideUp" className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            variants={slideUp}
          >
            友情链接
          </motion.h2>

          <LazyFriendsSection />
        </div>
      </ScrollAnimation>

      {/* 联系方式 */}
      <ScrollAnimation type="fadeIn" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            variants={slideUp}
          >
            联系我们
          </motion.h2>

          <LazyContactSection />
        </div>
      </ScrollAnimation>

      {/* CTA 区域 */}
      <ScrollAnimation
        type="fadeIn"
        className="py-20 bg-primary/5 rounded-lg my-10 mx-6"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            variants={slideUp}
          >
            开始探索
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            variants={slideUp}
          >
            点击上方任意模块，开始探索网站的各个功能区域。每个模块都有独立的页面和功能，方便您快速找到所需的信息。
          </motion.p>

          <motion.div variants={fadeIn}>
            <Button size="lg" asChild>
              <Link href="/docs">了解更多</Link>
            </Button>
          </motion.div>
        </div>
      </ScrollAnimation>
    </PageTransition>
  );
}