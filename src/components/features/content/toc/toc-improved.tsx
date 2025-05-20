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

    // 确保所有标题都有ID并且可以被正确观察
    const checkAndFixHeadingIds = () => {
      headings.forEach((heading) => {
        // 检查元素是否存在
        if (!document.getElementById(heading.id)) {
          // 查找匹配文本内容的标题元素
          const headingElements = document.querySelectorAll('h2, h3, h4');
          headingElements.forEach((el) => {
            if (el.textContent?.trim() === heading.text && !el.id) {
              // 为没有ID的标题元素添加ID
              el.id = heading.id;
            }
          });
        }
      });
    };

    // 页面加载后检查并修复标题ID
    setTimeout(checkAndFixHeadingIds, 500);

    // 再次尝试修复标题ID，以防第一次尝试失败
    setTimeout(checkAndFixHeadingIds, 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);

            // 当标题进入视图时，只更新本地状态，不再设置全局属性
            const visibleHeading = entry.target.textContent;
            // 移除设置全局属性的代码，使导航栏不再跟随目录变化
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px", threshold: 0.1 }
    );

    // 观察所有标题元素
    const observeHeadings = () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.observe(element);
        } else {
          console.log(`找不到ID为 ${heading.id} 的标题元素，文本内容: ${heading.text}`);
          // 尝试通过文本内容查找
          const headingElements = document.querySelectorAll('h2, h3, h4');
          let found = false;
          headingElements.forEach((el) => {
            if (el.textContent?.trim() === heading.text) {
              if (!el.id) {
                el.id = heading.id;
              }
              observer.observe(el);
              found = true;
            }
          });
          if (!found) {
            console.log(`无法通过文本内容找到标题: ${heading.text}`);
          }
        }
      });
    };

    // 延迟观察以确保DOM已完全加载
    setTimeout(observeHeadings, 1000);

    // 再次尝试观察，以防第一次尝试失败
    setTimeout(observeHeadings, 2000);

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  // 如果没有标题，返回null，不显示任何内容
  if (!headings || headings.length === 0) {
    return null;
  }

  // 过滤掉h1标题，只显示h2-h4
  const filteredHeadings = headings.filter(heading => heading.level >= 2 && heading.level <= 4);

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

  // 如果过滤后没有标题，返回null，不显示任何内容
  if (filteredHeadings.length === 0) {
    return null;
  }

  const organizedHeadings = organizeHeadings(filteredHeadings);

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
    <div className="pl-0">
      <motion.div
        className="py-2 pl-0"
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
                  "flex items-center py-1.5 text-sm transition-colors hover:text-primary group",
                  headingSize,
                  {
                    "text-primary bg-primary/5":
                      activeId === heading.id,
                    "text-foreground/70": activeId !== heading.id,
                  }
                )}
                style={{ paddingLeft: heading.level > 2 ? `${indent}rem` : "0.25rem" }}
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
                    "h-3.5 w-3.5 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity ml-0",
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
