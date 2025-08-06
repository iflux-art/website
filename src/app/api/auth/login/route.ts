import { NextRequest, NextResponse } from "next/server";
import { validateLoginRequest } from "@/utils";

// 配置项 - 实际项目中应从环境变量获取
const AUTH_CONFIG = {
  adminUsername: "admin",
  adminPassword: "password",
  tokenSecret: "demo-secret",
  tokenExpiresShort: 2 * 60 * 60, // 2小时
  tokenExpiresLong: 30 * 24 * 60 * 60, // 30天
  refreshTokenExpires: 7 * 24 * 60 * 60, // 7天
};

// 登录业务逻辑
async function login(
  username: string,
  password: string,
  rememberMe: boolean,
): Promise<{
  success: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}> {
  try {
    // 模拟认证 - 实际项目中使用数据库验证
    if (
      username === AUTH_CONFIG.adminUsername &&
      password === AUTH_CONFIG.adminPassword
    ) {
      const expiresIn = rememberMe
        ? AUTH_CONFIG.tokenExpiresLong
        : AUTH_CONFIG.tokenExpiresShort;
      const token = `demo-token-${Math.random().toString(36).substring(2)}`;

      return { success: true, token, expiresIn };
    }

    return { success: false, error: "用户名或密码错误" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "登录失败",
    };
  }
}

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 验证请求体
    const requestBody = await request.json();
    const { username, password, rememberMe } =
      validateLoginRequest(requestBody);

    // 执行登录
    const result = await login(username, password, rememberMe);

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(result, { status: 401 });
  } catch (error) {
    const response: LoginResponse = {
      success: false,
      error: error instanceof Error ? error.message : "服务器内部错误",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
