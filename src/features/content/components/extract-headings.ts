/**
 * 内容提取工具函数
 * 从 Markdown/MDX 内容中提取标题并更新内容
 * 内联所有相关类型和逻辑，避免外部依赖
 */

// 内联标题相关类型定义
export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
  let match;
  let processedContent = content;

  // 首先提取所有标题
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    // 解析markdown链接格式 [text](url)
    const linkMatch = text.match(/\[([^\]]+)\]\([^)]+\)/);
    const finalText = linkMatch ? linkMatch[1] : text;
    const customId = match[3];
    const id =
      customId ||
      `heading-${finalText
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')}-${match.index}`;

    if (level >= 1 && level <= 4) {
      headings.push({ id, text: finalText, level });
    }
  }

  // 确保所有标题都有唯一ID
  headings.forEach(heading => {
    const escapedText = escapeRegExp(heading.text);
    const headingRegex = new RegExp(
      `^(#{${heading.level}})\\s+(?:\\[[^\\]]+\\]\\([^)]+\\)|${escapedText})(?:\\s*{#[\\w-]+})?$`,
      'gm'
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
