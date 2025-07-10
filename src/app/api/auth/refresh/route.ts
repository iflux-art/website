import { NextRequest, NextResponse } from "next/server";

// 定义请求体类型
interface RefreshRequest {
  refreshToken: string;
}

// 定义响应体类型
interface RefreshResponse {
  success: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}

// 验证函数
function validateRefreshRequest(data: any): RefreshRequest {
  if (typeof data !== "object" || data === null) {
    throw new Error("请求数据格式错误");
  }

  if (typeof data.refreshToken !== "string" || data.refreshToken.length < 10) {
    throw new Error("refresh token 至少需要10个字符");
  }

  return {
    refreshToken: data.refreshToken,
  };
}

export async function POST(request: NextRequest) {
  try {
    // 验证请求体
    const requestBody = await request.json();
    const { refreshToken } = validateRefreshRequest(requestBody);

    // 模拟刷新逻辑 - 实际项目中验证refreshToken并生成新token
    if (refreshToken.startsWith("demo-refresh-token-")) {
      const expiresIn = 2 * 60 * 60; // 2小时
      const token = "demo-token-" + Math.random().toString(36).substring(2);

      const response: RefreshResponse = {
        success: true,
        token,
        expiresIn,
      };

      return NextResponse.json(response);
    }

    const response: RefreshResponse = {
      success: false,
      error: "无效的refresh token",
    };

    return NextResponse.json(response, { status: 401 });
  } catch (error) {
    const response: RefreshResponse = {
      success: false,
      error: error instanceof Error ? error.message : "服务器内部错误",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
