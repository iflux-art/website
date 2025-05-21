"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Hash } from "lucide-react";
import { Heading, TableOfContentsProps } from "./toc-improved.types";

export function TableOfContentsImproved({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const tocRef = useRef<HTMLDivElement>(null);

  // 自动滚动目录到当前活动标题
  useEffect(() => {
    if (activeId && tocRef.current) {
      const activeElement = tocRef.current.querySelector(`a[href="#${activeId}"]`);
      if (activeElement) {
        // 计算需要滚动的位置
        const containerRect = tocRef.current.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();

        // 检查活动元素是否在可视区域内
        const isInView = (
          activeRect.top >= containerRect.top &&
          activeRect.bottom <= containerRect.bottom
        );

        // 如果不在可视区域内，滚动到该元素
        if (!isInView) {
          const scrollTop = activeRect.top - containerRect.top - containerRect.height / 2 + activeRect.height / 2;
          tocRef.current.scrollTo({
            top: tocRef.current.scrollTop + scrollTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeId]);

  // 监听滚动，高亮当前可见的标题
  useEffect(() => {
    if (headings.length === 0) return;

    // 确保所有标题都有ID并且可以被正确观察
    const checkAndFixHeadingIds = () => {
      headings.forEach((heading) => {
        // 检查元素是否存在
        if (!document.getElementById(heading.id)) {
          // 查找匹配文本内容的标题元素
          const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headingElements.forEach((el) => {
            if (el.textContent?.trim() === heading.text) {
              // 为没有ID的标题元素添加ID
              if (!el.id) {
                el.id = heading.id;
                console.log(`为标题 "${heading.text}" 添加ID: ${heading.id}`);
              } else if (el.id !== heading.id) {
                // 如果元素已有ID但与我们的不同，记录下来
                console.log(`标题 "${heading.text}" 已有ID: ${el.id}，与预期的 ${heading.id} 不同`);
              }
            }
          });
        }
      });
    };

    // 页面加载后立即检查并修复标题ID
    checkAndFixHeadingIds();

    // 延迟再次检查，以防DOM还未完全加载
    setTimeout(checkAndFixHeadingIds, 500);

    // 再次尝试修复标题ID，以防第一次尝试失败
    setTimeout(checkAndFixHeadingIds, 1500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);

            // 当标题进入视图时，只更新本地状态，不再设置全局属性
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
          console.log(`正在观察ID为 ${heading.id} 的标题元素: ${heading.text}`);
        } else {
          console.log(`找不到ID为 ${heading.id} 的标题元素，文本内容: ${heading.text}`);
          // 尝试通过文本内容查找
          const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          let found = false;
          headingElements.forEach((el) => {
            if (el.textContent?.trim() === heading.text) {
              if (!el.id) {
                el.id = heading.id;
                console.log(`为标题 "${heading.text}" 添加ID: ${heading.id}`);
              }
              observer.observe(el);
              console.log(`通过文本内容找到并观察标题: ${heading.text}`);
              found = true;
            }
          });
          if (!found) {
            // 尝试使用部分文本匹配
            headingElements.forEach((el) => {
              if (el.textContent && el.textContent.includes(heading.text)) {
                if (!el.id) {
                  el.id = heading.id;
                  console.log(`为部分匹配的标题 "${el.textContent}" 添加ID: ${heading.id}`);
                }
                observer.observe(el);
                console.log(`通过部分文本匹配找到并观察标题: ${heading.text}`);
                found = true;
              }
            });

            if (!found) {
              console.log(`无法通过文本内容找到标题: ${heading.text}`);
            }
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
        ref={tocRef}
        className="py-2 pl-0 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-hide"
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
                  const element = document.getElementById(heading.id);
                  if (element) {
                    // 滚动到元素位置，并添加一些偏移以避免被导航栏遮挡
                    const offset = 80; // 根据您的导航栏高度调整
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                    });

                    // 更新 URL 中的锚点，但不触发滚动
                    history.pushState(null, "", `#${heading.id}`);

                    // 设置活动 ID
                    setActiveId(heading.id);
                  } else {
                    console.error(`找不到ID为 ${heading.id} 的元素`);

                    // 尝试通过文本内容查找元素
                    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                    let found = false;

                    headingElements.forEach((el) => {
                      if (el.textContent?.trim() === heading.text) {
                        // 如果找到匹配的元素但没有 ID，添加 ID
                        if (!el.id) {
                          el.id = heading.id;
                        }

                        // 滚动到元素位置
                        const offset = 80;
                        const elementPosition = el.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth"
                        });

                        // 更新 URL 中的锚点
                        history.pushState(null, "", `#${el.id}`);

                        // 设置活动 ID
                        setActiveId(el.id);

                        found = true;
                      }
                    });

                    if (!found) {
                      console.error(`无法通过文本内容找到标题: ${heading.text}`);
                    }
                  }
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
