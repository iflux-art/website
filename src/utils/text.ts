/**
 * 计算文本中的字数
 *
 * @param text 要计算字数的文本
 * @returns 字数统计
 */
export function countWords(text: string): number {
  // 移除 Markdown 语法和 HTML 标签
  const cleanText = text
    .replace(/```[\s\S]*?```/g, "") // 移除代码块
    .replace(/`[^`]*`/g, "") // 移除行内代码
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 替换链接为链接文本
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // 替换图片为图片描述
    .replace(/<[^>]*>/g, "") // 移除 HTML 标签
    .replace(/[#*_~>|-]/g, "") // 移除 Markdown 标记符号
    .replace(/\s+/g, " ") // 将多个空白字符替换为单个空格
    .trim();

  // 中文字符计数
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || [];

  // 英文单词计数（简单的按空格分割）
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, "") // 移除中文字符
    .split(/\s+/)
    .filter((word) => word.length > 0);

  // 返回中文字符数和英文单词数之和
  return chineseChars.length + englishWords.length;
}
