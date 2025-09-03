import { AppGrid, PageContainer } from "@/components/layout";
import profileData from "@/content/links/profile.json";
import { LinkCard } from "@/features/links/components";
import type { LinksItem } from "@/features/links/types";
import type { Metadata } from "next";
import { ABOUT_PAGE_METADATA } from "@/config";

export const metadata: Metadata = ABOUT_PAGE_METADATA;

const AboutPage = () => {
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
    <PageContainer config={{ layout: "narrow" }}>
      <div>
        {/* 个人信息卡片网格 */}
        {profileItems.length > 0 && (
          <AppGrid columns={4} className="items-stretch">
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

export default AboutPage;
