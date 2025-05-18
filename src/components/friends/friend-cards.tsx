"use client";

import { FriendCard } from "./friend-card";

interface FriendCardsProps {
  lang: string;
}

export function FriendCards({ lang }: FriendCardsProps) {
  const friends = [
    {
      href: "https://example.com/blog",
      avatar: "A",
      name: {
        zh: "示例博客",
        en: "Sample Blog"
      },
      description: {
        zh: "一个分享技术与生活的个人博客",
        en: "A personal blog sharing technology and life"
      }
    },
    {
      href: "https://example.com/blog",
      avatar: "B",
      name: {
        zh: "技术笔记",
        en: "Tech Notes"
      },
      description: {
        zh: "记录学习与开发过程的技术博客",
        en: "A technical blog recording learning and development processes"
      }
    },
    {
      href: "https://example.com/tech",
      avatar: "C",
      name: {
        zh: "前端开发",
        en: "Frontend Dev"
      },
      description: {
        zh: "专注于前端技术分享的网站",
        en: "A website focused on frontend technology sharing"
      }
    },
    {
      href: "https://example.com/design",
      avatar: "D",
      name: {
        zh: "设计灵感",
        en: "Design Inspiration"
      },
      description: {
        zh: "分享UI/UX设计理念与案例",
        en: "Sharing UI/UX design concepts and cases"
      }
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
          lang={lang}
        />
      ))}
    </div>
  );
}