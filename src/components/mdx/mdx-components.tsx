'use client';

import React from 'react';
import { ImageProps } from 'next/image';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import type {
  ResponsiveImageSizes,
  ResponsiveImageFormats,
} from '@/components/ui/responsive-image';

type MDXProps = {
  children?: React.ReactNode;  
  className?: string;
  [key: string]: unknown;
};
/**
 * MDX 组件配置
 */
export function useMDXComponents(components: Record<string, React.ComponentType | JSX.Element | ((props: MDXProps) => JSX.Element)> = {}) {
  const mdxComponents = {
    img: ({
      src,
      alt,
      width,
      _height,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const imageConfig = {
        lazy: true,
        sizes: {
          width: Number(width) || 1080,
          breakpoints: {
            mobile: 640,
            tablet: 1080,
          },
        },
        formats: {
          webp: true,
          original: true,
        },
        style: { width: '100%', height: 'auto' } as const,
      } satisfies Partial<ImageProps> & {
        sizes: ResponsiveImageSizes;
        formats: ResponsiveImageFormats;
      };

      if (!src) {
        return null;
      }

      if (src.startsWith('http') || src.startsWith('data:')) {
        return <img src={src} alt={alt || ''} {...props} />;
      } else {
        return <ResponsiveImage {...props} {...imageConfig} src={src} alt={alt || ''} />;
      }
    },

    table: ({ children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto">
        <table {...props} className="my-6 w-full">
          {children}
        </table>
      </div>
    ),

    thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead {...props} className="bg-muted/50">
        {children}
      </thead>
    ),

    th: ({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th {...props} className="border px-4 py-2 text-left font-semibold">
        {children}
      </th>
    ),

    td: ({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td {...props} className="border px-4 py-2">
        {children}
      </td>
    ),
  };

  return {
    ...components,
    ...mdxComponents,
  };
}