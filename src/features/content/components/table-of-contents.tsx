'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Text } from 'lucide-react';
import { useHeadingObserver } from '@/features/content/hooks/use-heading-observer';
// ====== 迁移自 src/config/layout.ts ======
/**
 * 页面顶部固定导航栏的高度
 */
const NAVBAR_HEIGHT = 80;
/**
 * 滚动偏移量，用于锚点定位时避免被导航栏遮挡
 */
const SCROLL_OFFSET = NAVBAR_HEIGHT;
// ====== END ======
// ====== 迁移自 src/utils/dom.ts ======
/**
 * 平滑滚动到指定元素
 * @param elementId 目标元素ID
 * @param offset 偏移量（默认为0）
 * @param updateHash 是否更新URL hash（默认为false）
 */
function scrollToElement(elementId: string, offset: number = 0, updateHash: boolean = false): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });

  // 仅在需要时更新 URL hash
  if (updateHash) {
    history.pushState(null, '', `#${elementId}`);
  }
}
// ====== END ======

// 内联 TocHeading、TocProps 类型定义
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export interface TocProps {
  headings: TocHeading[];
  className?: string;
  title?: string;
  adaptive?: boolean;
  adaptiveOffset?: number;
}

/**
 * 目录组件
 *
 * 显示文档的目录结构，支持点击导航和滚动高亮
 *
 * @example
 * <TableOfContents
 *   headings={[
 *     { id: 'intro', text: '介绍', level: 2 },
 *     { id: 'usage', text: '使用方法', level: 2 },
 *     { id: 'examples', text: '示例', level: 3 }
 *   ]}
 * />
 */
export function TableOfContents({
  headings,
  className,
  title = '目录',
  adaptive = false,
  adaptiveOffset = NAVBAR_HEIGHT,
}: TocProps) {
  const tocRef = useRef<HTMLDivElement>(null);

  // 使用自定义 hook 处理标题观察
  const activeId = useHeadingObserver(headings);

  // 自动滚动目录到当前活动标题
  useEffect(() => {
    // 如果没有标题，不执行滚动逻辑
    if (headings.length === 0) {
      return;
    }

    let timeoutId: number;

    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        if (activeId && tocRef.current) {
          const activeElement = tocRef.current.querySelector(`a[href="#${activeId}"]`);
          if (activeElement) {
            const containerRect = tocRef.current.getBoundingClientRect();
            const activeRect = activeElement.getBoundingClientRect();

            const isInView =
              activeRect.top >= containerRect.top && activeRect.bottom <= containerRect.bottom;

            if (!isInView) {
              const scrollTop =
                activeRect.top -
                containerRect.top -
                containerRect.height / 2 +
                activeRect.height / 2;
              tocRef.current.scrollTo({
                top: tocRef.current.scrollTop + scrollTop,
                behavior: 'smooth',
              });
            }
          }
        }
      }, 150);
    };

    handleScroll();
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [activeId, tocRef, headings.length]);

  // 删除原有的标题观察代码，因为已经使用 useHeadingObserver hook 替代

  // 过滤掉h1标题，只显示h2-h4
  const filteredHeadings = headings.filter(
    (heading: TocHeading) => heading.level >= 2 && heading.level <= 4
  );

  // 根据标题级别对目录进行分组和嵌套
  const organizeHeadings = (headings: TocHeading[]) => {
    // 确保标题ID唯一性
    return headings.map((heading, index) => {
      // 如果ID为空或者不存在，生成一个基于文本的ID
      if (!heading.id) {
        heading.id = `heading-${heading.text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')}-${index}`;
      }
      return heading;
    });
  };

  // 使用 useEffect 处理自适应行为
  useEffect(() => {
    // 如果过滤后没有标题或禁用自适应，不执行自适应逻辑
    if (filteredHeadings.length === 0 || !adaptive) {
      return;
    }

    // 本地变量，用于在 useEffect 内部处理

    let scrollTimeoutId: number;

    const handleScroll = () => {
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }

      scrollTimeoutId = window.setTimeout(() => {
        if (tocRef.current) {
          tocRef.current.style.maxHeight = `${window.innerHeight - adaptiveOffset}px`;
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [adaptive, adaptiveOffset, filteredHeadings.length]);

  // 如果过滤后没有标题，返回null，不显示任何内容
  if (filteredHeadings.length === 0) {
    return null;
  }

  const organizedHeadings = organizeHeadings(filteredHeadings);

  return (
    <div className={cn('table-of-contents w-full min-w-0 pl-0', className)}>
      <div
        ref={tocRef}
        className={cn(
          adaptive && 'transition-all duration-200',
          adaptive && 'fixed overflow-y-auto',
          'hide-scrollbar w-full'
        )}
        style={adaptive ? { top: `${adaptiveOffset}px` } : undefined}
      >
        <h3 className="mb-4 flex items-center px-1 text-sm font-medium text-foreground">
          <Text className="mr-1.5 h-4 w-4 text-primary/80" />
          <span>{title}</span>
        </h3>
        <div className="relative">
          {/* 左侧细线 */}
          <div className="absolute top-0 bottom-0 left-2 w-px bg-border" />

          <div className="space-y-1">
            {organizedHeadings.map((heading, index) => {
              // 计算缩进，根据标题级别
              const indent = (heading.level - 2) * 0.75;
              const isActive = activeId === heading.id;

              // 根据标题级别设置不同的样式
              const headingSize =
                {
                  2: 'font-medium',
                  3: 'font-normal',
                  4: 'text-xs',
                }[heading.level] ?? '';

              return (
                <div key={index} className="relative">
                  {/* 选中状态的粗线 */}
                  {isActive && (
                    <div className="absolute top-1.5 bottom-1.5 left-2 w-0.5 rounded-full bg-primary" />
                  )}

                  <a
                    href={`#${heading.id}`}
                    className={cn(
                      'group relative flex min-w-0 items-start py-1.5 text-sm transition-colors',
                      headingSize,
                      // 普通文本
                      'text-muted-foreground',
                      // hover 状态
                      'hover:text-foreground',
                      // active 状态
                      isActive && 'font-medium text-foreground',
                      'w-full'
                    )}
                    style={{
                      paddingLeft: heading.level > 2 ? `calc(${indent}rem + 1rem)` : '1rem',
                    }}
                    onClick={e => {
                      e.preventDefault();
                      scrollToElement(heading.id, SCROLL_OFFSET);
                    }}
                  >
                    <span className="overflow-wrap-anywhere block w-full text-left leading-relaxed break-words hyphens-auto whitespace-normal">
                      {heading.text}
                    </span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @deprecated 请使用 TableOfContents 替代 TableOfContentsClientWrapper，TableOfContentsClientWrapper 将在未来版本中移除
 */
export { TableOfContents as TableOfContentsClientWrapper };
