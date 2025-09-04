"use client";

import { AppGrid, PageContainer } from "@/components/layout";
import { TwikooComment } from "@/features/comment";
import { DEFAULT_FRIENDS_CONFIG, hasFriendsData, processFriendsData } from "../lib";
import type { FriendLink, FriendsPageConfig } from "../types";
import { FriendLinkApplication } from "./friend-link-application";
import { FriendLinkCard } from "./friend-link-card";

interface FriendsPageContainerProps {
  /** 友链数据 */
  friendsData: unknown[];
  /** 友链页面配置，可选，使用默认配置 */
  config?: Partial<FriendsPageConfig>;
  /** 自定义类名 */
  className?: string;
}

/**
 * 友链页面容器组件
 *
 * 整合友链列表展示、申请表单和评论功能的完整页面组件。
 * 从原始 friends 页面中提取的业务逻辑，遵循项目架构分离原则。
 */
export const FriendsPageContainer = ({
  friendsData,
  config: partialConfig = {},
  className = "",
}: FriendsPageContainerProps) => {
  // 合并配置
  const config: FriendsPageConfig = {
    ...DEFAULT_FRIENDS_CONFIG,
    ...partialConfig,
    application: {
      ...DEFAULT_FRIENDS_CONFIG.application,
      ...partialConfig.application,
    },
  };

  // 处理友链数据
  const friendsItems: FriendLink[] = processFriendsData(friendsData);

  // 如果没有友链数据，显示空状态
  if (!hasFriendsData(friendsItems)) {
    return (
      <PageContainer config={{ layout: "full-width" }}>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
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
    <PageContainer config={{ layout: "full-width" }} className={className}>
      <div className="pb-8">
        {/* 友链列表网格 */}
        <AppGrid columns={5} className="items-stretch">
          {friendsItems.map(item => (
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
