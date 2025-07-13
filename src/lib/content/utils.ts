import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface ScanOptions {
  contentDir: string;
  indexFiles?: string[];
  extensions?: string[];
  excludePrefix?: string;
  filter?: (itemPath: string) => boolean;
}

/**
 * 通用目录扫描函数
 */
export function scanContentDirectory(
  options: ScanOptions,
): { slug: string[] }[] {
  const {
    contentDir,
    indexFiles = ["index.mdx", "index.md"],
    extensions = [".mdx", ".md"],
    excludePrefix = "_",
    filter = () => true,
  } = options;

  const paths: { slug: string[] }[] = [];

  function scan(dir: string, currentSlug: string[] = []) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        if (item.name.startsWith(excludePrefix)) continue;

        const newSlug = [...currentSlug, item.name];
        let hasIndex = false;

        // 检查目录中是否有index文件
        for (const indexFile of indexFiles) {
          const indexPath = path.join(itemPath, indexFile);
          if (fs.existsSync(indexPath) && filter(indexPath)) {
            paths.push({ slug: newSlug });
            hasIndex = true;
            break;
          }
        }

        if (!hasIndex) {
          scan(itemPath, newSlug);
        }
      } else if (
        item.isFile() &&
        extensions.some((ext) => item.name.endsWith(ext)) &&
        !item.name.startsWith(excludePrefix) &&
        !indexFiles.includes(item.name) &&
        filter(itemPath)
      ) {
        const fileName = item.name.replace(
          new RegExp(`(${extensions.join("|")})$`),
          "",
        );
        paths.push({ slug: [...currentSlug, fileName] });
      }
    }
  }

  scan(contentDir);
  return paths;
}

/**
 * 生成文档路径
 */
export function generateDocPaths(): { slug: string[] }[] {
  return scanContentDirectory({
    contentDir: path.join(process.cwd(), "src", "content", "docs"),
    excludePrefix: "_",
  });
}

/**
 * 生成博客路径
 */
export function generateBlogPaths(): { slug: string[] }[] {
  return scanContentDirectory({
    contentDir: path.join(process.cwd(), "src", "content", "blog"),
    excludePrefix: "_",
    filter: (itemPath) => {
      try {
        const content = fs.readFileSync(itemPath, "utf8");
        const { data } = matter(content);
        return data.published !== false;
      } catch {
        return false;
      }
    },
  });
}
