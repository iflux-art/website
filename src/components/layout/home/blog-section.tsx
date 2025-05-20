"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";

// 博客文章类型
interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  coverImage?: string;
  readingTime?: string;
}

/**
 * 博客展示区组件
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function BlogSection() {
  // 博客文章数据
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // 使用 useCallback 定义获取博客文章的函数，避免不必要的重新创建
  const fetchBlogPosts = React.useCallback(async () => {
    // 设置加载状态
    setIsLoading(true);

    try {
      // 添加随机查询参数以避免缓存问题
      const timestamp = Date.now();
      const url = `/api/blog/posts?t=${timestamp}`;

      // 从API获取数据，使用超时控制
      // 创建一个带超时的 fetch 请求
      const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
        const controller = new AbortController();
        const { signal } = controller;

        // 设置超时定时器
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          // 执行 fetch 请求
          const response = await fetch(url, { ...options, signal });
          // 清除超时定时器
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          // 清除超时定时器
          clearTimeout(timeoutId);
          throw error;
        }
      };

      // 执行带超时的 fetch 请求
      const response = await fetchWithTimeout(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.slice(0, 3)); // 只显示前3篇文章
      } else {
        console.warn("API 返回非 200 状态码:", response.status);
        // 使用模拟数据
        useMockData();
      }
    } catch (error) {
      console.error("获取博客文章失败:", error);
      // 使用模拟数据
      useMockData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 使用模拟数据的辅助函数
  const useMockData = () => {
    const mockPosts: BlogPost[] = [
      {
        title: "Next.js 14 新特性解析",
        excerpt: "探索 Next.js 14 带来的性能优化和开发体验改进，包括服务器组件、流式渲染等创新功能。",
        date: "2023-10-26",
        slug: "nextjs-14-features",
        coverImage: "/images/blog/1.png",
        readingTime: "5 分钟"
      },
      {
        title: "使用 Tailwind CSS 构建响应式界面",
        excerpt: "学习如何利用 Tailwind CSS 快速构建美观的响应式用户界面，掌握实用技巧和最佳实践。",
        date: "2023-10-18",
        slug: "tailwind-responsive-ui",
        coverImage: "/images/blog/2.png",
        readingTime: "7 分钟"
      },
      {
        title: "React Server Components 实战指南",
        excerpt: "深入了解 React Server Components 的工作原理及其应用场景，探索前后端融合的新范式。",
        date: "2023-10-15",
        slug: "react-server-components",
        coverImage: "/images/blog/3.png",
        readingTime: "10 分钟"
      },
    ];
    setBlogPosts(mockPosts);
  };

  // 使用 useEffect 在组件挂载和路由变化时获取数据
  useEffect(() => {
    // 立即执行获取数据
    fetchBlogPosts();

    // 不需要清理函数，因为我们不使用 AbortController
  }, [pathname, fetchBlogPosts]); // 添加 pathname 和 fetchBlogPosts 作为依赖

  return (
    <section className="w-full py-10">
      <div className="container px-6 md:px-8 mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-0"
          >
            <h2 className="text-3xl md:text-4xl font-bold">最新博客</h2>
            <p className="text-muted-foreground mt-2">探索最新的技术文章和见解</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button variant="outline" asChild>
              <Link href="/blog" className="flex items-center gap-2">
                查看全部 <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="h-[400px] bg-muted/30 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all hover:border-primary/50 group">
                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                      {post.coverImage ? (
                        <LazyImage
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                        <div className="h-full w-full bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                          <span className="text-primary font-medium">iFluxArt Blog</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                        {post.readingTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readingTime}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 text-primary text-sm font-medium flex items-center">
                        阅读全文 <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && blogPosts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">暂无博客文章</p>
          </div>
        )}
      </div>
    </section>
  );
}
