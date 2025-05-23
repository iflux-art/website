'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Hash, Text } from 'lucide-react';
// 我们将在未来的优化中使用 useIntersectionObserver

/**
 * 标题项类型
 */
export interface Heading {
  /**
   * 标题ID
   */
  id: string;

  /**
   * 标题文本
   */
  text: string;

  /**
   * 标题级别（1-6）
   */
  level: number;
}

/**
 * 目录组件属性
 */
export interface TableOfContentsProps {
  /**
   * 标题项数组
   */
  headings: Heading[];

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义标题
   * @default "目录"
   */
  title?: string;
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
export function TableOfContents({ headings, className, title = '目录' }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const tocRef = useRef<HTMLDivElement>(null);

  // 如果没有标题，不渲染目录组件
  if (headings.length === 0) {
    return null;
  }

  // 自动滚动目录到当前活动标题
  useEffect(() => {
    if (activeId && tocRef.current) {
      const activeElement = tocRef.current.querySelector(`a[href="#${activeId}"]`);
      if (activeElement) {
        // 计算需要滚动的位置
        const containerRect = tocRef.current.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();

        // 检查活动元素是否在可视区域内
        const isInView =
          activeRect.top >= containerRect.top && activeRect.bottom <= containerRect.bottom;

        // 如果不在可视区域内，滚动到该元素
        if (!isInView) {
          const scrollTop =
            activeRect.top - containerRect.top - containerRect.height / 2 + activeRect.height / 2;
          tocRef.current.scrollTo({
            top: tocRef.current.scrollTop + scrollTop,
            behavior: 'smooth',
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
      headings.forEach(heading => {
        // 检查元素是否存在
        if (!document.getElementById(heading.id)) {
          // 查找匹配文本内容的标题元素
          const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headingElements.forEach(el => {
            if (el.textContent?.trim() === heading.text) {
              // 为没有ID的标题元素添加ID
              if (!el.id) {
                el.id = heading.id;
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

    // 创建一个映射，用于存储每个标题ID对应的观察器
    const observers: Record<string, IntersectionObserver> = {};

    // 观察所有标题元素
    const observeHeadings = () => {
      headings.forEach(heading => {
        const element = document.getElementById(heading.id);

        if (element) {
          // 为每个标题创建一个单独的观察器
          const observer = new IntersectionObserver(
            entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  setActiveId(entry.target.id);
                }
              });
            },
            { rootMargin: '-100px 0px -80% 0px', threshold: 0.1 }
          );

          observer.observe(element);
          observers[heading.id] = observer;
        } else {
          // 尝试通过文本内容查找
          const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headingElements.forEach(el => {
            if (el.textContent?.trim() === heading.text) {
              if (!el.id) {
                el.id = heading.id;
              }

              // 为找到的标题创建观察器
              const observer = new IntersectionObserver(
                entries => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      setActiveId(entry.target.id);
                    }
                  });
                },
                { rootMargin: '-100px 0px -80% 0px', threshold: 0.1 }
              );

              observer.observe(el);
              observers[heading.id] = observer;
            }
          });
        }
      });
    };

    // 延迟观察以确保DOM已完全加载
    setTimeout(observeHeadings, 1000);

    return () => {
      // 清理所有观察器
      Object.values(observers).forEach(observer => {
        observer.disconnect();
      });
    };
  }, [headings]);

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
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')}-${index}`;
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
      return headings.findIndex(h => h.id === a.id) - headings.findIndex(h => h.id === b.id);
    });
  };

  // 如果过滤后没有标题，返回null，不显示任何内容
  if (filteredHeadings.length === 0) {
    return null;
  }

  const organizedHeadings = organizeHeadings(filteredHeadings);

  return (
    <div className={cn('pl-0', className)}>
      <div ref={tocRef} className="pb-4 pr-2">
        <h3 className="text-sm font-medium mb-2 text-foreground flex items-center">
          <Text className="h-4 w-4 mr-1.5 text-primary/80" />
          <span>{title}</span>
        </h3>
        <div className="space-y-1">
          {organizedHeadings.map((heading, index) => {
            // 计算缩进，根据标题级别
            const indent = (heading.level - 2) * 0.75;

            // 根据标题级别设置不同的样式
            const headingSize =
              {
                2: 'font-medium',
                3: 'font-normal',
                4: 'text-xs',
              }[heading.level] || '';

            return (
              <a
                key={index}
                href={`#${heading.id}`}
                className={cn(
                  'flex items-center py-1.5 text-sm transition-colors group',
                  headingSize,
                  {
                    'text-primary font-medium bg-accent/50 rounded-md': activeId === heading.id,
                    'text-muted-foreground hover:text-primary/80 hover:bg-accent/20 rounded-md':
                      activeId !== heading.id,
                  }
                )}
                style={{
                  paddingLeft: heading.level > 2 ? `calc(${indent}rem + 0.5rem)` : '0.5rem',
                }}
                onClick={e => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    // 滚动到元素位置，并添加一些偏移以避免被导航栏遮挡
                    const offset = 80; // 根据您的导航栏高度调整
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth',
                    });

                    // 更新 URL 中的锚点，但不触发滚动
                    history.pushState(null, '', `#${heading.id}`);

                    // 设置活动 ID
                    setActiveId(heading.id);
                  }
                }}
              >
                <Hash
                  className={cn(
                    'h-3.5 w-3.5 mr-1.5 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary/70',
                    activeId === heading.id ? 'opacity-100 text-primary' : ''
                  )}
                />
                <span className="truncate">{heading.text}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * @deprecated 请使用 TableOfContents 替代 TableOfContentsClientWrapper，TableOfContentsClientWrapper 将在未来版本中移除
 */
export { TableOfContents as TableOfContentsClientWrapper };
