import { type NextRequest, NextResponse } from 'next/server';
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

  isAllowed(identifier: string, windowMs = 60000, maxRequests = 100): boolean {
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

  getRemainingRequests(identifier: string, maxRequests = 100): number {
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

  console.warn(
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
 * 处理 OPTIONS 预检请求
 */
function handleOptionsRequest(
  request: NextRequest,
  enableCors: boolean,
  corsOrigins: string[]
): NextResponse {
  const corsHeaders = enableCors ? handleCors(request, corsOrigins) : {};
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/**
 * 检查HTTP方法是否被允许
 */
function validateHttpMethod(
  request: NextRequest,
  allowedMethods: HttpMethod[]
): NextResponse | null {
  if (!allowedMethods.includes(request.method as HttpMethod)) {
    return ApiErrors.invalidMethod(allowedMethods);
  }
  return null;
}

/**
 * 处理速率限制
 */
function handleRateLimit(
  request: NextRequest,
  enableRateLimit: boolean,
  rateLimitWindow: number,
  rateLimitMax: number
): NextResponse | null {
  if (!enableRateLimit) {
    return null;
  }

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

  return null;
}

/**
 * 为响应添加CORS头
 */
function applyCorsHeaders(
  response: NextResponse,
  request: NextRequest,
  corsOrigins: string[]
): void {
  const corsHeaders = handleCors(request, corsOrigins);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

/**
 * 处理错误并返回标准化错误响应
 */
function handleRequestError(
  error: unknown,
  request: NextRequest,
  startTime: number,
  enableLogging: boolean
): NextResponse {
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

/**
 * 请求前置检查配置
 */
interface PreCheckConfig {
  request: NextRequest;
  allowedMethods: HttpMethod[];
  enableRateLimit: boolean;
  rateLimitWindow: number;
  rateLimitMax: number;
}

/**
 * 处理请求前置检查（方法、速率限制等）
 */
function handlePreChecks(config: PreCheckConfig): NextResponse | null {
  const { request, allowedMethods, enableRateLimit, rateLimitWindow, rateLimitMax } = config;

  // 检查允许的方法
  const methodError = validateHttpMethod(request, allowedMethods);
  if (methodError) {
    return methodError;
  }

  // 速率限制检查
  const rateLimitError = handleRateLimit(request, enableRateLimit, rateLimitWindow, rateLimitMax);
  if (rateLimitError) {
    return rateLimitError;
  }

  return null;
}

/**
 * 请求后置处理配置
 */
interface PostProcessConfig {
  response: NextResponse;
  request: NextRequest;
  startTime: number;
  enableCors: boolean;
  corsOrigins: string[];
  enableLogging: boolean;
}

/**
 * 处理请求后置操作（CORS、日志）
 */
function handlePostProcessing(config: PostProcessConfig): void {
  const { response, request, startTime, enableCors, corsOrigins, enableLogging } = config;

  // 添加 CORS 头
  if (enableCors) {
    applyCorsHeaders(response, request, corsOrigins);
  }

  // 记录请求完成
  if (enableLogging) {
    const duration = Date.now() - startTime;
    console.warn(`[API] ${request.method} ${request.url} - ${response.status} - ${duration}ms`);
  }
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
        return handleOptionsRequest(request, enableCors, corsOrigins);
      }

      // 请求前置检查
      const preCheckError = handlePreChecks({
        request,
        allowedMethods,
        enableRateLimit,
        rateLimitWindow,
        rateLimitMax,
      });
      if (preCheckError) {
        return preCheckError;
      }

      // 执行实际的处理器
      const response = await handler(request);

      // 请求后置处理
      handlePostProcessing({
        response,
        request,
        startTime,
        enableCors,
        corsOrigins,
        enableLogging,
      });

      return response;
    } catch (error) {
      return handleRequestError(error, request, startTime, enableLogging);
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
