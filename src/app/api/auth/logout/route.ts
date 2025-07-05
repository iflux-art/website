import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 定义响应体schema
const LogoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export async function POST(_request: NextRequest) {
  try {
    // 模拟登出逻辑 - 实际项目中清除token等
    return NextResponse.json(
      LogoutResponseSchema.parse({
        success: true,
        message: '登出成功',
      })
    );
  } catch {
    return NextResponse.json(
      LogoutResponseSchema.parse({
        success: false,
        error: '服务器内部错误',
      }),
      { status: 500 }
    );
  }
}
