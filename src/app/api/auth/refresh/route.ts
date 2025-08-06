import { NextRequest, NextResponse } from "next/server";
import { validateRefreshRequest } from "@/utils";

// 验证refresh token - 简化版，实际项目应使用JWT等
function validateRefreshToken(token: string | null): boolean {
  if (!token) return false;
  return token.startsWith("demo-refresh-token-");
}

// 刷新token业务逻辑
async function refreshToken(refreshToken: string): Promise<{
  success: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}> {
  try {
    if (!validateRefreshToken(refreshToken)) {
      return { success: false, error: "无效的refresh token" };
    }

    const token = `demo-token-${Math.random().toString(36).substring(2)}`;
    const expiresIn = 2 * 60 * 60; // 2小时

    return { success: true, token, expiresIn };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "刷新token失败",
    };
  }
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  success: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { refreshToken: refreshTokenValue } =
      validateRefreshRequest(requestBody);

    // 执行刷新token
    const result = await refreshToken(refreshTokenValue);

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(result, { status: 401 });
  } catch (error) {
    const response: RefreshResponse = {
      success: false,
      error: error instanceof Error ? error.message : "服务器内部错误",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
