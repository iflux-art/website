import { NextRequest, NextResponse } from "next/server";

// 定义请求体类型
interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// 定义响应体类型
interface LoginResponse {
  success: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}

// 验证函数
function validateLoginRequest(data: any): LoginRequest {
  if (typeof data !== "object" || data === null) {
    throw new Error("请求数据格式错误");
  }

  if (typeof data.username !== "string" || data.username.length < 3) {
    throw new Error("用户名至少需要3个字符");
  }

  if (typeof data.password !== "string" || data.password.length < 6) {
    throw new Error("密码至少需要6个字符");
  }

  return {
    username: data.username,
    password: data.password,
    rememberMe: data.rememberMe ?? false,
  };
}

export async function POST(request: NextRequest) {
  try {
    // 验证请求体
    const requestBody = await request.json();
    const { username, password, rememberMe } =
      validateLoginRequest(requestBody);

    // 模拟认证逻辑 - 实际项目中替换为真实认证
    if (username === "admin" && password === "password") {
      const expiresIn = rememberMe ? 30 * 24 * 60 * 60 : 2 * 60 * 60; // 30天或2小时
      const token = "demo-token-" + Math.random().toString(36).substring(2);

      const response: LoginResponse = {
        success: true,
        token,
        expiresIn,
      };

      return NextResponse.json(response);
    }

    const response: LoginResponse = {
      success: false,
      error: "用户名或密码错误",
    };

    return NextResponse.json(response, { status: 401 });
  } catch (error) {
    const response: LoginResponse = {
      success: false,
      error: error instanceof Error ? error.message : "服务器内部错误",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
