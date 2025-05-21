"use client";

import React from "react";

import { FriendLinkCard } from "@/components/features/friends/friend-link-card";
import { FriendLinkApplication } from "@/components/features/friends/friend-link-application";
import { useFriendLinks } from "@/hooks/use-friend-links";
import { AnimatedContainer } from "@/components/ui/animated-container";

/**
 * 友情链接页面
 *
 * 显示友情链接列表和申请表单
 *
 * @returns 友情链接页面组件
 */
export default function FriendsPage() {
  // 使用友情链接钩子函数获取数据和操作
  const { links, requirements, applyFriendLink } = useFriendLinks();

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">友情链接</h1>
      <p className="text-muted-foreground mb-8">
        感谢以下朋友对本站的支持与帮助，欢迎互相交流学习。
      </p>

      {/* 预先创建友链卡片网格 */}
      {(() => {
        const friendLinksGrid = (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* 友链卡片 */}
            {links.map((link, index) => (
              <FriendLinkCard key={link.url} link={link} index={index} />
            ))}
          </div>
        );

        return (
          <AnimatedContainer
            baseDelay={0.1}
            staggerDelay={0.15}
            variant="fade"
            autoWrap={false}
            threshold={0.1}
            rootMargin="0px"
          >
            {friendLinksGrid}
          </AnimatedContainer>
        );
      })()}

      <FriendLinkApplication
        requirements={requirements}
        onApply={() => applyFriendLink('', '', '', { type: 'emoji', value: '' })}
      />
    </main>
  );
}
