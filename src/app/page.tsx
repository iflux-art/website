import React from "react";
import { FeatureCards } from "@/components/home/feature-cards";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">欢迎访问我的网站</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          这是一个使用 Next.js 和 TailwindCSS 构建的模块化网站，包含文档、博客、导航和友链等功能模块
        </p>
      </section>

      <FeatureCards />

      <section className="bg-muted/30 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">开始探索</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          点击上方任意模块，开始探索网站的各个功能区域。每个模块都有独立的页面和功能，方便您快速找到所需的信息。
        </p>
        <Link href="/docs" className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-block">
          了解更多
        </Link>
      </section>
    </main>
  );
}
