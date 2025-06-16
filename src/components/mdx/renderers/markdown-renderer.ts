/**
 * 处理 MDX 内容的渲染器
 * 主要用于处理导航内容中的 ResourceCard 和 ResourceGrid 等特殊组件
 */

/**
 * 处理 MDX 内容，转换特殊组件的语法
 * @param content 原始 MDX 内容
 * @returns 处理后的内容
 */
export function processMdxContent(content: string): string {
  if (!content) return '';

  // 处理 ResourceCard 组件
  content = processResourceCard(content);

  // 处理 ResourceGrid 组件
  content = processResourceGrid(content);

  return content;
}

/**
 * 处理 ResourceCard 组件的语法
 */
function processResourceCard(content: string): string {
  // 匹配 <ResourceCard> 组件的正则表达式
  const resourceCardRegex = /<ResourceCard([^>]*)>([\s\S]*?)<\/ResourceCard>/g;

  return content.replace(resourceCardRegex, (match, props, children) => {
    // 转换为 Markdown 格式
    return `\n::: resource-card${props}\n${children.trim()}\n:::\n`;
  });
}

/**
 * 处理 ResourceGrid 组件的语法
 */
function processResourceGrid(content: string): string {
  // 匹配 <ResourceGrid> 组件的正则表达式
  const resourceGridRegex = /<ResourceGrid([^>]*)>([\s\S]*?)<\/ResourceGrid>/g;

  return content.replace(resourceGridRegex, (match, props, children) => {
    // 转换为 Markdown 格式
    return `\n::: resource-grid${props}\n${children.trim()}\n:::\n`;
  });
}
