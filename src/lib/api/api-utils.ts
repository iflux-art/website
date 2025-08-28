import { NextResponse } from "next/server";

/**
 * API 错误类型
 */
export type ApiErrorType =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "RATE_LIMIT"
  | "INVALID_METHOD";

/**
 * API 错误响应接口
 */
export interface ApiErrorResponse {
  error: string;
  code: ApiErrorType;
  details?: string;
  timestamp: string;
}

/**
 * API 成功响应接口
 */
export interface ApiSuccessResponse<T = unknown> {
  data: T;
  timestamp: string;
  total?: number;
}

/**
 * 缓存配置接口
 */
export interface CacheConfig {
  maxAge?: number;
  staleWhileRevalidate?: number;
  mustRevalidate?: boolean;
}

/**
 * 标准化 API 错误响应
 */
export function createApiError(
  type: ApiErrorType,
  message: string,
  details?: string,
  status = 500
): NextResponse<ApiErrorResponse> {
  const errorResponse: ApiErrorResponse = {
    error: message,
    code: type,
    details,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(errorResponse, { status });
}

/**
 * 标准化 API 成功响应
 */
export function createApiSuccess<T>(
  data: T,
  total?: number,
  cacheConfig?: CacheConfig
): NextResponse<ApiSuccessResponse<T>> {
  const successResponse: ApiSuccessResponse<T> = {
    data,
    timestamp: new Date().toISOString(),
    ...(total !== undefined && { total }),
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 设置缓存头
  if (cacheConfig) {
    const cacheDirectives = [];

    if (cacheConfig.maxAge !== undefined) {
      cacheDirectives.push(`max-age=${cacheConfig.maxAge}`);
    }

    if (cacheConfig.staleWhileRevalidate !== undefined) {
      cacheDirectives.push(`stale-while-revalidate=${cacheConfig.staleWhileRevalidate}`);
    }

    if (cacheConfig.mustRevalidate) {
      cacheDirectives.push("must-revalidate");
    }

    if (cacheDirectives.length > 0) {
      headers["Cache-Control"] = cacheDirectives.join(", ");
    }
  } else {
    // 默认不缓存
    headers["Cache-Control"] = "no-store, max-age=0";
  }

  return NextResponse.json(successResponse, { headers });
}

/**
 * 常用的错误创建函数
 */
export const ApiErrors = {
  validation: (message: string, details?: string) =>
    createApiError("VALIDATION_ERROR", message, details, 400),

  notFound: (resource = "Resource") =>
    createApiError("NOT_FOUND", `${resource} not found`, undefined, 404),

  unauthorized: (message = "Unauthorized access") =>
    createApiError("UNAUTHORIZED", message, undefined, 401),

  forbidden: (message = "Access forbidden") => createApiError("FORBIDDEN", message, undefined, 403),

  conflict: (message: string, details?: string) =>
    createApiError("CONFLICT", message, details, 409),

  internal: (message = "Internal server error", details?: string) =>
    createApiError("INTERNAL_ERROR", message, details, 500),

  rateLimit: (message = "Too many requests") =>
    createApiError("RATE_LIMIT", message, undefined, 429),

  invalidMethod: (allowedMethods: string[]) =>
    createApiError(
      "INVALID_METHOD",
      `Method not allowed. Allowed methods: ${allowedMethods.join(", ")}`,
      undefined,
      405
    ),
};

/**
 * URL 验证函数
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * 基本字段验证
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): string[] {
  const missingFields: string[] = [];

  for (const field of requiredFields) {
    // 修复：添加更严格的类型检查
    if (!data[field] || (typeof data[field] === "string" && !data[field]?.toString().trim())) {
      missingFields.push(field);
    }
  }

  return missingFields;
}

/**
 * 异步错误处理包装器
 */
export function withErrorHandling<T extends unknown[], R>(handler: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R | NextResponse<ApiErrorResponse>> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof Error) {
        return ApiErrors.internal("Request failed", error.message);
      }

      return ApiErrors.internal("Unknown error occurred");
    }
  };
}

/**
 * 内存缓存类
 */
class MemoryCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  set(key: string, data: unknown, ttl = 300000): void {
    // 默认5分钟
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T = unknown>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

export const apiCache = new MemoryCache();
