import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ApiErrors } from '@/lib/api-utils';

/**
 * 允许的 HTTP 方法类型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

/**
 * API 中间件配置
 */
export interface ApiMiddlewareConfig {
  allowedMethods?: HttpMethod[];
  enableCors?: boolean;
  corsOrigins?: string[];
  enableLogging?: boolean;
  enableRateLimit?: boolean;
  rateLimitWindow?: number; // 时间窗口（毫秒）
  rateLimitMax?: number; // 最大请求数
}

/**
 * 请求日志接口
 */
interface RequestLog {
  method: string;
  url: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
  duration?: number;
}

/**
 * 速率限制存储
 */
class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();

  isAllowed(identifier: string, windowMs: number = 60000, maxRequests: number = 100): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // 重置或创建新记录
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingRequests(identifier: string, maxRequests: number = 100): number {
    const record = this.requests.get(identifier);
    if (!record) return maxRequests;
    return Math.max(0, maxRequests - record.count);
  }

  getResetTime(identifier: string): number {
    const record = this.requests.get(identifier);
    return record?.resetTime ?? Date.now();
  }

  clear(): void {
    this.requests.clear();
  }
}

const rateLimiter = new RateLimiter();

/**
 * 获取客户端标识符（用于速率限制）
 */
function getClientIdentifier(request: NextRequest): string {
  // 优先使用真实IP，fallback到forwarded IP，最后使用默认值
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  return realIp ?? forwardedFor?.split(',')[0]?.trim() ?? 'unknown';
}

/**
 * 记录请求日志
 */
function logRequest(request: NextRequest, duration?: number): void {
  const log: RequestLog = {
    method: request.method,
    url: request.url,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') ?? undefined,
    ip: getClientIdentifier(request),
    duration,
  };

  console.log(
    `[API] ${log.method} ${log.url} - ${log.ip} - ${duration ? `${duration}ms` : 'processing...'}`
  );
}

/**
 * 处理 CORS
 */
function handleCors(
  request: NextRequest,
  allowedOrigins: string[] = ['*']
): Record<string, string> {
  const origin = request.headers.get('origin');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24小时
  };

  // 设置允许的源
  if (allowedOrigins.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return headers;
}

/**
 * API 中间件主函数
 */
export function withApiMiddleware(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: ApiMiddlewareConfig = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();

    const {
      allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      enableCors = true,
      corsOrigins = ['*'],
      enableLogging = true,
      enableRateLimit = false,
      rateLimitWindow = 60000, // 1分钟
      rateLimitMax = 100,
    } = config;

    try {
      // 记录请求开始
      if (enableLogging) {
        logRequest(request);
      }

      // 处理 OPTIONS 预检请求
      if (request.method === 'OPTIONS') {
        const corsHeaders = enableCors ? handleCors(request, corsOrigins) : {};
        return new NextResponse(null, { status: 200, headers: corsHeaders });
      }

      // 检查允许的方法
      if (!allowedMethods.includes(request.method as HttpMethod)) {
        return ApiErrors.invalidMethod(allowedMethods);
      }

      // 速率限制检查
      if (enableRateLimit) {
        const clientId = getClientIdentifier(request);
        const isAllowed = rateLimiter.isAllowed(clientId, rateLimitWindow, rateLimitMax);

        if (!isAllowed) {
          const remaining = rateLimiter.getRemainingRequests(clientId, rateLimitMax);
          const resetTime = rateLimiter.getResetTime(clientId);

          const response = ApiErrors.rateLimit('Too many requests, please try again later');

          // 添加速率限制响应头
          response.headers.set('X-RateLimit-Limit', rateLimitMax.toString());
          response.headers.set('X-RateLimit-Remaining', remaining.toString());
          response.headers.set('X-RateLimit-Reset', resetTime.toString());

          return response;
        }
      }

      // 执行实际的处理器
      const response = await handler(request);

      // 添加 CORS 头
      if (enableCors) {
        const corsHeaders = handleCors(request, corsOrigins);
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }

      // 记录请求完成
      if (enableLogging) {
        const duration = Date.now() - startTime;
        console.log(`[API] ${request.method} ${request.url} - ${response.status} - ${duration}ms`);
      }

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      if (enableLogging) {
        console.error(`[API] ${request.method} ${request.url} - ERROR - ${duration}ms:`, error);
      }

      // 返回标准化错误响应
      if (error instanceof Error) {
        return ApiErrors.internal('Request processing failed', error.message);
      }

      return ApiErrors.internal('Unknown error occurred');
    }
  };
}

/**
 * 预设的中间件配置
 */
export const MiddlewareConfigs = {
  /**
   * 开放API配置（无限制）
   */
  public: {
    allowedMethods: ['GET'] as HttpMethod[],
    enableCors: true,
    corsOrigins: ['*'],
    enableLogging: true,
    enableRateLimit: false,
  } as ApiMiddlewareConfig,

  /**
   * 受保护API配置（有速率限制）
   */
  protected: {
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'] as HttpMethod[],
    enableCors: true,
    corsOrigins: ['*'],
    enableLogging: true,
    enableRateLimit: true,
    rateLimitWindow: 60000, // 1分钟
    rateLimitMax: 60, // 每分钟60次请求
  } as ApiMiddlewareConfig,

  /**
   * 管理API配置（严格限制）
   */
  admin: {
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'] as HttpMethod[],
    enableCors: true,
    corsOrigins: ['http://localhost:3000'], // 仅允许本地开发
    enableLogging: true,
    enableRateLimit: true,
    rateLimitWindow: 60000,
    rateLimitMax: 20, // 更严格的限制
  } as ApiMiddlewareConfig,
};

/**
 * 便捷的中间件装饰器
 */
export const withPublicApi = (handler: (request: NextRequest) => Promise<NextResponse>) =>
  withApiMiddleware(handler, MiddlewareConfigs.public);

export const withProtectedApi = (handler: (request: NextRequest) => Promise<NextResponse>) =>
  withApiMiddleware(handler, MiddlewareConfigs.protected);

export const withAdminApi = (handler: (request: NextRequest) => Promise<NextResponse>) =>
  withApiMiddleware(handler, MiddlewareConfigs.admin);
