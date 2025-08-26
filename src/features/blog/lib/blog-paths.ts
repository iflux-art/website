import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

interface ContentItem {
  slug: string[];
}

export function scanContentDirectory(options: {
  contentDir: string;
  indexFiles?: string[];
  extensions?: string[];
  excludePrefix?: string;
  filter?: (itemPath: string) => boolean;
}): ContentItem[] {
  const {
    contentDir,
    indexFiles = ["index.mdx", "index.md"],
    extensions = [".mdx", ".md"],
    excludePrefix = "_",
    filter = () => true,
  } = options;

  const paths: ContentItem[] = [];

  function scan(dir: string, currentSlug: string[] = []) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.name.startsWith(excludePrefix)) continue;

      const itemPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        scan(itemPath, [...currentSlug, item.name]);
      } else if (item.isFile()) {
        const ext = path.extname(item.name);
        if (extensions.includes(ext)) {
          const fileName = path.basename(item.name, ext);
          if (indexFiles.includes(item.name)) {
            paths.push({ slug: currentSlug });
          } else if (filter(itemPath)) {
            paths.push({ slug: [...currentSlug, fileName] });
          }
        }
      }
    }
  }

  scan(contentDir);
  return paths;
}

export function generateBlogPaths(): ContentItem[] {
  return scanContentDirectory({
    contentDir: path.join(process.cwd(), "src", "content", "blog"),
    excludePrefix: "_",
    filter: itemPath => {
      const fileContent = fs.readFileSync(itemPath, "utf8");
      const { data } = matter(fileContent);
      return data.published !== false;
    },
  });
}
