"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { fadeIn } from "@/lib/animations";

export default function FriendsPage() {
  // 友情链接数据
  const friendLinks = [
    {
      name: "示例博客",
      url: "https://example.com/blog",
      desc: "一个分享技术与生活的个人博客",
      icon: "A",
    },
    {
      name: "技术笔记",
      url: "https://example.com/notes",
      desc: "记录学习与开发过程的技术博客",
      icon: "B",
    },
    {
      name: "前端开发",
      url: "https://example.com/tech",
      desc: "专注于前端技术分享的网站",
      icon: "C",
    },
    {
      name: "设计灵感",
      url: "https://example.com/design",
      desc: "分享UI/UX设计理念与案例",
      icon: "D",
    },
  ];

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">友情链接</h1>
      <p className="text-muted-foreground mb-8">
        感谢以下朋友对本站的支持与帮助，欢迎互相交流学习。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* 友链卡片 - 使用导航页面的卡片样式 */}
        {friendLinks.map((link, index) => (
          <motion.div
            key={link.url}
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">
                    {link.icon}
                  </div>
                  <div>
                    <div className="font-medium">{link.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {link.desc}
                    </div>
                  </div>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 p-6 border border-border rounded-lg bg-muted/30">
        <h2 className="text-xl font-semibold mb-4">申请友链</h2>
        <p className="mb-4">
          如果您想与本站交换友链，请确保您的网站符合以下条件：
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>网站内容健康，无违法内容</li>
          <li>网站已稳定运行3个月以上</li>
          <li>网站有原创内容，且定期更新</li>
          <li>已添加本站为友链</li>
        </ul>
        <div className="mt-6">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            申请友链
          </button>
        </div>
      </div>
    </main>
  );
}
