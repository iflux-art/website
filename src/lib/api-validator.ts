import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string;
  status: number;
};

interface ValidatorOptions {
  requireAuth?: boolean; // 是否需要API密钥验证
  allowedMethods?: string[]; // 允许的HTTP方法
  maxContentLength?: number; // 最大请求体大小
  csrfProtection?: boolean; // 是否启用CSRF保护
}

/**
 * API 请求验证器
 * @param schema Zod schema 用于验证请求数据
 * @param handler 处理请求的函数
 */
export function withValidation<T>(
  schema: z.ZodType<T>,
  handler: (data: T, req: NextRequest) => Promise<ApiResponse<T>>,
  options: ValidatorOptions = {}
) {
  return async (req: NextRequest) => {
    try {
      // 验证请求方法
      if (options.allowedMethods && !options.allowedMethods.includes(req.method)) {
        return NextResponse.json({ error: `Method ${req.method} not allowed` }, { status: 405 });
      }

      let body;
      if (req.method !== 'GET') {
        const contentLength = parseInt(req.headers.get('content-length') || '0');
        if (options.maxContentLength && contentLength > options.maxContentLength) {
          return NextResponse.json({ error: 'Request entity too large' }, { status: 413 });
        }
        body = await req.json();
      } else {
        const url = new URL(req.url);
        body = Object.fromEntries(url.searchParams);
      }

      // 验证请求数据
      const data = await schema.parseAsync(body);

      // 执行处理函数
      const result = await handler(data, req);

      return NextResponse.json(
        { data: result.data, error: result.error },
        { status: result.status }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}

// 常用的验证 schema
export const commonSchemas = {
  pagination: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default('1'),
    limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  }),

  id: z.object({
    id: z.string().min(1),
  }),

  search: z.object({
    query: z.string().min(1).max(100),
  }),
};
