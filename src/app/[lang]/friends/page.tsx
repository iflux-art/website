"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { fadeIn } from "@/lib/animations";

export default function FriendsPage({ params }: { params: { lang: string } }) {
  const resolvedParams = React.use(params);

  // 友情链接数据
  const getFriendLinks = (lang: string) => [
    {
      name: lang === "zh" ? "示例博客" : "Sample Blog",
      url: "https://example.com/blog",
      desc:
        lang === "zh"
          ? "一个分享技术与生活的个人博客"
          : "A personal blog sharing technology and life",
      icon: "A",
    },
    {
      name: lang === "zh" ? "技术笔记" : "Tech Notes",
      url: "https://example.com/notes",
      desc:
        lang === "zh"
          ? "记录学习与开发过程的技术博客"
          : "A technical blog recording learning and development processes",
      icon: "B",
    },
    {
      name: lang === "zh" ? "前端开发" : "Frontend Dev",
      url: "https://example.com/tech",
      desc:
        lang === "zh"
          ? "专注于前端技术分享的网站"
          : "A website focused on frontend technology sharing",
      icon: "C",
    },
    {
      name: lang === "zh" ? "设计灵感" : "Design Inspiration",
      url: "https://example.com/design",
      desc:
        lang === "zh"
          ? "分享UI/UX设计理念与案例"
          : "Sharing UI/UX design concepts and cases",
      icon: "D",
    },
  ];

  const friendLinks = getFriendLinks(resolvedParams.lang);

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">
        {resolvedParams.lang === "zh" ? "友情链接" : "Friend Links"}
      </h1>
      <p className="text-muted-foreground mb-8">
        {resolvedParams.lang === "zh"
          ? "感谢以下朋友对本站的支持与帮助，欢迎互相交流学习。"
          : "Thanks to the following friends for their support and help to this site. Welcome to communicate and learn from each other."}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <h2 className="text-xl font-semibold mb-4">
          {resolvedParams.lang === "zh" ? "申请友链" : "Apply for Friend Link"}
        </h2>
        <p className="mb-4">
          {resolvedParams.lang === "zh"
            ? "如果您想与本站交换友链，请确保您的网站符合以下条件："
            : "If you want to exchange friend links with this site, please make sure your website meets the following conditions:"}
        </p>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>
            {resolvedParams.lang === "zh"
              ? "网站内容健康，无违法内容"
              : "Website content is healthy, without illegal content"}
          </li>
          <li>
            {resolvedParams.lang === "zh"
              ? "网站已稳定运行3个月以上"
              : "The website has been running stably for more than 3 months"}
          </li>
          <li>
            {resolvedParams.lang === "zh"
              ? "网站有原创内容，且定期更新"
              : "The website has original content and is updated regularly"}
          </li>
          <li>
            {resolvedParams.lang === "zh"
              ? "已添加本站为友链"
              : "Has added this site as a friend link"}
          </li>
        </ul>
        <div className="mt-6">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            {resolvedParams.lang === "zh" ? "申请友链" : "Apply Now"}
          </button>
        </div>
      </div>
    </main>
  );
}
