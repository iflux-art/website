/**
 * 工具函数统一导出
 * 整合所有通用工具函数，避免重复实现
 */

// ==================== 通用辅助函数 ====================
export * from "@/utils/helpers";

// ==================== 网站解析工具 ====================
export * from "@/utils/website-parser";

// ==================== 日期格式化工具 ====================
/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式字符串，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: string | Date,
  format: string = "YYYY-MM-DD",
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

// ==================== 数据验证工具 ====================
/**
 * 验证登录请求数据
 */
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

/**
 * 验证刷新令牌请求数据
 */
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

  return { refreshToken };
}
