"use client";

import React from "react";
import { AppGrid } from "@/components/layout/app-grid";
import { LinkCard } from "@/components/card/link-card";
import { useLinksData } from "@/hooks/use-links-data";
// Icons removed as they are not currently used

export default function AboutPage() {
  const { items, loading, error } = useLinksData();

  // 筛选出个人主页分类的项目
  const profileItems = items.filter((item) => item.category === "profile");

  if (loading || error) {
    return null; // Let Next.js loading.tsx handle loading states
  }

  return (
    <div className="container mx-auto py-8">
      {/* 个人主页版块 */}
      {profileItems.length > 0 && (
        <div>
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold">关注我们</h2>
            <p className="text-muted-foreground">
              欢迎在各大平台关注我的最新动态
            </p>
          </div>

          <AppGrid columns={5} className="items-stretch">
            {profileItems.map((item) => (
              <LinkCard
                key={item.id}
                title={item.title}
                description={item.description || item.url}
                href={item.url}
                icon={item.icon}
                iconType={item.iconType as "image" | "text" | undefined}
                isExternal={true}
                className="h-full"
              />
            ))}
          </AppGrid>
        </div>
      )}
    </div>
  );
}
