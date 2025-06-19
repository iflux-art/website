import Image from 'next/image';
import { MDXStyleConfig } from './mdx-config';

interface MDXImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

export const MDXComponents = {
  // 覆盖默认的图片组件
  img: ({ src, alt, width, height, ...props }: MDXImageProps) => {
    if (!src) return null;

    return (
      <Image
        src={src}
        alt={alt || ''}
        width={width ? Number(width) : 800}
        height={height ? Number(height) : 600}
        className={`${MDXStyleConfig.image.img} my-4 mx-auto`}
        {...props}
      />
    );
  },

  // 自定义代码块
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return (
      <pre className={MDXStyleConfig.codeBlock.pre} {...props}>
        {children}
      </pre>
    );
  },

  // 内联代码
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = typeof children === 'string';
    if (isInline) {
      return (
        <code className={MDXStyleConfig.inlineCode} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={MDXStyleConfig.codeBlock.code} {...props}>
        {children}
      </code>
    );
  },

  // 链接
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (!href) return null;

    const isExternal = href.startsWith('http');
    const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
      <a href={href} className={MDXStyleConfig.link} {...linkProps} {...props}>
        {children}
      </a>
    );
  },
};
