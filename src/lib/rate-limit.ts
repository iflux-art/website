import { LRUCache } from 'lru-cache';
import { NextResponse } from 'next/server';

interface RateLimitOptions {
  maxRequests?: number; // 最大请求数
  windowMs?: number; // 时间窗口（毫秒）
  trustProxy?: boolean; // 是否信任代理 IP
}

export class RateLimiter {
  private cache: LRUCache<string, number>;
  private maxRequests: number;
  private windowMs: number;
  private trustProxy: boolean;

  constructor(options: RateLimitOptions = {}) {
    this.maxRequests = options.maxRequests || 100;
    this.windowMs = options.windowMs || 60 * 1000; // 默认1分钟
    this.trustProxy = options.trustProxy || false;

    this.cache = new LRUCache({
      max: 10000, // 最多缓存10000个IP
      ttl: this.windowMs, // 自动过期时间
    });
  }

  getIP(request: Request): string {
    if (this.trustProxy) {
      const forwardedFor = request.headers.get('x-forwarded-for');
      if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
      }
    }
    return '127.0.0.1'; // 本地开发时的默认值
  }

  async check(request: Request): Promise<boolean> {
    const ip = this.getIP(request);
    const current = this.cache.get(ip) || 0;

    if (current >= this.maxRequests) {
      return false;
    }

    this.cache.set(ip, current + 1);
    return true;
  }

  public get limit(): number {
    return this.maxRequests;
  }
}

// 默认的速率限制器实例
const defaultLimiter = new RateLimiter();

/**
 * API速率限制中间件
 */
export async function rateLimit(
  request: Request,
  options?: RateLimitOptions
): Promise<Response | null> {
  const limiter = options ? new RateLimiter(options) : defaultLimiter;

  if (!(await limiter.check(request))) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': String(limiter.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return null;
}
