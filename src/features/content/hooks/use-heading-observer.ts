'use client';

import { useState, useEffect } from 'react';
import type { Heading } from '@/types/content-types';

export function useHeadingObserver(
  headings: Heading[],
  options = {
    rootMargin: '-100px 0px -80% 0px',
    threshold: 0.1,
  }
) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    // 创建一个共享的 IntersectionObserver 实例
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, options);

    // 确保所有标题都有ID
    const ensureHeadingIds = () => {
      headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (!element) {
          // 查找匹配文本内容的标题元素
          const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
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
