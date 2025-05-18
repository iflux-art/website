"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { slideUp } from "@/lib/animations";

export function NavigationSection() {
  // 网站导航数据
  const navigationItems = [
    {
      title: "开发工具",
      items: [
        { name: "VS Code", url: "https://code.visualstudio.com/", description: "强大的代码编辑器" },
        { name: "GitHub", url: "https://github.com/", description: "代码托管平台" },
        { name: "Vercel", url: "https://vercel.com/", description: "前端部署平台" },
      ],
    },
    {
      title: "设计资源",
      items: [
        { name: "Figma", url: "https://www.figma.com/", description: "在线设计工具" },
        { name: "Unsplash", url: "https://unsplash.com/", description: "免费高质量图片" },
        { name: "Iconify", url: "https://iconify.design/", description: "图标库" },
      ],
    },
    {
      title: "学习资源",
      items: [
        { name: "MDN", url: "https://developer.mozilla.org/", description: "Web开发文档" },
        { name: "React文档", url: "https://react.dev/", description: "React官方文档" },
        { name: "Next.js文档", url: "https://nextjs.org/docs", description: "Next.js官方文档" },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <p className="text-center text-lg text-muted-foreground mb-10">
        精选优质的开发资源和工具，助力您的开发工作更加高效。
      </p>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {navigationItems.map((category, categoryIndex) => (
          <motion.div 
            key={category.title}
            variants={slideUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col hover:text-primary transition-colors"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}