import { NextRequest, NextResponse } from "next/server";

// 验证token - 简化版，实际项目应使用JWT等
function validateToken(token: string | null): boolean {
  if (!token) return false;
  return token.startsWith("demo-token-");
}

// 登出业务逻辑
async function logout(token: string | null): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (!validateToken(token)) {
      return { success: false, error: "无效的token" };
    }

    // 模拟登出 - 实际项目中应使token失效
    return { success: true, message: "登出成功" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "登出失败",
    };
  }
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 从请求头获取token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || null;

    // 执行登出
    const result = await logout(token);

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(result, { status: 401 });
  } catch (error) {
    const response: LogoutResponse = {
      success: false,
      error: error instanceof Error ? error.message : "服务器内部错误",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
