'use client';

import React, { useEffect, useRef } from 'react';

interface MdxContentWrapperProps {
  html: string;
}

/**
 * MDX 内容包装器组件
 *
 * 用于包装和处理 MDX 内容
 */
export function MdxContentWrapper({ html }: MdxContentWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 使用 useEffect 确保只在客户端执行，并且只执行一次
  useEffect(() => {
    if (!contentRef.current) return;

    // 创建一个函数来处理卡片，这样可以在多个地方调用
    const processCards = () => {
      if (!contentRef.current) return;

      try {
        // 查找所有 data-resource-card 元素
        const resourceCardElements = contentRef.current.querySelectorAll(
          '[data-resource-card]:not([data-processed="true"])'
        );

        if (resourceCardElements.length > 0) {
          console.log(`Processing ${resourceCardElements.length} resource cards in MDX wrapper`);

          resourceCardElements.forEach(element => {
            if (!(element instanceof HTMLElement)) return;

            // 标记元素为已处理，防止重复处理
            element.setAttribute('data-processed', 'true');

            // 获取属性
            const title = element.getAttribute('title') || '';
            const description = element.getAttribute('description') || '';
            const url = element.getAttribute('url') || '';
            const icon = element.getAttribute('icon') || '';
            const tags = element.getAttribute('tags') || '';
            const featured = element.getAttribute('data-featured') === 'true';

            // 创建 ResourceCard 组件
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card-container';
            resourceCard.setAttribute('data-permanent', 'true'); // 标记为永久元素

            // 渲染 ResourceCard 组件
            const cardElement = document.createElement('a');
            cardElement.href = url;
            cardElement.target = '_blank';
            cardElement.rel = 'noopener noreferrer';
            cardElement.className = 'block h-full';

            // 添加卡片内容
            cardElement.innerHTML = `
              <div class="h-3/4 overflow-hidden hover:shadow-lg transition-all border border-border rounded-lg ${
                featured ? 'border-primary/30' : ''
              }">
                <div class="p-4 flex flex-col h-full">
                  <div class="flex items-start mb-3">
                    <div class="text-3xl">
                      <span class="text-primary">${icon}</span>
                    </div>
                  </div>
                  <h3 class="text-xl font-semibold mb-2">${title}</h3>
                  <p class="text-muted-foreground text-sm flex-grow">${description}</p>
                  ${
                    tags
                      ? `<div class="flex flex-wrap gap-2 mt-3">
                      ${tags
                        .split(',')
                        .map(
                          tag =>
                            `<span class="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">${tag.trim()}</span>`
                        )
                        .join('')}
                    </div>`
                      : ''
                  }
                  ${
                    featured
                      ? `<div class="absolute top-2 right-2">
                      <span class="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">精选</span>
                    </div>`
                      : ''
                  }
                </div>
              </div>
            `;

            resourceCard.appendChild(cardElement);

            // 替换原始元素
            if (element.parentNode) {
              element.parentNode.replaceChild(resourceCard, element);
            }
          });
        }

        // 处理网格元素
        const resourceGridElements = contentRef.current.querySelectorAll(
          '[data-resource-grid]:not([data-processed="true"])'
        );

        if (resourceGridElements.length > 0) {
          resourceGridElements.forEach(element => {
            if (!(element instanceof HTMLElement)) return;

            // 标记元素为已处理
            element.setAttribute('data-processed', 'true');

            // 获取属性
            const columns = element.getAttribute('columns') || '3';

            // 添加网格样式
            element.className = `grid gap-6 my-8 ${
              columns === '1'
                ? 'grid-cols-1'
                : columns === '2'
                ? 'grid-cols-1 md:grid-cols-2'
                : columns === '4'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`;
          });
        }
      } catch (error) {
        console.error('Error processing MDX content:', error);
      }
    };

    // 初始处理 - 延迟执行确保DOM已加载
    const initialTimer = setTimeout(() => {
      processCards();

      // 设置 MutationObserver 监视 DOM 变化
      if (!observerRef.current && contentRef.current) {
        observerRef.current = new MutationObserver(() => {
          // 当 DOM 变化时处理卡片
          processCards();
        });

        // 开始观察
        observerRef.current.observe(contentRef.current, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      }

      // 设置定期检查，确保卡片不会消失
      if (!intervalRef.current) {
        intervalRef.current = setInterval(processCards, 1000);
      }
    }, 200);

    // 清理函数
    return () => {
      clearTimeout(initialTimer);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={contentRef}
      dangerouslySetInnerHTML={{ __html: html }}
      className="mdx-content prose dark:prose-invert prose-neutral max-w-none"
    />
  );
}
