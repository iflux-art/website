'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * 面包屑导航项接口
 */
export interface BreadcrumbItem {
  /**
   * 显示的标签文本
   */
  label: string;
  
  /**
   * 链接地址，如果不提供则显示为纯文本
   */
  href?: string;
}

/**
 * 面包屑导航组件属性
 */
export interface BreadcrumbProps {
  /**
   * 面包屑项目数组
   */
  items: BreadcrumbItem[];
  
  /**
   * 分隔符，默认为 '/'
   */
  separator?: React.ReactNode;
  
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 面包屑导航组件
 * 
 * 用于显示当前页面在网站层级结构中的位置
 * 
 * @example
 * <Breadcrumb 
 *   items={[
 *     { label: '首页', href: '/' },
 *     { label: '文档', href: '/docs' },
 *     { label: '组件' }
 *   ]} 
 * />
 */
export function Breadcrumb({ items, separator = '/', className }: BreadcrumbProps) {
  return (
    <nav className={cn('text-sm text-muted-foreground mb-6 font-medium', className)}>
      <ol className="flex flex-wrap items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-muted-foreground/70">{separator}</span>}

              {isLast || !item.href ? (
                <span className="text-foreground">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
