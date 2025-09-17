"use client";

import { Sparkles } from "lucide-react";
import { HOME_CONFIG } from "@/features/home/config";

// 背景装饰组件的属性类型
interface HeroDecorationProps {
  className?: string;
  style?: React.CSSProperties;
}

// 背景装饰组件
const BackgroundDecorations = (_props: HeroDecorationProps) => (
  <>
    <div className="bg-grid-white/[0.01] dark:bg-grid-white/[0.01] absolute inset-0 bg-[size:50px_50px]" />
    <div className="absolute top-1/4 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-r from-primary/30 via-transparent to-primary/30 dark:from-primary/20 dark:to-primary/20 opacity-30 dark:opacity-20 blur-3xl" />
    <div
      className="absolute top-20 left-20 h-20 w-20 animate-bounce rounded-full bg-primary/25 dark:bg-primary/10 blur-xl"
      style={{ animationDelay: "0s", animationDuration: "3s" }}
    />
    <div
      className="absolute top-40 right-32 h-16 w-16 animate-bounce rounded-full bg-purple-500/25 dark:bg-purple-500/10 blur-xl"
      style={{ animationDelay: "1s", animationDuration: "4s" }}
    />
    <div
      className="absolute bottom-32 left-1/4 h-24 w-24 animate-bounce rounded-full bg-blue-500/25 dark:bg-blue-500/10 blur-xl"
      style={{ animationDelay: "2s", animationDuration: "5s" }}
    />
  </>
);

export const HeroSection = () => {
  return (
    <section className="relative flex h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* 背景装饰 */}
      <BackgroundDecorations />

      <div className="relative container mx-auto px-4 py-6">
        <div className="mx-auto max-w-5xl text-center">
          {/* 标题区域 */}
          <div className="mb-3">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-spin" />
              {HOME_CONFIG.title}
            </div>
            <h1 className="mb-5 text-5xl leading-tight font-bold tracking-tight lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                {HOME_CONFIG.hero.title}
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground lg:text-2xl">
              {HOME_CONFIG.hero.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
