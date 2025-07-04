import { compileMDX } from 'next-mdx-remote/rsc';
import { cn } from '@/utils';
import { MDXComponents } from './mdx-components';
import { MDXCodeBlock } from './mdx-code-block';
import { MDXCodeInline } from './mdx-codeInline';
import { MDXTableComponents } from './mdx-table';
import type { ComponentProps } from 'react';

interface MDXRemoteRendererProps {
  source: string;
}

export async function MDXRemoteRenderer({ source }: MDXRemoteRendererProps) {
  const { content } = await compileMDX({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
    components: {
      ...MDXComponents,
      ...MDXTableComponents,
      pre: (props: ComponentProps<typeof MDXCodeBlock>) => (
        <MDXCodeBlock {...props} className={props.className || ''} filename={props.filename} />
      ),
      code: (props: ComponentProps<typeof MDXCodeInline>) => (
        <MDXCodeInline
          {...props}
          className={cn(props.className || '', 'bg-muted px-1.5 py-0.5 rounded')}
        />
      ),
    },
  });

  return content;
}
