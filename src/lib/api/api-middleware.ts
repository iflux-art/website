/**
 * API 中间件工具函数
 * 提供通用的 API 中间件功能，包括日志记录、错误处理、请求验证等
 */

import type { NextRequest, NextResponse } from "next/server";
import { type ApiErrorResponse, ApiErrors, createApiError } from "./api-utils";

/**
 * 日志记录中间件选项
 */
export interface LoggingOptions {
  /** 是否记录请求体 */
  logBody?: boolean;
  /** 是否记录请求头 */
  logHeaders?: boolean;
  /** 是否记录响应 */
  logResponse?: boolean;
  /** 自定义日志前缀 */
  prefix?: string;
}

/**
 * 请求验证中间件选项
 */
export interface ValidationOptions {
  /** 允许的HTTP方法 */
  allowedMethods?: string[];
  /** 必需的请求头 */
  requiredHeaders?: string[];
  /** 是否需要认证 */
  requireAuth?: boolean;
  /** 认证头名称 */
  authHeader?: string;
}

/**
 * 中间件执行结果
 */
export interface MiddlewareResult<T = unknown> {
  /** 是否继续执行 */
  continue: boolean;
  /** 处理后的数据 */
  data?: T;
  /** 错误响应（如果有的话） */
  error?: ReturnType<typeof createApiError>;
}

/**
 * 记录请求信息
 */
function logRequestInfo(
  request: NextRequest,
  prefix: string,
  logHeaders: boolean,
  logBody: boolean
) {
  // 记录请求信息
  if (process.env.NODE_ENV === "development") {
    console.warn(`[${prefix}] ${request.method} ${request.url}`);

    if (logHeaders) {
      console.warn(`[${prefix}] Headers:`, Object.fromEntries(request.headers));
    }

    if (logBody && request.method !== "GET" && request.method !== "HEAD") {
      try {
        const body = request.clone().text();
        console.warn(`[${prefix}] Body:`, body);
      } catch (error) {
        console.warn(`[${prefix}] Could not read request body:`, error);
      }
    }
  }
}

/**
 * 记录响应信息
 */
function logResponseInfo(prefix: string, result: unknown, duration: number, logResponse: boolean) {
  if (process.env.NODE_ENV === "development") {
    if (logResponse) {
      console.warn(`[${prefix}] Response:`, result);
    }

    console.warn(`[${prefix}] Completed in ${duration}ms`);
  }
}

/**
 * 日志记录中间件
 */
export async function withLogging<T>(
  request: NextRequest,
  handler: () => Promise<T>,
  options: LoggingOptions = {}
): Promise<T> {
  const { logBody = false, logHeaders = false, logResponse = false, prefix = "API" } = options;

  const startTime = Date.now();

  // 记录请求信息
  logRequestInfo(request, prefix, logHeaders, logBody);

  try {
    const result = await handler();

    const duration = Date.now() - startTime;

    // 记录响应信息
    logResponseInfo(prefix, result, duration, logResponse);

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    if (process.env.NODE_ENV === "development") {
      console.error(`[${prefix}] Error after ${duration}ms:`, error);
    }
    throw error;
  }
}

/**
 * 请求验证中间件
 */
export function withValidation(
  request: NextRequest,
  options: ValidationOptions = {}
): MiddlewareResult {
  const {
    allowedMethods = [],
    requiredHeaders = [],
    requireAuth = false,
    authHeader = "authorization",
  } = options;

  // 验证HTTP方法
  if (allowedMethods.length > 0 && !allowedMethods.includes(request.method)) {
    return {
      continue: false,
      error: ApiErrors.invalidMethod(allowedMethods),
    };
  }

  // 验证必需的请求头
  for (const header of requiredHeaders) {
    if (!request.headers.has(header)) {
      return {
        continue: false,
        error: ApiErrors.validation(`Missing required header: ${header}`),
      };
    }
  }

  // 验证认证
  if (requireAuth && !request.headers.has(authHeader)) {
    return {
      continue: false,
      error: ApiErrors.unauthorized("Authentication required"),
    };
  }

  return {
    continue: true,
  };
}

/**
 * CORS中间件
 */
export function withCORS(request: NextRequest): void {
  // 检查是否需要处理CORS
  const origin = request.headers.get("origin");
  if (!origin) return;

  // 在实际应用中，这里应该检查origin是否在允许的列表中
  // 为简化示例，我们允许所有origin
  if (process.env.NODE_ENV === "development") {
    console.warn(`CORS request from origin: ${origin}`);
  }
}

/**
 * 速率限制中间件选项
 */
interface RateLimitOptions {
  /** 每个时间窗口的最大请求数 */
  maxRequests?: number;
  /** 时间窗口（毫秒） */
  windowMs?: number;
  /** 用于标识客户端的键生成函数 */
  keyGenerator?: (request: NextRequest) => string;
}

/**
 * 简单的内存速率限制器
 */
class MemoryRateLimiter {
  private requests = new Map<string, number[]>();

  check(
    key: string,
    maxRequests: number,
    windowMs: number
  ): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const windowStart = now - windowMs;

    // 清理过期的请求记录
    let requests = this.requests.get(key) || [];
    requests = requests.filter(timestamp => timestamp > windowStart);

    if (requests.length >= maxRequests) {
      const oldestRequest = requests[0];
      const resetTime = oldestRequest ? oldestRequest + windowMs : undefined;
      return { allowed: false, resetTime };
    }

    // 记录当前请求
    requests.push(now);
    this.requests.set(key, requests);

    return { allowed: true };
  }
}

const rateLimiter = new MemoryRateLimiter();

/**
 * 速率限制中间件
 */
export function withRateLimit(
  request: NextRequest,
  options: RateLimitOptions = {}
): MiddlewareResult {
  const { maxRequests = 100, windowMs = 15 * 60 * 1000, keyGenerator } = options; // 默认15分钟100次请求

  const key = keyGenerator
    ? keyGenerator(request)
    : request.headers.get("x-forwarded-for") || "default";

  const { allowed, resetTime } = rateLimiter.check(key, maxRequests, windowMs);

  if (!allowed && resetTime) {
    return {
      continue: false,
      error: createApiError(
        "RATE_LIMIT",
        "Too many requests",
        `Rate limit exceeded. Try again after ${new Date(resetTime).toISOString()}`
      ),
    };
  } else if (!allowed) {
    return {
      continue: false,
      error: createApiError(
        "RATE_LIMIT",
        "Too many requests",
        "Rate limit exceeded. Try again later."
      ),
    };
  }

  return {
    continue: true,
  };
}

/**
 * 组合中间件执行器
 */
export async function runMiddleware<T>(
  request: NextRequest,
  handler: () => Promise<T>,
  middlewares: ((req: NextRequest) => MiddlewareResult)[] = []
): Promise<T | ReturnType<typeof createApiError>> {
  // 执行所有中间件
  for (const middleware of middlewares) {
    const result = middleware(request);
    if (!result.continue && result.error) {
      return result.error;
    }
  }

  try {
    return await handler();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Middleware handler error:", error);
    }
    if (error instanceof Error) {
      return ApiErrors.internal("Request processing failed", error.message);
    }
    return ApiErrors.internal("Unknown error occurred");
  }
}

/**
 * 公共API中间件
 * 用于包装不需要认证的公共API路由
 */
export function withPublicApi<T>(
  handler: (request: NextRequest) => Promise<T>
): (request: NextRequest) => Promise<T | NextResponse<ApiErrorResponse>> {
  return async (request: NextRequest) => {
    // 应用CORS中间件
    withCORS(request);

    // 应用速率限制中间件
    const rateLimitResult = withRateLimit(request);
    if (!rateLimitResult.continue && rateLimitResult.error) {
      return rateLimitResult.error;
    }

    // 执行处理函数
    const response = await handler(request);

    // 如果响应是NextResponse实例，添加CORS头
    if (response instanceof Response) {
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    return response;
  };
}
