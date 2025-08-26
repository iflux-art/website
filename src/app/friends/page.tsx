import { AppGrid, PageContainer } from "@/components/layout";
import friendsData from "@/content/links/friends.json";
import { TwikooComment } from "@/features/comment";
import { FriendLinkApplication } from "@/features/friends/components";
import { DEFAULT_FRIENDS_CONFIG, hasFriendsData, processFriendsData } from "@/features/friends/lib";
import { LinkCard } from "@/features/links/components";
import type { LinksItem } from "@/features/links/types";
import { generateSEOMetadata } from "@/lib/metadata/seo-utils";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "友情链接",
  description: "友情链接列表和申请方式",
  keywords: ["友链", "网站", "合作"],
});

const FriendsPage = () => {
  // 处理友链数据
  const friendsItems: LinksItem[] = processFriendsData(friendsData);
  const config = DEFAULT_FRIENDS_CONFIG;

  // 如果没有友链数据，显示空状态
  if (!hasFriendsData(friendsItems)) {
    return (
      <PageContainer config={{ layout: "full-width" }}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">友情链接</h1>
            <p className="mb-4 text-muted-foreground">暂无友情链接</p>
            <a
              href={config.application.formUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              申请友链
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer config={{ layout: "full-width" }}>
      <div>
        {/* 友链列表网格 */}
        <AppGrid columns={5} className="items-stretch">
          {friendsItems.map(item => (
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

        {/* 友链申请版块 */}
        <FriendLinkApplication config={config} />

        {/* 评论区 */}
        {config.showComments && (
          <div className="mt-12">
            <TwikooComment />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default FriendsPage;
