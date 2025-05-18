"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Heading = {
  id: string;
  text: string;
  level: number;
};

interface TableOfContentsProps {
  headings: Heading[];
  lang: string;
}

export function TableOfContents({ headings, lang }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  // 监听滚动，高亮当前可见的标题
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    // 观察所有标题元素
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        {lang === "zh" ? "无目录" : "No table of contents"}
      </div>
    );
  }

  // 根据标题级别对目录进行分组和嵌套
  const organizeHeadings = (headings: Heading[]) => {
    // 确保标题ID唯一性
    const processedHeadings = headings.map((heading, index) => {
      // 如果ID为空或者不存在，生成一个基于文本的ID
      if (!heading.id) {
        heading.id = `heading-${heading.text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${index}`;
      }
      return heading;
    });
    
    const result: Heading[] = [];
    const stack: Heading[] = [];
    
    processedHeadings.forEach(heading => {
      // 处理标题层级关系
      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }
      
      const newHeading = { ...heading };
      result.push(newHeading);
      stack.push(newHeading);
    });
    
    return result;
  };
  
  const organizedHeadings = organizeHeadings(headings);
  
  // 动画变体
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };
  
  return (
    <motion.div 
      className="space-y-1 text-sm"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {organizedHeadings.map((heading, index) => {
        // 计算缩进，根据标题级别
        const indent = (heading.level - 2) * 0.75;

        return (
          <motion.a
            key={index}
            href={`#${heading.id}`}
            className={cn(
              "block py-1 transition-colors hover:text-primary",
              {
                "text-primary font-medium": activeId === heading.id,
                "text-muted-foreground": activeId !== heading.id,
              }
            )}
            style={{ paddingLeft: `${indent}rem` }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            variants={item}
          >
            {heading.text}
          </motion.a>
        );
      })}
    </motion.div>
  );
}