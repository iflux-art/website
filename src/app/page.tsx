"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Globe,
  Heart,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";
// cn utility removed as it's not currently used
import { SITE_METADATA } from "@/config/metadata";
import { useSiteStats } from "@/hooks/use-site-stats";
import { useEffect, useState } from "react";

// 数字动画组件
function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) return;

    const duration = 2000; // 2秒动画
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}

// Hero区域组件
function HeroSection() {
  const { blogCount, docCount, linkCount, friendCount, loading } =
    useSiteStats();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* 背景装饰 */}
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:50px_50px]" />
      <div className="absolute top-1/4 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-20 blur-3xl" />

      {/* 浮动装饰元素 */}
      <div
        className="absolute top-20 left-20 h-20 w-20 animate-bounce rounded-full bg-primary/10 blur-xl"
        style={{ animationDelay: "0s", animationDuration: "3s" }}
      />
      <div
        className="absolute top-40 right-32 h-16 w-16 animate-bounce rounded-full bg-purple-500/10 blur-xl"
        style={{ animationDelay: "1s", animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-32 left-1/4 h-24 w-24 animate-bounce rounded-full bg-blue-500/10 blur-xl"
        style={{ animationDelay: "2s", animationDuration: "5s" }}
      />

      <div className="relative container mx-auto px-4 py-24">
        <div className="mx-auto max-w-5xl text-center">
          {/* 标题区域 */}
          <div className="mb-12">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-spin" />
              {SITE_METADATA.title}
            </div>
            <h1 className="mb-8 text-5xl leading-tight font-bold tracking-tight lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                斐启智境，流韵新生
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground lg:text-2xl">
              探索AI与艺术的无限可能，分享技术与创意的完美结合
            </p>
          </div>

          {/* CTA按钮 */}
          <div className="mb-20 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button size="lg" className="group px-4 py-4 text-lg" asChild>
              <Link href="/blog">
                <Zap className="h-5 w-5" />
                开始探索
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-4 py-4 text-lg backdrop-blur-sm"
              asChild
            >
              <Link href="/docs">
                <Target className="h-5 w-5" />
                查看文档
              </Link>
            </Button>
          </div>

          {/* 实时统计数据 */}
          <div className="grid grid-cols-4">
            {[
              {
                label: "文章",
                value: blogCount,
                icon: FileText,
                color: "text-blue-600 dark:text-blue-400",
                bgColor: "bg-blue-500/10",
              },
              {
                label: "技术文档",
                value: docCount,
                icon: BookOpen,
                color: "text-purple-600 dark:text-purple-400",
                bgColor: "bg-purple-500/10",
              },
              {
                label: "实用导航",
                value: linkCount,
                icon: Globe,
                color: "text-green-600 dark:text-green-400",
                bgColor: "bg-green-500/10",
              },
              {
                label: "友情链接",
                value: friendCount,
                icon: Heart,
                color: "text-rose-600 dark:text-rose-400",
                bgColor: "bg-rose-500/10",
              },
            ].map((stat, index) => {
              return (
                <div key={index} className="group text-center">
                  <div className="mb-2 text-3xl font-bold text-primary lg:text-4xl">
                    {loading ? (
                      <div className="mx-auto h-8 w-12 animate-pulse rounded bg-muted" />
                    ) : (
                      <AnimatedNumber value={stat.value} suffix="+" />
                    )}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground lg:text-base">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 全屏Hero区域 */}
      <HeroSection />
    </div>
  );
}
