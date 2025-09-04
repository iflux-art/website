import { AppGrid, PageContainer } from "@/components/layout";
import profileData from "@/content/links/profile.json";
import { FriendLinkCard } from "@/features/friends/components";
import type { ProfileLink } from "@/features/friends/types";
import type { Metadata } from "next";
import { ABOUT_PAGE_METADATA } from "@/config";

export const metadata: Metadata = ABOUT_PAGE_METADATA;

const AboutPage = () => {
  // 处理个人资料数据，转换为 ProfileLink 格式
  const profileItems: ProfileLink[] = profileData.map(item => {
    const typedItem = item as ProfileLink & { iconType?: "image" | "text" };
    return {
      ...typedItem,
      category: "profile" as const,
      iconType: typedItem.iconType ?? "image",
    };
  });

  return (
    <PageContainer config={{ layout: "narrow" }}>
      <div>
        {/* 个人信息卡片网格 */}
        {profileItems.length > 0 && (
          <AppGrid columns={4} className="items-stretch">
            {profileItems.map(item => (
              <FriendLinkCard
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

export default AboutPage;
