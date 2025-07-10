import { NextRequest, NextResponse } from "next/server";

// 定义响应体类型
interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(_request: NextRequest) {
  try {
    // 模拟登出逻辑 - 实际项目中清除token等
    const response: LogoutResponse = {
      success: true,
      message: "登出成功",
    };

    return NextResponse.json(response);
  } catch {
    const response: LogoutResponse = {
      success: false,
      error: "服务器内部错误",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
