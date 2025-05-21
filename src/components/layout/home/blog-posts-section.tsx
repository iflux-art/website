"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from "@/components/ui/lazy-image";
import { AnimationSequence, AnimationItem } from "@/components/ui/animation-sequence";
import { slideUp } from "@/lib/animations/base";

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  coverImage?: string;
}

interface BlogPostsSectionProps {
  blogPosts: BlogPost[];
  isLoading: boolean;
}

/**
 * 首页博客文章展示组件
 * 显示最新的博客文章，支持加载状态和空状态
 */
export function BlogPostsSection({ blogPosts, isLoading }: BlogPostsSectionProps) {
  return (
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
  );
}