import { useMemo, useCallback } from 'react';
import type { MDXComponents } from '@/components/mdx/types';
import { debounce } from '@/utils/helpers';
import { MDX_CONFIG } from '@/utils/config';
import { getCachedMDX, setCachedMDX } from '@/lib/mdx-cache';

interface RenderResult {
  content: string;
  components: MDXComponents;
}

interface UseMDXRendererOptions {
  enableCache?: boolean;
  debounceDelay?: number;
  components?: MDXComponents;
}

export function useMDXRenderer(options: UseMDXRendererOptions = {}) {
  const {
    enableCache = true,
    debounceDelay = MDX_CONFIG.DEBOUNCE_DELAY,
    components = Object.create(null) as MDXComponents,
  } = options;

  // 缓存自定义组件
  const customComponents = useMemo(() => components, [components]);

  // 渲染函数
  const renderMDX = useCallback(
    async (content: string): Promise<RenderResult | null> => {
      if (!content) return null;

      try {
        // 如果启用缓存，先检查缓存
        if (enableCache) {
          const cached = getCachedMDX(content);
          if (cached) {
            return { content: cached, components: customComponents };
          }
        }

        // 渲染内容
        const renderedContent = content; // 这里保持原有的渲染逻辑

        // 如果启用缓存，保存到缓存
        if (enableCache) {
          setCachedMDX(content, renderedContent);
        }

        return { content: renderedContent, components: customComponents };
      } catch (error) {
        console.error('Error rendering MDX:', error);
        throw error;
      }
    },
    [customComponents, enableCache]
  );

  // 防抖渲染函数
  const debouncedRender = useMemo(
    () => debounce<[string], RenderResult | null>(renderMDX, debounceDelay),
    [renderMDX, debounceDelay]
  );

  return {
    render: debouncedRender,
    components: customComponents,
  };
}

export default useMDXRenderer;
