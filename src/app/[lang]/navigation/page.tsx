"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fadeIn, slideUp } from "@/lib/animations";

export default function NavigationPage({ params }: { params: { lang: string } }) {
  const resolvedParams = React.use(params);
  
  // 根据语言获取导航分类数据
  const getNavigationCategories = (lang: string) => {
    if (lang === 'zh') {
      return [
        { 
          id: 'ai', 
          name: 'AI 工具', 
          icon: '🤖', 
          description: 'AI对话、图像生成、音频处理等智能工具集合',
          count: 6
        },
        { 
          id: 'design', 
          name: '设计资源', 
          icon: '🎨', 
          description: 'UI设计、配色、字体、插画等设计相关资源',
          count: 6
        },
        { 
          id: 'frontend', 
          name: '前端开发', 
          icon: '💻', 
          description: '前端框架、构建工具、组件库等开发资源',
          count: 6
        },
        { 
          id: 'backend', 
          name: '后端开发', 
          icon: '⚙️', 
          description: '后端框架、数据库、缓存等服务端技术',
          count: 6
        },
        { 
          id: 'devops', 
          name: '运维部署', 
          icon: '🚀', 
          description: '容器化、CI/CD、云服务等部署工具',
          count: 6
        },
        { 
          id: 'productivity', 
          name: '效率工具', 
          icon: '⚡', 
          description: '提升工作效率的各类实用工具',
          count: 6
        },
        { 
          id: 'learning', 
          name: '学习资源', 
          icon: '📚', 
          description: '编程学习、教程、文档等知识资源',
          count: 6
        },
        { 
          id: 'community', 
          name: '开发社区', 
          icon: '👥', 
          description: '技术社区、论坛、问答平台等交流场所',
          count: 6
        }
      ];
    } else {
      return [
        { 
          id: 'ai', 
          name: 'AI Tools', 
          icon: '🤖', 
          description: 'Collection of AI conversation, image generation, audio processing tools',
          count: 6
        },
        { 
          id: 'design', 
          name: 'Design Resources', 
          icon: '🎨', 
          description: 'UI design, color schemes, fonts, illustrations and other design resources',
          count: 6
        },
        { 
          id: 'frontend', 
          name: 'Frontend Development', 
          icon: '💻', 
          description: 'Frontend frameworks, build tools, component libraries',
          count: 6
        },
        { 
          id: 'backend', 
          name: 'Backend Development', 
          icon: '⚙️', 
          description: 'Backend frameworks, databases, caching services',
          count: 6
        },
        { 
          id: 'devops', 
          name: 'DevOps', 
          icon: '🚀', 
          description: 'Containerization, CI/CD, cloud services',
          count: 6
        },
        { 
          id: 'productivity', 
          name: 'Productivity Tools', 
          icon: '⚡', 
          description: 'Practical tools to improve work efficiency',
          count: 6
        },
        { 
          id: 'learning', 
          name: 'Learning Resources', 
          icon: '📚', 
          description: 'Programming tutorials, documentation, knowledge resources',
          count: 6
        },
        { 
          id: 'community', 
          name: 'Developer Communities', 
          icon: '👥', 
          description: 'Technical communities, forums, Q&A platforms',
          count: 6
        }
      ];
    }
  };
    
  const navigationCategories = getNavigationCategories(resolvedParams.lang);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <main className="container mx-auto py-10 px-4">
      <motion.div
        ref={ref}
        variants={fadeIn}
        initial="initial"
        animate={inView ? "animate" : "initial"}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">
          {resolvedParams.lang === 'zh' ? '网站导航' : 'Site Navigation'}
        </h1>
        <p className="text-muted-foreground mb-10 max-w-3xl">
          {resolvedParams.lang === 'zh' 
            ? '浏览我们精选的各类网站资源，提升您的工作效率和开发体验。' 
            : 'Browse our curated collection of websites to enhance your productivity and development experience.'}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6">
          {navigationCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={slideUp}
              initial="initial"
              animate={inView ? "animate" : "initial"}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full overflow-hidden hover:shadow-md transition-all border border-border group">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <h2 className="text-xl font-semibold">{category.name}</h2>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resolvedParams.lang === 'zh' 
                      ? `${category.count} 个资源` 
                      : `${category.count} resource${category.count > 1 ? 's' : ''}`}
                  </p>
                </CardContent>
                <CardFooter className="p-0">
                  <Link 
                    href={`/${resolvedParams.lang}/navigation/${category.id}`} 
                    className="w-full p-3 sm:p-4 bg-muted/50 group-hover:bg-muted flex items-center justify-between text-primary transition-colors"
                  >
                    <span>{resolvedParams.lang === 'zh' ? '浏览资源' : 'Browse resources'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}