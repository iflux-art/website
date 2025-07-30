export function validateRefreshRequest(data: unknown): {
  refreshToken: string;
} {
  if (typeof data !== "object" || data === null) {
    throw new Error("请求数据格式错误");
  }

  const { refreshToken } = data as Record<string, unknown>;

  if (typeof refreshToken !== "string" || refreshToken.length < 10) {
    throw new Error("refresh token 至少需要10个字符");
  }

  return {
    refreshToken,
  };
}

export function validateLoginRequest(data: unknown): {
  username: string;
  password: string;
  rememberMe: boolean;
} {
  if (typeof data !== "object" || data === null) {
    throw new Error("请求数据格式错误");
  }

  const { username, password, rememberMe } = data as Record<string, unknown>;

  if (typeof username !== "string" || username.length < 3) {
    throw new Error("用户名至少需要3个字符");
  }

  if (typeof password !== "string" || password.length < 6) {
    throw new Error("密码至少需要6个字符");
  }

  return {
    username,
    password,
    rememberMe: typeof rememberMe === "boolean" ? rememberMe : false,
  };
}
