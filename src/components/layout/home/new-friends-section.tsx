"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FriendSite {
  name: string;
  description: string;
  url: string;
  icon?: string;
  image?: string;
}

/**
 * 新版友情链接区组件
 */
export function NewFriendsSection() {
  // 友情链接数据
  const friends: FriendSite[] = [
    {
      name: "设计之家",
      description: "专注于设计领域的分享平台",
      url: "https://example.com/design",
      icon: "🎨"
    },
    {
      name: "前端开发者",
      description: "分享前端技术和最佳实践",
      url: "https://example.com/frontend",
      icon: "💻"
    },
    {
      name: "技术博客",
      description: "探索最新的Web开发技术",
      url: "https://example.com/tech",
      icon: "🚀"
    },
    {
      name: "创意工坊",
      description: "激发创意的灵感空间",
      url: "https://example.com/creative",
      icon: "💡"
    },
    {
      name: "开源社区",
      description: "开源项目和社区资源",
      url: "https://example.com/opensource",
      icon: "🌐"
    },
    {
      name: "学习平台",
      description: "编程学习和教程资源",
      url: "https://example.com/learn",
      icon: "📚"
    },
  ];

  return (
    <section className="w-full py-10">
      <div className="container px-6 md:px-8 mx-auto w-full">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">友情链接</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            感谢这些优秀的合作伙伴和友情站点，共同推动Web技术的发展
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {friends.map((friend, index) => (
            <motion.div
              key={friend.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Link
                href={friend.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="h-full p-4 bg-card border border-border rounded-xl flex flex-col items-center text-center hover:shadow-md transition-all hover:border-primary/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-3">
                    {friend.icon}
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {friend.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    {friend.description}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>访问</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Button variant="outline" asChild>
            <Link href="/friends">
              申请友链
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
