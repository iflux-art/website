'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ProcessingState {
  readonly isProcessing: boolean;
  readonly error: Error | null; 
  readonly processedCount: number;
  readonly totalCount: number;
  readonly remainingTasks: number;
  readonly failedTasks: number;
  readonly averageProcessingTime: number;
}

type AnyFunction = (...args: unknown[]) => void;

const debounce = <F extends AnyFunction>(fn: F, delay: number): ((...args: Parameters<F>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

interface ResourceCardProps {
  title: string;
  description: string;
  url: string;
  icon: string;
  tags: string[];
  featured: boolean;
}

interface ResourceGridProps {
  columns: '1' | '2' | '3' | '4';
}

interface MdxContentWrapperProps {
  html: string;
}

const CONFIG = {
  PROCESSING_INTERVAL: 2000,
  INITIAL_DELAY: 100,
  MAX_RETRIES: 3,
  DEBOUNCE_DELAY: 250,
  BATCH_SIZE: 10,
  CACHE_MAX_AGE: 3600000,
  CLEANUP_INTERVAL: 300000,
  MAX_CONCURRENT_TASKS: 3,
  MIN_BATCH_SIZE: 5,
  MAX_BATCH_SIZE: 20,
  ADAPTIVE_THRESHOLD: 16,
  INTERSECTION_THRESHOLD: 0.1,
  RECOVERY_DELAY: 5000,
  INTERSECTION_ROOT_MARGIN: '50px',
} as const;

class MDXProcessingError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'MDXProcessingError';
  }
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const getGridColumns = (columns: ResourceGridProps['columns']): string => {
  const columnMap = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  return columnMap[columns];
};

/**
 * 创建资源卡片HTML
 */
const createResourceCardHTML = ({
  title,
  description,
  url,
  icon,
  tags,
  featured,
}: ResourceCardProps): string => {
  // 验证URL
  if (!isValidUrl(url)) {
    throw new MDXProcessingError(`Invalid URL: ${url}`);
  }

  // 转义所有文本内容
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeIcon = escapeHtml(icon);

  // 处理标签列表
  const tagsList = tags.length
    ? `<div class="flex flex-wrap gap-2 mt-3">
        ${tags
          .map(tag => `<span class="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">${escapeHtml(tag.trim())}</span>`)
          .join('')}
      </div>`
    : '';

  // 处理精选标识
  const featuredBadge = featured
    ? `<div class="absolute top-2 right-2">
        <span class="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">精选</span>
      </div>`
    : '';

  return `
    <div class="h-3/4 overflow-hidden hover:shadow-lg transition-all border border-border rounded-lg ${
      featured ? 'border-primary/30' : ''
    }">
      <div class="p-4 flex flex-col h-full">
        <div class="flex items-start mb-3">
          <div class="text-3xl">
            <span class="text-primary">${safeIcon}</span>
          </div>
        </div>
        <h3 class="text-xl font-semibold mb-2">${safeTitle}</h3>
        <p class="text-muted-foreground text-sm flex-grow">${safeDescription}</p>
        ${tagsList}
        ${featuredBadge}
      </div>
    </div>
  `;
};
<edit>
        if (element.hasAttribute('data-resource-card')) {
          const parent = element.parentElement;
          if (parent instanceof HTMLElement) {
            processResourceCards(parent);
          }
        } else if (element.hasAttribute('data-resource-grid')) {
          const parent = element.parentElement;
          if (parent instanceof HTMLElement) {
            processResourceGrids(parent);
          }
        }

/**
 * 验证URL是否合法
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 转义HTML特殊字符以防止XSS攻击
 */
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
/**
 * 创建资源卡片HTML
 */
const createResourceCardHTML = ({
  title,
  description,
  url,
  icon,
  tags,
  featured,
}: ResourceCardProps): string => {
  // 验证URL
  if (!isValidUrl(url)) {
    throw new MDXProcessingError(`Invalid URL: ${url}`);
  }

  // 转义所有文本内容
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeIcon = escapeHtml(icon);

  return `
    <div class="h-3/4 overflow-hidden hover:shadow-lg transition-all border border-border rounded-lg ${
      featured ? 'border-primary/30' : ''
    }">
      <div class="p-4 flex flex-col h-full">
        <div class="flex items-start mb-3">
          <div class="text-3xl">
            <span class="text-primary">${safeIcon}</span>
          </div>
        </div>
        <h3 class="text-xl font-semibold mb-2">${safeTitle}</h3>
        <p class="text-muted-foreground text-sm flex-grow">${safeDescription}</p>
        ${
          tags.length
            ? `<div class="flex flex-wrap gap-2 mt-3">
            ${tags
              .map(tag => `<span class="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">${escapeHtml(tag.trim())}</span>`)
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
};
/**
 * 获取网格列类名
 */
const getGridColumns = (columns: ResourceGridProps['columns']): string => {
  const columnMap = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  return columnMap[columns];
};
/**
 * MDX内容包装器组件
 * 处理和渲染MDX内容中的自定义组件，包括资源卡片和网格布局
 */
export function MdxContentWrapper({ html }: MdxContentWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    error: null,
    processedCount: 0,
    totalCount: 0,
    remainingTasks: 0,
    failedTasks: 0,
    averageProcessingTime: 0
  });
  /**
   * 处理资源卡片
   */
  const processResourceCards = (container: HTMLElement) => {
    const resourceCardElements = container.querySelectorAll<HTMLElement>(
      '[data-resource-card]:not([data-processed="true"])'
    );

    resourceCardElements.forEach(element => {
      try {
        element.setAttribute('data-processed', 'true');

        const cardProps: ResourceCardProps = {
          title: element.getAttribute('title') || '',
          description: element.getAttribute('description') || '',
          url: element.getAttribute('url') || '',
          icon: element.getAttribute('icon') || '',
          tags: (element.getAttribute('tags') || '').split(',').filter(Boolean),
          featured: element.getAttribute('data-featured') === 'true',
        };

        // 验证必需属性
        if (!cardProps.title || !cardProps.url) {
          throw new MDXProcessingError('Missing required attributes: title or url');
        }

        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card-container';
        resourceCard.setAttribute('data-permanent', 'true');

        const cardElement = document.createElement('a');
        cardElement.href = cardProps.url;
        cardElement.target = '_blank';
        cardElement.rel = 'noopener noreferrer';
        cardElement.className = 'block h-full';
        
        // 使用 requestAnimationFrame 优化渲染
        requestAnimationFrame(() => {
          cardElement.innerHTML = createResourceCardHTML(cardProps);
          resourceCard.appendChild(cardElement);
          element.parentNode?.replaceChild(resourceCard, element);
        });
      } catch (error) {
        console.error('Error processing resource card:', error);
        element.setAttribute('data-error', 'true');
      }
    });
  };

  /**
   * 处理资源网格
   */
  const processResourceGrids = (container: HTMLElement) => {
    const resourceGridElements = container.querySelectorAll<HTMLElement>(
      '[data-resource-grid]:not([data-processed="true"])'
    );

    resourceGridElements.forEach(element => {
      try {
        element.setAttribute('data-processed', 'true');
        const columns = (element.getAttribute('columns') || '3') as ResourceGridProps['columns'];
        
        requestAnimationFrame(() => {
          element.className = `grid gap-6 my-8 ${getGridColumns(columns)}`;
        });
      } catch (error) {
        console.error('Error processing resource grid:', error);
        element.setAttribute('data-error', 'true');
      }
    });
  };

  /**
   * 处理所有自定义组件
   */
  const processCustomComponents = debounce(() => {
    if (!contentRef.current || processingState.isProcessing) return;

    try {
      setProcessingState(prev => ({ ...prev, isProcessing: true }));

      const elements = contentRef.current.querySelectorAll<HTMLElement>(
        '[data-resource-card], [data-resource-grid]'
      );

      Array.from(elements).forEach(element => {
        if (element.hasAttribute('data-resource-card')) {
          const parent = element.parentElement;
          if (parent instanceof HTMLElement) {
            processResourceCards(parent);
          }
        } else if (element.hasAttribute('data-resource-grid')) {
          const parent = element.parentElement;
          if (parent instanceof HTMLElement) {
            processResourceGrids(parent);
          }
        }
      });

      retryCountRef.current = 0;
    } catch (error) {
      console.error('Error processing MDX content:', error);
      setProcessingState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error(String(error)),
        failedTasks: prev.failedTasks + 1
      }));

      if (retryCountRef.current < CONFIG.MAX_RETRIES) {
        retryCountRef.current += 1;
        setTimeout(processCustomComponents, CONFIG.PROCESSING_INTERVAL);
      }
    } finally {
      setProcessingState(prev => ({ ...prev, isProcessing: false }));
    }
  }, CONFIG.DEBOUNCE_DELAY);

  useEffect(() => {
    if (!contentRef.current) return;

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            if (!element.hasAttribute('data-processed')) {
              if (element.hasAttribute('data-resource-card')) {
                const parent = element.parentElement;
                if (parent instanceof HTMLElement) {
                  processResourceCards(parent);
                }
              } else if (element.hasAttribute('data-resource-grid')) {
                const parent = element.parentElement;
                if (parent instanceof HTMLElement) {
                  processResourceGrids(parent);
                }
              }
            }
          }
        });
      },
      {
        root: null,
        rootMargin: CONFIG.INTERSECTION_ROOT_MARGIN,
        threshold: CONFIG.INTERSECTION_THRESHOLD
      }
    );

    const elements = contentRef.current.querySelectorAll(
      '[data-resource-card], [data-resource-grid]'
    );

    elements.forEach(element => {
      intersectionObserverRef.current?.observe(element);
    });

    // 使用 requestAnimationFrame 进行初始处理
    const frameId = requestAnimationFrame(() => {
      processCustomComponents();

      // 设置 MutationObserver 监视 DOM 变化
      if (!observerRef.current && contentRef.current) {
        observerRef.current = new MutationObserver(processCustomComponents);
        observerRef.current.observe(contentRef.current, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      }

      // 设置定期检查
      if (!intervalRef.current) {
        intervalRef.current = setInterval(processCustomComponents, CONFIG.PROCESSING_INTERVAL);
      }
    });

    // 清理函数
    return () => {
      cancelAnimationFrame(frameId);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectionObserverRef.current = null;
      }
    };
  }, []);
  const getDataAttributes = () => ({
    'data-processing': processingState.isProcessing,
    'data-processed-count': processingState.processedCount,
    'data-total-count': processingState.totalCount, 
    'data-remaining-tasks': processingState.remainingTasks,
    'data-failed-tasks': processingState.failedTasks,
    'data-average-time': processingState.averageProcessingTime.toFixed(2),
    'data-has-error': !!processingState.error
  });

  return (
    <div
      ref={contentRef}
      dangerouslySetInnerHTML={{ __html: html }}
      className="mdx-content prose dark:prose-invert prose-neutral max-w-none"
      {...getDataAttributes()}
    />
  );
}