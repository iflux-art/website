'use client';

import React, { useEffect, useRef } from 'react';
import { ResourceMdxWrapper } from '@/components/ui/resource/resource-mdx-wrapper';

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

  useEffect(() => {
    if (!contentRef.current) return;

    // 查找所有 data-resource-card 元素
    const resourceCardElements = contentRef.current.querySelectorAll('[data-resource-card]');

    resourceCardElements.forEach(element => {
      if (!(element instanceof HTMLElement)) return;

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

      // 渲染 ResourceCard 组件
      const cardElement = document.createElement('a');
      cardElement.href = url;
      cardElement.target = '_blank';
      cardElement.rel = 'noopener noreferrer';
      cardElement.className = 'block h-full';

      // 添加卡片内容
      cardElement.innerHTML = `
        <div class="h-full overflow-hidden hover:shadow-lg transition-all border border-border ${
          featured ? 'border-primary/30' : ''
        }">
          <div class="p-6 flex flex-col h-full">
            <div class="flex items-start justify-between mb-4">
              <div class="text-3xl">
                <span class="text-primary">${icon}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-muted-foreground">
                <path d="M7 7h10v10"></path>
                <path d="M7 17 17 7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">${title}</h3>
            <p class="text-muted-foreground text-sm flex-grow">${description}</p>
            ${
              tags
                ? `<div class="flex flex-wrap gap-2 mt-4">
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

    // 查找所有 data-resource-grid 元素
    const resourceGridElements = contentRef.current.querySelectorAll('[data-resource-grid]');

    resourceGridElements.forEach(element => {
      if (!(element instanceof HTMLElement)) return;

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
  }, []);

  return (
    <ResourceMdxWrapper>
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} className="mdx-content" />
    </ResourceMdxWrapper>
  );
}
