import { serialize } from 'next-mdx-remote/serialize';
import type { MDXContent } from '@/features/mdx/types';

/**
 * 处理 MDX 内容
 * @param content MDX 内容
 * @returns 处理后的 MDX 内容
 */
export async function processMdxContent(content: MDXContent) {
  if (!content.source) {
    throw new Error('MDX content source is required');
  }

  // 序列化 MDX 内容
  const compiled = await serialize(content.source, {
    parseFrontmatter: true,
  });

  return {
    ...content,
    compiled,
  };
}
