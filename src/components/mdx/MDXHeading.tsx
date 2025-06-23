'use client';

import React from 'react';
import { Link } from 'lucide-react';
import { slugify } from '@/utils';

interface MDXHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * MDX 标题组件
 * - 自动生成锚点链接
 * - 响应式设计
 * - 支持自定义样式
 */
export const MDXHeading = ({
  as: Component = 'h2',
  children,
  className = '',
  ...props
}: MDXHeadingProps) => {
  // 生成标题ID
  const id = props.id || slugify(React.Children.toArray(children).join(''));

  // 标题层级样式映射
  const levelStyles = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-bold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
  };

  return (
    <Component
      id={id}
      className={`
        group relative
        scroll-mt-20 mb-4 mt-6
        text-gray-900 dark:text-gray-100
        ${levelStyles[Component]}
        ${className}
      `}
      {...props}
    >
      {children}
      <a
        href={`#${id}`}
        className="absolute -left-5 top-1/2 hidden -translate-y-1/2 text-gray-400 group-hover:block"
        aria-label="锚点链接"
      >
        <Link className="h-4 w-4" />
      </a>
    </Component>
  );
};
