"use client";

import { AppGrid, PageContainer } from "@/components/layout";
import type { LinksItem } from "../types";
import { LinkCard } from "./link-card";

interface ProfilePageContainerProps {
  /** 个人资料数据 */
  profileData: unknown[];
  /** 自定义类名 */
  className?: string;
}

/**
 * 个人资料页面容器组件
 *
 * 处理个人资料（关于我）页面的展示逻辑，
 * 本质上是一个特殊的链接展示页面。
 */
export const ProfilePageContainer = ({
  profileData,
  className = "",
}: ProfilePageContainerProps) => {
  // 处理个人资料数据，转换为 LinksItem 格式
  const profileItems: LinksItem[] = profileData.map(item => {
    const typedItem = item as LinksItem & { iconType?: "image" | "text" };
    return {
      ...typedItem,
      category: "profile" as const,
      iconType: typedItem.iconType ?? "image",
    };
  });

  return (
    <PageContainer config={{ layout: "full-width" }} className={className}>
      <div className="pb-8">
        {profileItems.length > 0 && (
          <AppGrid columns={5} className="items-stretch">
            {profileItems.map(item => (
              <LinkCard
                key={item.id}
                title={item.title}
                description={item.description || item.url}
                href={item.url}
                icon={item.icon}
                iconType={item.iconType}
                isExternal
                className="h-full"
              />
            ))}
          </AppGrid>
        )}
      </div>
    </PageContainer>
  );
};
