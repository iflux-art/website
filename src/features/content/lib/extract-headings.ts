/**
 * 内容提取工具函数
 * 从 Markdown/MDX 内容中提取标题并更新内容
 * 内联所有相关类型和逻辑，避免外部依赖
 */

import type { TocHeading } from "@/types/props-types";

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 从 Markdown/MDX 内容中提取标题并更新内容
 */
export function extractHeadings(content: string): {
  headings: TocHeading[];
  processedContent: string;
} {
  const headings: TocHeading[] = [];
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match: RegExpExecArray | null;
  let processedContent = content;

  // 首先提取所有标题
  match = headingRegex.exec(content);
  while (match !== null) {
    // 修复：添加空值检查
    if (match[1] && match[2]) {
      const level = match[1].length;
      const text = match[2].trim();
      // 解析markdown链接格式 [text](url)
      const linkMatch = text.match(/\[([^\]]+)\]\([^)]+\)/);
      // 使用可选链操作符修复Biome lint错误
      const finalText = linkMatch?.[1] ? linkMatch[1] : text;
      const customId = match[3];
      const id =
        customId ||
        `heading-${finalText
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "")}-${match.index}`;

      if (level >= 1 && level <= 4) {
        headings.push({ id, text: finalText, level });
      }
    }

    match = headingRegex.exec(content);
  }

  // 确保所有标题都有唯一ID
  headings.forEach(heading => {
    const escapedText = escapeRegExp(heading.text);
    const headingRegex = new RegExp(
      `^(#{${heading.level}})\\s+(?:\\[[^\\]]+\\]\\([^)]+\\)|${escapedText})(?:\\s*{#[\\w-]+})?$`,
      "gm"
    );
    processedContent = processedContent.replace(
      headingRegex,
      `$1 ${heading.text} {#${heading.id}}`
    );
  });

  return {
    headings,
    processedContent,
  };
}

// 导出 TocHeading 类型以供外部使用
export type { TocHeading };
