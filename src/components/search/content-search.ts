import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ContentItem {
  title: string;
  description: string;
  url: string;
  type: "doc" | "blog" | "tool" | "web";
  content?: string;
  excerpt?: string;
  tags?: string[];
  date?: string;
  slug: string;
  filePath: string;
  highlights?: {
    title?: string;
    content?: string[];
  };
}

// 获取所有内容文件
export function getAllContentFiles(): ContentItem[] {
  const contentDir = path.join(process.cwd(), "src/content");
  const items: ContentItem[] = [];

  function scanDirectory(dir: string, baseType: "doc" | "blog" = "doc") {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // 递归扫描子目录
        scanDirectory(filePath, baseType);
      } else if (file.endsWith(".mdx") && !file.startsWith("_")) {
        try {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const { data: frontmatter, content } = matter(fileContent);

          // 生成URL路径
          const relativePath = path.relative(contentDir, filePath);
          const urlPath = relativePath
            .replace(/\\/g, "/")
            .replace(/\.mdx$/, "")
            .replace(/\/index$/, "");

          // 确定内容类型
          let type: "doc" | "blog" | "tool" | "web" = "doc";
          if (relativePath.startsWith("blog")) {
            type = "blog";
          } else if (relativePath.startsWith("docs")) {
            type = "doc";
          }

          // 生成摘要（取前200个字符）
          const plainContent = content
            .replace(/#{1,6}\s+/g, "") // 移除标题标记
            .replace(/\*\*([^*]+)\*\*/g, "$1") // 移除粗体标记
            .replace(/\*([^*]+)\*/g, "$1") // 移除斜体标记
            .replace(/`([^`]+)`/g, "$1") // 移除代码标记
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 移除链接标记
            .replace(/\n+/g, " ") // 替换换行为空格
            .trim();

          const excerpt =
            plainContent.length > 200
              ? plainContent.substring(0, 200) + "..."
              : plainContent;

          items.push({
            title: frontmatter.title || path.basename(file, ".mdx"),
            description: frontmatter.excerpt || excerpt,
            url: `/${urlPath}`,
            type,
            content: plainContent,
            excerpt: frontmatter.excerpt || excerpt,
            tags: frontmatter.tags || [],
            date: frontmatter.date,
            slug: path.basename(file, ".mdx"),
            filePath: relativePath,
          });
        } catch {
          // Error reading file
        }
      }
    }
  }

  // 扫描docs目录
  scanDirectory(path.join(contentDir, "docs"), "doc");

  // 扫描blog目录
  scanDirectory(path.join(contentDir, "blog"), "blog");

  return items;
}

// 搜索内容
export function searchContent(query: string, limit: number = 8): ContentItem[] {
  if (!query.trim()) return [];

  const allContent = getAllContentFiles();
  const lowerQuery = query.toLowerCase();
  const results: (ContentItem & { score: number })[] = [];

  for (const item of allContent) {
    let score = 0;
    const highlights: { title?: string; content?: string[] } = {};

    // 搜索标题（权重最高）
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    if (titleMatch) {
      score += 10;
      highlights.title = highlightText(item.title, query);
    }

    // 搜索描述
    const descMatch = item.description.toLowerCase().includes(lowerQuery);
    if (descMatch) {
      score += 5;
    }

    // 搜索标签
    const tagMatch = item.tags?.some((tag) =>
      tag.toLowerCase().includes(lowerQuery),
    );
    if (tagMatch) {
      score += 3;
    }

    // 搜索内容
    const contentMatches = findContentMatches(item.content || "", query);
    if (contentMatches.length > 0) {
      score += contentMatches.length;
      highlights.content = contentMatches;
    }

    if (score > 0) {
      results.push({
        ...item,
        score,
        highlights,
      });
    }
  }

  // 按分数排序并返回限定数量的结果
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _score, ...item }) => item);
}

// 高亮文本
function highlightText(text: string, query: string): string {
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// 查找内容匹配项
function findContentMatches(
  content: string,
  query: string,
  maxMatches: number = 3,
): string[] {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matches: string[] = [];

  let startIndex = 0;

  while (matches.length < maxMatches) {
    const index = lowerContent.indexOf(lowerQuery, startIndex);
    if (index === -1) break;

    // 获取匹配周围的上下文（前后各50个字符）
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 50);
    let context = content.substring(start, end);

    // 如果不是从开头开始，添加省略号
    if (start > 0) context = "..." + context;
    if (end < content.length) context = context + "...";

    // 高亮匹配的文本
    const highlightedContext = highlightText(context, query);
    matches.push(highlightedContext);

    startIndex = index + query.length;
  }

  return matches;
}

// 转义正则表达式特殊字符
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
