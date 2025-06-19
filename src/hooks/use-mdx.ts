import { useState, useMemo, useCallback, useEffect } from 'react';
import type { MDXOptions } from '@/features/mdx/types';
import { debounce } from '@/utils/helpers';
import { MDX_CONFIG } from '@/utils/config';
import { getCachedMDX, setCachedMDX } from '@/lib/mdx-cache';

type MDXComponents = NonNullable<MDXOptions['components']>;
type DebouncedFunction<T> = T & { cancel: () => void };

interface RenderResult {
  content: string;
  components: MDXComponents;
}

interface UseMDXOptions {
  initialContent?: string;
  enableCache?: boolean;
  debounceDelay?: number;
  components?: MDXComponents;
}

/**
 * 统一的 MDX 处理 Hook
 * 集成了内容管理和渲染功能
 */
export function useMDX({
  initialContent = '',
  enableCache = true,
  debounceDelay = MDX_CONFIG.DEBOUNCE_DELAY,
  components = Object.create(null) as MDXComponents,
}: UseMDXOptions = {}) {
  // 内容状态管理
  const [content, setContent] = useState(initialContent);

  // 缓存自定义组件
  const customComponents = useMemo(() => components, [components]);

  // 创建防抖函数
  const debouncedFn = useMemo(
    () =>
      debounce((value: string) => {
        setContent(value);
        return Promise.resolve();
      }, debounceDelay) as DebouncedFunction<(value: string) => Promise<void>>,
    [debounceDelay, setContent]
  );

  // 清理防抖函数
  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  // 更新内容的防抖函数
  const debouncedSetContent = useCallback(
    (value: string) => {
      return debouncedFn(value);
    },
    [debouncedFn]
  );

  // 渲染函数
  const renderMDX = useCallback(
    (mdxContent: string): RenderResult | null => {
      if (!mdxContent) return null;

      try {
        // 如果启用缓存，先检查缓存
        if (enableCache) {
          const cached = getCachedMDX(mdxContent);
          if (cached) {
            return { content: cached, components: customComponents };
          }
        }

        // 渲染内容
        const renderedContent = mdxContent; // 保持原有的渲染逻辑

        // 如果启用缓存，保存到缓存
        if (enableCache) {
          setCachedMDX(mdxContent, renderedContent);
        }

        return {
          content: renderedContent,
          components: customComponents,
        };
      } catch (error) {
        console.error('Error rendering MDX:', error);
        return null;
      }
    },
    [enableCache, customComponents]
  );

  return {
    content,
    setContent: debouncedSetContent,
    renderMDX,
    components: customComponents,
  };
}

export default useMDX;
