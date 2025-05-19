"use client";

import React from "react";

import { friendLinks, friendLinkRequirements } from "@/data/friends";
import { FriendLinkCard } from "@/components/features/friends/friend-link-card";
import { FriendLinkApplication } from "@/components/features/friends/friend-link-application";

export default function FriendsPage() {

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">友情链接</h1>
      <p className="text-muted-foreground mb-8">
        感谢以下朋友对本站的支持与帮助，欢迎互相交流学习。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* 友链卡片 */}
        {friendLinks.map((link, index) => (
          <FriendLinkCard key={link.url} link={link} index={index} />
        ))}
      </div>

      <FriendLinkApplication 
        requirements={friendLinkRequirements} 
        onApply={() => alert('感谢您的申请，我们会尽快审核！')} 
      />
    </main>
  );
}
