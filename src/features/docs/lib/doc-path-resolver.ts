import fs from "node:fs";
import path from "node:path";

/**
 * 路径解析结果类型
 */
export interface PathResolutionResult {
  type: "valid" | "redirect" | "notfound";
  redirectTo?: string;
  normalizedSlug?: string[];
}

/**
 * 检查路径是否有效（实际存在于文件系统中）
 * @param slug 文档路径数组
 * @returns 路径是否有效
 */
export function isValidDocPath(slug: string[]): boolean {
  // 特殊处理：项目信息和技术栈路径无效
  if (slug[0] === "project" && (slug[1] === "项目信息" || slug[1] === "技术栈")) {
    return false;
  }

  // 其他路径检查逻辑
  const docsDir = path.join(process.cwd(), "src", "content", "docs");
  const absolutePath = path.join(docsDir, ...slug);

  // 检查是否存在.md或.mdx文件
  if (fs.existsSync(`${absolutePath}.mdx`) || fs.existsSync(`${absolutePath}.md`)) {
    return true;
  }

  // 检查是否存在目录且包含index文件
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
    for (const indexFile of ["index.mdx", "index.md"]) {
      if (fs.existsSync(path.join(absolutePath, indexFile))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 解析文档路径，处理重定向和验证逻辑
 * @param slug 文档路径数组
 * @returns 路径解析结果
 */
export function resolveDocPath(slug: string[]): PathResolutionResult {
  // 验证路径格式
  if (!Array.isArray(slug) || slug.length === 0) {
    return { type: "notfound" };
  }

  // 检查路径有效性
  if (!isValidDocPath(slug)) {
    return { type: "notfound" };
  }

  // 路径有效，返回正常结果
  return {
    type: "valid",
    normalizedSlug: slug,
  };
}

/**
 * 检查是否为重定向循环
 * @param currentPath 当前路径
 * @param redirectTo 重定向目标路径
 * @returns 是否为重定向循环
 */
export function isRedirectLoop(currentPath: string, redirectTo: string): boolean {
  return currentPath === redirectTo;
}

/**
 * 规范化文档路径，确保路径格式正确
 * @param slug 原始路径数组
 * @returns 规范化后的路径数组
 */
export function normalizeDocPath(slug: string[]): string[] {
  return slug
    .filter(segment => segment && typeof segment === "string" && segment.trim())
    .map(segment => segment.trim());
}
