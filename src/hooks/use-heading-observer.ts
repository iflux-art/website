"use client";

import type { Heading } from "@/features/navbar/types";
import { useEffect, useState, useRef } from "react";

export function useHeadingObserver(
  headings: Heading[],
  options = {
    rootMargin: "-100px 0px -80% 0px",
    threshold: 0.1,
  }
) {
  const [activeId, setActiveId] = useState<string>("");
  const clickedHeadingRef = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // 监听URL哈希变化，以检测标题点击
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && headings.some(h => h.id === hash)) {
        clickedHeadingRef.current = hash;
        setActiveId(hash);

        // 设置一个短暂的超时，在此期间保持点击的标题为活动状态
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          clickedHeadingRef.current = null;
        }, 1000); // 1秒后恢复正常的观察行为
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    // 初始化时检查哈希
    if (window.location.hash) {
      handleHashChange();
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [headings]);

  useEffect(() => {
    if (headings.length === 0) return;

    // 创建一个共享的 IntersectionObserver 实例
    const observer = new IntersectionObserver(entries => {
      // 如果有明确点击的标题，优先使用它
      if (clickedHeadingRef.current) return;

      // 收集所有当前可见的标题
      const visibleHeadings = entries
        .filter(entry => entry.isIntersecting)
        .map(entry => ({
          id: entry.target.id,
          top: entry.boundingClientRect.top,
        }));

      if (visibleHeadings.length === 0) return;

      // 按照在页面中的位置排序（从上到下）
      visibleHeadings.sort((a, b) => a.top - b.top);

      // 选择最上方的可见标题作为活动标题
      // 修复：添加空值检查
      const firstVisibleHeading = visibleHeadings[0];
      if (firstVisibleHeading) {
        setActiveId(firstVisibleHeading.id);
      }
    }, options);

    // 确保所有标题都有ID
    const ensureHeadingIds = () => {
      headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (!element) {
          // 查找匹配文本内容的标题元素
          const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
          headingElements.forEach(el => {
            if (el.textContent?.trim() === heading.text) {
              if (!el.id) {
                el.id = heading.id;
              }
            }
          });
        }
      });
    };

    // 初始化和延迟检查
    ensureHeadingIds();
    const initTimeout = setTimeout(ensureHeadingIds, 500);

    // 观察所有标题
    const observeHeadings = () => {
      headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.observe(element);
        }
      });
    };

    const observeTimeout = setTimeout(observeHeadings, 100);

    return () => {
      observer.disconnect();
      clearTimeout(initTimeout);
      clearTimeout(observeTimeout);
    };
  }, [headings, options]);

  return activeId;
}
