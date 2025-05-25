import { processMdxContent } from '@/components/mdx/markdown-renderer';
import { getMdxCache, setMdxCache, generateMdxCacheKey } from '@/lib/mdx-cache';

interface MdxServerRendererProps {
  content: string;
}

/**
 * MDX 服务器渲染器组件
 *
 * 用于在服务器端渲染 MDX 内容
 */
export async function MdxServerRenderer({ content }: MdxServerRendererProps) {
  try {
    // 生成缓存键
    const cacheKey = generateMdxCacheKey(content);

    // 尝试从缓存中获取处理后的内容
    const cachedContent = getMdxCache(cacheKey);
    if (cachedContent) {
      return cachedContent;
    }

    // 如果缓存中没有，使用统一的处理函数处理内容
    const processedContent = processMdxContent(content);

    // 将处理后的内容存入缓存
    setMdxCache(cacheKey, processedContent);

    // 返回处理后的内容
    return processedContent;
  } catch (error) {
    console.error('MDX 渲染错误:', error);
    return `<div class="p-4 border border-red-500 bg-red-50 text-red-700 rounded">
      <h3 class="font-bold">MDX 渲染错误</h3>
      <p>${(error as Error).message}</p>
    </div>`;
  }
}
