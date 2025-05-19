"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  name: string;
  url: string;
  description: string;
  icon?: string;
}

interface NavigationCategory {
  title: string;
  items: NavigationItem[];
}

/**
 * 网站导航区组件
 */
export function NavigationSection() {
  // 网站导航数据
  const navigationItems: NavigationCategory[] = [
    {
      title: "开发工具",
      items: [
        { name: "VS Code", url: "https://code.visualstudio.com/", description: "强大的代码编辑器", icon: "🧰" },
        { name: "GitHub", url: "https://github.com/", description: "代码托管平台", icon: "🐙" },
        { name: "Vercel", url: "https://vercel.com/", description: "前端部署平台", icon: "▲" },
        { name: "CodeSandbox", url: "https://codesandbox.io/", description: "在线代码编辑器", icon: "📦" },
      ],
    },
    {
      title: "设计资源",
      items: [
        { name: "Figma", url: "https://www.figma.com/", description: "在线设计工具", icon: "🎨" },
        { name: "Unsplash", url: "https://unsplash.com/", description: "免费高质量图片", icon: "📷" },
        { name: "Iconify", url: "https://iconify.design/", description: "图标库", icon: "🔍" },
        { name: "Dribbble", url: "https://dribbble.com/", description: "设计灵感平台", icon: "🏀" },
      ],
    },
    {
      title: "学习资源",
      items: [
        { name: "MDN", url: "https://developer.mozilla.org/", description: "Web开发文档", icon: "📚" },
        { name: "React文档", url: "https://react.dev/", description: "React官方文档", icon: "⚛️" },
        { name: "Next.js文档", url: "https://nextjs.org/docs", description: "Next.js官方文档", icon: "📘" },
        { name: "CSS Tricks", url: "https://css-tricks.com/", description: "CSS技巧和教程", icon: "🎯" },
      ],
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">网站导航</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            精选优质的开发资源和工具，助力您的开发工作更加高效
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {navigationItems.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 pb-2 border-b">
                    {category.title}
                  </h3>
                  <ul className="space-y-4">
                    {category.items.map((item) => (
                      <li key={item.name} className="group">
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start hover:text-primary transition-colors"
                        >
                          <div className="mr-3 text-xl mt-0.5">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium group-hover:text-primary transition-colors">
                                {item.name}
                              </span>
                              <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-sm text-muted-foreground block">
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
          <Button asChild>
            <Link href="/navigation">
              查看更多资源
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
