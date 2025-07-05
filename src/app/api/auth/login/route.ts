import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 定义请求体schema
const LoginRequestSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  rememberMe: z.boolean().optional().default(false),
});

// 定义响应体schema
const LoginResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  expiresIn: z.number().optional(),
  error: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 验证请求体
    const requestBody = await request.json();
    const { username, password, rememberMe } = LoginRequestSchema.parse(requestBody);

    // 模拟认证逻辑 - 实际项目中替换为真实认证
    if (username === 'admin' && password === 'password') {
      const expiresIn = rememberMe ? 30 * 24 * 60 * 60 : 2 * 60 * 60; // 30天或2小时
      const token = 'demo-token-' + Math.random().toString(36).substring(2);

      return NextResponse.json(
        LoginResponseSchema.parse({
          success: true,
          token,
          expiresIn,
        })
      );
    }

    return NextResponse.json(
      LoginResponseSchema.parse({
        success: false,
        error: '用户名或密码错误',
      }),
      { status: 401 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        LoginResponseSchema.parse({
          success: false,
          error: '请求数据格式错误',
        }),
        { status: 400 }
      );
    }

    return NextResponse.json(
      LoginResponseSchema.parse({
        success: false,
        error: '服务器内部错误',
      }),
      { status: 500 }
    );
  }
}
