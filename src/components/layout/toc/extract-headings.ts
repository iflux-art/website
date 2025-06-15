
/**
 * 从 Markdown/MDX 内容中提取标题
 */
export interface Heading {
  /** 标题ID */
  id: string;
  /** 标题文本 */
  text: string;
  /** 标题级别 (1-4) */
  level: number;
}

/**
 * 从 Markdown/MDX 内容中提取标题
 * @param content Markdown/MDX 内容
 * @returns 标题列表
 */
export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const customId = match[3];
    const id =
      customId ||
      `heading-${text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')}-${match.index}`;

    if (level >= 1 && level <= 4) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}
