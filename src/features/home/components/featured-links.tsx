"use client";

import { AppGrid } from "@/components/app-grid";
import { LinkCard } from "@/components/link-card";
import profileData from "../data/profile.json";

// 定义个人资料链接类型
interface ProfileLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  iconType?: "image" | "text";
}

export const FeaturedLinks = () => {
  // 处理个人资料数据，转换为 ProfileLink 格式
  const profileItems: ProfileLink[] = profileData.map((item) => {
    const typedItem = item as ProfileLink & { iconType?: "image" | "text" };
    return {
      ...typedItem,
      iconType: typedItem.iconType ?? "image",
    };
  });

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">关注我们</h2>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          在以下平台关注我们，获取最新动态
        </p>

        {profileItems.length > 0 && (
          <AppGrid columns={5} className="items-stretch">
            {profileItems.map((item) => (
              <LinkCard
                key={item.id}
                title={item.title}
                description={item.description || item.url}
                href={item.url}
                icon={item.icon}
                isExternal={true}
              />
            ))}
          </AppGrid>
        )}
      </div>
    </section>
  );
};
