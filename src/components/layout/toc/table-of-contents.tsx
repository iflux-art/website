'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Hash, Text } from 'lucide-react';
import { useHeadingObserver } from './use-heading-observer';

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

  /**
   * 是否启用自适应定位
   * @default false
   */
  adaptive?: boolean;

  /**
   * 自适应定位的偏移量（单位：px）
   * @default 80
   */
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
  adaptiveOffset = 80,
}: TableOfContentsProps) {
  const [isFixed, setIsFixed] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

  // 使用自定义 hook 处理标题观察
  const activeId = useHeadingObserver(headings);

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

// 删除原有的标题观察代码，因为已经使用 useHeadingObserver hook 替代

  // 过滤掉h1标题，只显示h2-h4
  const filteredHeadings = headings.filter(heading => heading.level >= 2 && heading.level <= 4);

  // 根据标题级别对目录进行分组和嵌套
  const organizeHeadings = (headings: Heading[]) => {
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

  // 如果过滤后没有标题，返回null，不显示任何内容
  if (filteredHeadings.length === 0) {
    return null;
  }

  const organizedHeadings = organizeHeadings(filteredHeadings);

  useEffect(() => {
    if (!adaptive) return;

    const handleScroll = () => {
      if (tocRef.current) {
        const { top } = tocRef.current.getBoundingClientRect();
        setIsFixed(top <= adaptiveOffset);
      }
    };

    const handleResize = () => {
      if (tocRef.current && isFixed) {
        tocRef.current.style.maxHeight = `${window.innerHeight - adaptiveOffset}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll(); // 初始检查
    handleResize(); // 初始设置

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [adaptive, adaptiveOffset, isFixed]);

  return (
    <div className={cn('pl-0', className)}>
      <div
        ref={tocRef}
        className={cn(
          'pb-4 pr-2',
          adaptive && 'transition-all duration-200',
          isFixed && adaptive && 'fixed top-[80px] overflow-y-auto'
        )}
      >
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

// 删除该行，因为活动ID现在由 hook 管理
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