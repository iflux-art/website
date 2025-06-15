'use client';

import React from 'react';
import { ResponsiveImage } from '@/components/mdx/responsive-image';
import type { ResponsiveImageProps } from '@/components/mdx/responsive-image';

type MDXProps = {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
};

interface MDXImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'height'> {
  _height?: number;
}
/**
 * MDX 组件配置
 */
export function useMDXComponents(components: Record<string, React.ComponentType | React.ReactElement | ((props: MDXProps) => React.ReactElement)> = {}) {
  const mdxComponents = {
    img: ({
      src,
      alt,
      width,
      _height,
      ...props
    }: MDXImageProps) => {
      const imageConfig: Partial<ResponsiveImageProps> = {
        formats: {
          webp: true,
          original: true,
        },
        loading: 'lazy' as const,
        height: _height,
        width: width ? Number(width) : undefined
      };

      if (!src) {
        return null;
      }

      const imgSrc = src as string;
      if (imgSrc.startsWith('http') || imgSrc.startsWith('data:')) {
        return <img src={imgSrc} alt={alt || ''} {...props} />;
      } else {
        return <ResponsiveImage {...imageConfig} {...props} src={imgSrc} alt={alt || ''} />;
      }
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
  };

  return {
    ...mdxComponents,
    ...components,
  };
}