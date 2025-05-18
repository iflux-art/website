"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { slideUp } from "@/lib/animations";

export function FriendsSection() {
  // 友情链接数据
  const friends = [
    {
      name: "设计之家",
      description: "专注于设计领域的分享平台",
      url: "https://example.com/design",
      avatar: "/images/friends/avatar1.svg",
    },
    {
      name: "前端开发者",
      description: "分享前端技术和最佳实践",
      url: "https://example.com/frontend",
      avatar: "/images/friends/avatar2.svg",
    },
    {
      name: "技术博客",
      description: "探索最新的Web开发技术",
      url: "https://example.com/tech",
      avatar: "/images/friends/avatar3.svg",
    },
    {
      name: "创意工坊",
      description: "激发创意的灵感空间",
      url: "https://example.com/creative",
      avatar: "/images/friends/avatar4.svg",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <p className="text-center text-lg text-muted-foreground mb-10">
        感谢这些优秀的合作伙伴和友情站点，共同推动Web技术的发展。
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {friends.map((friend, index) => (
          <motion.div 
            key={friend.name}
            variants={slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={friend.url} target="_blank" rel="noopener noreferrer">
              <Card className="h-full hover:shadow-md transition-all hover:border-primary/50">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-primary">
                      {friend.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{friend.name}</h3>
                  <p className="text-sm text-muted-foreground">{friend.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}