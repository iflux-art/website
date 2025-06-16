import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface CacheEntry {
  serialized: MDXRemoteSerializeResult;
  timestamp: number;
}

const CACHE_LIFETIME = 1000 * 60 * 5; // 5 minutes

class MDXCache {
  private cache: Map<string, CacheEntry> = new Map();

  get(key: string): MDXRemoteSerializeResult | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > CACHE_LIFETIME) {
      this.cache.delete(key);
      return null;
    }

    return entry.serialized;
  }

  set(key: string, value: MDXRemoteSerializeResult): void {
    this.cache.set(key, {
      serialized: value,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const mdxCache = new MDXCache();

// Generate a cache key based on content and options
export function generateMdxCacheKey(content: string, options?: Record<string, unknown>): string {
  const optionsString = options ? JSON.stringify(options) : '';
  return `${content}:${optionsString}`;
}

// Convenience function to get cached MDX
export function getMdxCache(key: string): MDXRemoteSerializeResult | null {
  return mdxCache.get(key);
}

// Convenience function to set cached MDX
export function setMdxCache(key: string, value: MDXRemoteSerializeResult): void {
  mdxCache.set(key, value);
}

// MDX content and components cache helpers
export function getCachedMDX(content: string): string | null {
  const key = generateMdxCacheKey(content);
  const cached = getMdxCache(key);
  return cached ? JSON.stringify(cached) : null;
}

export function setCachedMDX(content: string, rendered: string): void {
  const key = generateMdxCacheKey(content);
  try {
    const value = JSON.parse(rendered) as MDXRemoteSerializeResult;
    setMdxCache(key, value);
  } catch (e) {
    console.error('Failed to parse rendered MDX content:', e);
  }
}
