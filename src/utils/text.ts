/**
 * 文本处理工具函数
 */

/**
 * 计算文本中的字数
 *
 * @param text 要计算字数的文本
 * @returns 字数统计
 */
export function countWords(text: string): number {
  // 移除 Markdown 语法和 HTML 标签
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 替换链接为链接文本
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // 替换图片为图片描述
    .replace(/<[^>]*>/g, '') // 移除 HTML 标签
    .replace(/[#*_~>|-]/g, '') // 移除 Markdown 标记符号
    .replace(/\s+/g, ' ') // 将多个空白字符替换为单个空格
    .trim();

  // 中文字符计数
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || [];

  // 英文单词计数（简单的按空格分割）
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
    .split(/\s+/)
    .filter(word => word.length > 0);

  // 返回中文字符数和英文单词数之和
  return chineseChars.length + englishWords.length;
}

/**
 * 将文本转换为 URL 友好的格式
 * @param text 要转换的文本
 * @returns URL 友好的字符串
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
};

/**
 * 格式化阅读时间
 * @param minutes 阅读时间（分钟）
 * @returns 格式化后的阅读时间
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '少于 1 分钟';
  } else if (minutes < 60) {
    return `${Math.ceil(minutes)} 分钟`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.ceil(minutes % 60);
    return `${hours} 小时 ${remainingMinutes} 分钟`;
  }
}
