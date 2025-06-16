'use client';

import React from 'react';

type MDXProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
};

type MDXImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * MDX 组件配置
 */
export function useMDXComponents(components: Record<string, React.ComponentType | React.ReactElement | ((props: MDXProps) => React.ReactElement)> = {}) {
  const mdxComponents = {
    img: ({
      src,
      alt,
      ...props
    }: MDXImageProps) => {
      if (!src) {
        return null;
      }

      return <img src={src} alt={alt || ''} {...props} />;
    },

    table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto">
        <table {...props} className="my-6 w-full">
          {children}
        </table>
      </div>
    ),

    thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead {...props} className="border-b" />
    ),

    th: (props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
      <th {...props} className="border-b py-4 px-4 text-left font-bold" />
    ),

    td: (props: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
      <td {...props} className="border-b py-4 px-4" />
    ),

    ...components,
  };

  return mdxComponents;
}