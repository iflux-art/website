import { MDX_CONFIG, STYLE_CONFIG } from './config';
import type { ResourceCardProps, ResourceGridProps } from '../types';

// 防抖函数
export function debounce<Args extends unknown[], R>(
  fn: (...args: Args) => R | Promise<R>,
  delay: number
): (...args: Args) => Promise<R> {
  let timeoutId: NodeJS.Timeout;

  return (...args: Args): Promise<R> =>
    new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        resolve(await fn(...args));
      }, delay);
    });
}

// URL验证
export const isValidUrl = (href: string): boolean => {
  try {
    new URL(href);
    return true;
  } catch {
    return false;
  }
};

// HTML转义
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// 获取网格列数类名
export const getGridColumns = (columns: ResourceGridProps['columns']): string => {
  const col = String(columns || 3) as keyof typeof STYLE_CONFIG.GRID_COLUMNS;
  return STYLE_CONFIG.GRID_COLUMNS[col];
};

// 创建资源卡片HTML
export const createResourceCardHTML = ({
  title,
  description,
  href,
  icon,
  tags,
  featured,
}: ResourceCardProps): string => {
  if (href && !isValidUrl(href)) {
    throw new Error(`Invalid href: ${href}`);
  }

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  const tagsList = tags?.length
    ? `<div class="flex flex-wrap gap-2 mt-3">
        ${tags
          .map(
            (tag) =>
              `<span class="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                ${escapeHtml(tag.trim())}
              </span>`
          )
          .join('')}
      </div>`
    : '';

  const featuredBadge = featured
    ? `<div class="absolute top-2 right-2">
        <span class="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
          精选
        </span>
      </div>`
    : '';

  return `
    <div class="${STYLE_CONFIG.BASE_CLASSES.card} ${featured ? STYLE_CONFIG.BASE_CLASSES.cardFeatured : ''}">
      <div class="p-4 flex flex-col h-full">
        ${
          icon
            ? `<div class="flex items-start mb-3">
          <div class="text-3xl">
            <span class="text-primary">${icon}</span>
          </div>
        </div>`
            : ''
        }
        <h3 class="text-xl font-semibold mb-2">${safeTitle}</h3>
        <p class="text-muted-foreground text-sm flex-grow">${safeDescription}</p>
        ${tagsList}
        ${featuredBadge}
      </div>
    </div>
  `;
};

// MDX缓存管理
class MDXCache {
  private cache = new Map<string, { content: string; timestamp: number }>();

  set(key: string, content: string): void {
    if (this.cache.size >= MDX_CONFIG.CACHE_MAX_ITEMS) {
      // 删除最旧的缓存项
      const oldestKey = Array.from(this.cache.entries()).sort(
        ([, a], [, b]) => a.timestamp - b.timestamp
      )[0][0];
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, { content, timestamp: Date.now() });
  }

  get(key: string): string | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > MDX_CONFIG.CACHE_MAX_AGE) {
      this.cache.delete(key);
      return null;
    }

    return item.content;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const mdxCache = new MDXCache();

// 生成缓存键
export const generateCacheKey = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `mdx_${hash}`;
};

// 错误处理工具
export class MDXError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MDXError';
  }
}
