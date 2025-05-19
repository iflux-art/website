"use client";

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { DocItem } from '@/types/docs';
import { useRecentDocs } from '@/hooks/use-docs';

/**
 * 最近文档列表组件属性
 *
 * @interface RecentDocsListProps
 */
interface RecentDocsListProps {
  /**
   * 文档列表（可选，如果不提供则通过 API 获取）
   */
  docs?: DocItem[];

  /**
   * 最大显示文档数量
   * @default 5
   */
  limit?: number;
}

/**
 * 最近文档列表组件
 *
 * 用于显示最近更新的文档列表
 *
 * @param {RecentDocsListProps} props - 组件属性
 * @returns {JSX.Element} 最近文档列表组件
 *
 * @example
 * ```tsx
 * <RecentDocsList limit={3} />
 * ```
 */
export function RecentDocsList({ docs: propDocs, limit = 5 }: RecentDocsListProps) {
  // 如果没有提供文档列表，则通过 API 获取
  const { docs: fetchedDocs, loading, error } = useRecentDocs(limit);

  // 使用提供的文档列表或通过 API 获取的文档列表
  const docs = propDocs || fetchedDocs;

  // 加载状态
  if (!propDocs && loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="p-4 border border-border rounded-lg">
            <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="flex justify-between items-center mt-2">
              <div className="h-3 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-1/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 错误状态
  if (!propDocs && error) {
    return (
      <div className="text-destructive p-4 border border-destructive/50 rounded-md">
        加载最近文档失败
      </div>
    );
  }

  // 空状态
  if (docs.length === 0) {
    return (
      <div className="text-center py-10">
        <p>暂无文档</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {docs.map((doc, index) => {
        const itemRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
          const item = itemRef.current;
          if (item) {
            // 添加淡入动画
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            const timeout = setTimeout(() => {
              item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, index * 100); // 延迟时间与索引相关

            return () => clearTimeout(timeout);
          }
        }, []);

        return (
          <div
            key={`${doc.category}-${doc.slug}`}
            ref={itemRef}
            style={{ opacity: 0 }}
          >
            <Link
              href={`/docs/${doc.category}/${doc.slug}`}
              className="block p-4 border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <h3 className="text-lg font-medium hover:text-primary transition-colors">{doc.title}</h3>
              <p className="text-muted-foreground mt-1">{doc.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">{doc.category}</span>
                {doc.date && <span className="text-xs text-muted-foreground">{doc.date}</span>}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}