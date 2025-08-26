"use client";

import { Button } from "@/components/ui/button";
import { SITE_METADATA } from "@/config/metadata";
import { AnimatedNumber } from "@/features/home/components/animated-number";
import { useSiteStats } from "@/features/home/hooks/use-site-stats";
import { Sparkles, Target, Zap } from "lucide-react";
import Link from "next/link";

// 背景装饰组件
const BackgroundDecorations = () => (
  <>
    <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:50px_50px]" />
    <div className="absolute top-1/4 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-20 blur-3xl" />
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
  </>
);

// 统计卡片组件
interface StatCardProps {
  label: string;
  value: number;
  loading: boolean;
}

const StatCard = ({ label, value, loading }: StatCardProps) => (
  <div className="group text-center">
    <div className="mb-2 text-3xl font-bold text-primary lg:text-4xl">
      {loading ? (
        <div className="mx-auto h-8 w-12 animate-pulse rounded bg-muted" />
      ) : (
        <AnimatedNumber value={value} suffix="+" />
      )}
    </div>
    <div className="text-sm font-medium text-muted-foreground lg:text-base">{label}</div>
  </div>
);

export const HeroSection = () => {
  const { blogCount, docCount, linkCount, friendCount, loading } = useSiteStats();

  // 统计数据数组
  const statsData = [
    { label: "文章", value: blogCount },
    { label: "技术文档", value: docCount },
    { label: "实用导航", value: linkCount },
    { label: "友情链接", value: friendCount },
  ];

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* 背景装饰 */}
      <BackgroundDecorations />

      <div className="relative container mx-auto px-4 py-24 pt-32">
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
          <div className="space-y-4">
            <div className="grid grid-cols-4">
              {statsData.map(stat => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
