"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Code2,
  Compass,
  FileText,
  Link2,
  MessageSquare,
  Users
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  index: number;
}

function FeatureCard({ icon, title, description, href, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Link
        href={href}
        className="block h-full group"
      >
        <div className="relative h-full p-6 bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary/0 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mr-4">
              {icon}
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>

          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * 特性展示区组件
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
export function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "文档中心",
      description: "查看详细的产品文档和使用指南，快速了解网站的各项功能。",
      href: "/docs"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "博客文章",
      description: "阅读最新的技术文章和分享，了解行业动态和前沿技术。",
      href: "/blog"
    },
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "代码示例",
      description: "浏览实用的代码示例和最佳实践，提高开发效率。",
      href: "/docs/examples"
    },
    {
      icon: <Compass className="h-6 w-6" />,
      title: "网站导航",
      description: "发现有用的开发资源和工具，助力您的开发工作更加高效。",
      href: "/navigation"
    },
    {
      icon: <Link2 className="h-6 w-6" />,
      title: "友情链接",
      description: "查看合作伙伴和友情站点，拓展您的技术社区网络。",
      href: "/friends"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "联系我们",
      description: "有任何问题或建议，欢迎随时与我们联系。",
      href: "/contact"
    }
  ];

  return (
    <section className="w-full py-10">
      <div className="container px-6 md:px-8 mx-auto w-full">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">探索我们的功能</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            全面的功能和资源，满足您的各种需求
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              href={feature.href}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
