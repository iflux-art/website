/**
 * 标题项类型
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
 * 从 Markdown/MDX 内容中提取标题并更新内容
 * @param content Markdown/MDX 内容
 * @returns 标题列表和处理后的内容
 */
export function extractHeadings(content: string): {
  headings: Heading[];
  processedContent: string;
} {
  const headings: Heading[] = [];
  const headingRegex = /^(#{1,4})\s+(.+?)(?:\s*{#([\w-]+)})?$/gm;
  let match;
  let processedContent = content;

  // 首先提取所有标题
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

  // 确保所有标题都有唯一ID
  headings.forEach((heading) => {
    const headingRegex = new RegExp(
      `^(#{${heading.level}})\\s+(${heading.text.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      )})(?:\\s*{#[\\w-]+})?$`,
      'gm'
    );
    processedContent = processedContent.replace(headingRegex, `$1 $2 {#${heading.id}}`);
  });

  return {
    headings,
    processedContent,
  };
}
