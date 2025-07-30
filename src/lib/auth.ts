// 配置项 - 实际项目中应从环境变量获取
const AUTH_CONFIG = {
  adminUsername: "admin",
  adminPassword: "password",
  tokenSecret: "demo-secret",
  tokenExpiresShort: 2 * 60 * 60, // 2小时
  tokenExpiresLong: 30 * 24 * 60 * 60, // 30天
  refreshTokenExpires: 7 * 24 * 60 * 60, // 7天
};

// 验证token - 简化版，实际项目应使用JWT等
function validateToken(token: string | null): boolean {
  if (!token) return false;
  return token.startsWith("demo-token-");
}

function validateRefreshToken(token: string | null): boolean {
  if (!token) return false;
  return token.startsWith("demo-refresh-token-");
}

export async function refreshToken(refreshToken: string): Promise<{
  success: boolean;
  token?: string;
  expiresIn?: number;
  error?: string;
}> {
  try {
    if (!validateRefreshToken(refreshToken)) {
      return {
        success: false,
        error: "无效的refresh token",
      };
    }

    const token = `demo-token-${Math.random().toString(36).substring(2)}`;
    const expiresIn = AUTH_CONFIG.tokenExpiresShort;

    return {
      success: true,
      token,
      expiresIn,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "刷新token失败",
    };
  }
}

export async function logout(token: string | null): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (!validateToken(token)) {
      return {
        success: false,
        error: "无效的token",
      };
    }

    // 模拟登出 - 实际项目中应使token失效
    return {
      success: true,
      message: "登出成功",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "登出失败",
    };
  }
}

export async function login(
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

      return {
        success: true,
        token,
        expiresIn,
      };
    }

    return {
      success: false,
      error: "用户名或密码错误",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "登录失败",
    };
  }
}
