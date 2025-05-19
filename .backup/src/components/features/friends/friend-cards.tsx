"use client";

import { FriendCard } from "./friend-card";

interface FriendCardsProps {
  className?: string;
}

export function FriendCards({}: FriendCardsProps) {
  const friends = [
    {
      href: "https://example.com/blog",
      avatar: "A",
      // 简化为直接使用字符串
      name: "示例博客",
      description: "一个分享技术与生活的个人博客"
    },
    {
      href: "https://example.com/blog",
      avatar: "B",
      name: "技术笔记",
      description: "记录学习与开发过程的技术博客"
    },
    {
      href: "https://example.com/tech",
      avatar: "C",
      name: "前端开发",
      description: "专注于前端技术分享的网站"
    },
    {
      href: "https://example.com/design",
      avatar: "D",
      name: "设计灵感",
      description: "分享UI/UX设计理念与案例"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4">
      {friends.map((friend) => (
        <FriendCard
          key={friend.href}
          href={friend.href}
          avatar={friend.avatar}
          name={friend.name}
          description={friend.description}
          // 移除了 lang 属性传递
        />
      ))}
    </div>
  );
}