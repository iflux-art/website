// 移除未使用的 Tool, ToolCategory, ToolTag import
// ...原有工具函数内容...

/**
 * 计算器表达式求值工具
 * 支持基础四则运算和括号
 */
export function evaluateExpression(expression: string): {
  success: boolean;
  data?: string;
  error?: string;
} {
  try {
    // 仅允许数字、运算符和括号，防止注入
    if (!/^[\d+\-*/().\s]+$/.test(expression)) {
      return { success: false, error: "表达式包含非法字符" };
    }
    // eslint-disable-next-line no-eval
    const result = Function(
      `"use strict";return (${expression.replace(/÷/g, "/").replace(/×/g, "*")})`,
    )();
    if (typeof result === "number" && isFinite(result)) {
      return { success: true, data: String(result) };
    }
    return { success: false, error: "表达式无效" };
  } catch (e: any) {
    return { success: false, error: e?.message || "计算错误" };
  }
}
