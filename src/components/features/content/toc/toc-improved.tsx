"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Hash } from "lucide-react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContentsImproved({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  // 监听滚动，高亮当前可见的标题
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);

            // 当标题进入视图时，更新文档标题属性，便于导航栏获取
            const visibleHeading = entry.target.textContent;
            if (visibleHeading) {
              // 设置自定义数据属性，供导航栏组件读取当前可见标题
              document.documentElement.setAttribute(
                "data-current-heading",
                visibleHeading
              );
            }
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
      // 清理自定义数据属性
      document.documentElement.removeAttribute("data-current-heading");
    };
  }, [headings]);

  if (headings.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center border-t border-border/30">
        无目录
      </div>
    );
  }

  // 根据标题级别对目录进行分组和嵌套
  const organizeHeadings = (headings: Heading[]) => {
    // 确保标题ID唯一性
    const processedHeadings = headings.map((heading, index) => {
      // 如果ID为空或者不存在，生成一个基于文本的ID
      if (!heading.id) {
        heading.id = `heading-${heading.text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "")}-${index}`;
      }
      return heading;
    });

    // 按照标题级别进行排序和分组
    return processedHeadings.sort((a, b) => {
      // 首先按级别排序
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      // 如果级别相同，保持原有顺序
      return (
        headings.findIndex((h) => h.id === a.id) -
        headings.findIndex((h) => h.id === b.id)
      );
    });
  };

  const organizedHeadings = organizeHeadings(headings);

  // 动画变体
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -5 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div>
      <motion.div
        className="py-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {organizedHeadings.map((heading, index) => {
            // 计算缩进，根据标题级别
            const indent = (heading.level - 2) * 0.75;

            // 根据标题级别设置不同的样式
            const headingSize =
              {
                2: "font-medium",
                3: "font-normal",
                4: "text-xs",
              }[heading.level] || "";

            return (
              <motion.a
                key={index}
                href={`#${heading.id}`}
                className={cn(
                  "flex items-center py-1.5 px-4 text-sm transition-colors hover:text-primary group",
                  headingSize,
                  {
                    "text-primary font-medium bg-primary/5":
                      activeId === heading.id,
                    "text-foreground/70": activeId !== heading.id,
                  }
                )}
                style={{ paddingLeft: `${indent + 1}rem` }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                variants={item}
              >
                <Hash
                  className={cn(
                    "h-3.5 w-3.5 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
                    activeId === heading.id ? "opacity-100" : ""
                  )}
                />
                <span className="truncate">{heading.text}</span>
              </motion.a>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
