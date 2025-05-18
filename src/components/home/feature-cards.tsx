"use client";

import { FeatureCard } from "./feature-card";
import { cn } from "@/lib/utils";

interface FeatureCardsProps {
  className?: string
}

export function FeatureCards({ className }: FeatureCardsProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {[
        {
          href: "/docs",
          title: "文档中心",
          description: "查看产品文档和使用指南"
        },
        {
          href: "/blog",
          title: "博客",
          description: "阅读最新的技术文章和分享"
        },
        {
          href: "/navigation",
          title: "网站导航",
          description: "发现有用的开发资源和工具"
        },
        {
          href: "/friends",
          title: "友情链接",
          description: "查看合作伙伴和友情站点"
        }
      ].map((feature) => (
        <FeatureCard
          key={feature.href}
          href={feature.href}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  )
}