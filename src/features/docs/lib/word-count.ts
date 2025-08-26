/**
 * 计算文档中的字数
 * @param text 文档内容
 * @returns 字数统计(中文字符数 + 英文单词数)
 */
export function countWords(text: string): number {
  const cleanText = text
    .replace(/```[\s\S]*?```/g, "") // 移除代码块
    .replace(/`[^`]*`/g, "") // 移除行内代码
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 替换链接为链接文本
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // 替换图片为图片描述
    .replace(/<[^>]*>/g, "") // 移除HTML标签
    .replace(/[#*_~>|-]/g, "") // 移除Markdown标记符号
    .replace(/\s+/g, " ") // 合并多个空格
    .trim();

  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) ?? [];
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 0);

  return chineseChars.length + englishWords.length;
}
