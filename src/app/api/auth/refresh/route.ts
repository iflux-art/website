import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// 定义请求体schema
const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(10),
});

// 定义响应体schema
const RefreshResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  expiresIn: z.number().optional(),
  error: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 验证请求体
    const requestBody = await request.json();
    const { refreshToken } = RefreshRequestSchema.parse(requestBody);

    // 模拟刷新逻辑 - 实际项目中验证refreshToken并生成新token
    if (refreshToken.startsWith("demo-refresh-token-")) {
      const expiresIn = 2 * 60 * 60; // 2小时
      const token = "demo-token-" + Math.random().toString(36).substring(2);

      return NextResponse.json(
        RefreshResponseSchema.parse({
          success: true,
          token,
          expiresIn,
        }),
      );
    }

    return NextResponse.json(
      RefreshResponseSchema.parse({
        success: false,
        error: "无效的refresh token",
      }),
      { status: 401 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        RefreshResponseSchema.parse({
          success: false,
          error: "请求数据格式错误",
        }),
        { status: 400 },
      );
    }

    return NextResponse.json(
      RefreshResponseSchema.parse({
        success: false,
        error: "服务器内部错误",
      }),
      { status: 500 },
    );
  }
}
