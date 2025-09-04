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
