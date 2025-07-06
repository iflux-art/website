import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { LRUCache } from "lru-cache";
import { BlogPost } from "@/types";
import chokidar from "chokidar";

// 博客文章缓存
const postsCache = new LRUCache<string, BlogPost[]>({
  max: 1, // 只需要缓存一个所有文章的列表
  ttl: 1000 * 60 * 5, // 5分钟过期
});

// 缓存键
const ALL_POSTS_CACHE_KEY = "all-posts";

/**
 * 从文件系统读取所有博客文章
 */
function getAllPostsFromFS(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "src", "content", "blog");
  if (!fs.existsSync(blogDir)) return [];

  const posts: BlogPost[] = [];

  const findPosts = (dir: string) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        findPosts(itemPath);
      } else if (
        item.isFile() &&
        (item.name.endsWith(".mdx") || item.name.endsWith(".md"))
      ) {
        const fileContent = fs.readFileSync(itemPath, "utf8");
        const { data } = matter(fileContent);

        if (data.published !== false) {
          const relativePath = path.relative(blogDir, itemPath);
          const pathParts = relativePath.split(path.sep);
          const slug =
            pathParts.length === 1
              ? pathParts[0].replace(/\.(mdx|md)$/, "")
              : `${pathParts.slice(0, -1).join("/")}/${pathParts.pop()?.replace(/\.(mdx|md)$/, "")}`;

          posts.push({
            slug,
            title: data.title || slug,
            description: data.description || "暂无描述",
            excerpt: data.excerpt || "点击阅读全文",
            date: data.date,
            tags: data.tags || [],
            category: data.category || "未分类",
          });
        }
      }
    }
  };

  findPosts(blogDir);

  // 按日期排序
  return posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

/**
 * 获取所有博客文章（带缓存）
 */
export function getAllPosts(): BlogPost[] {
  let posts = postsCache.get(ALL_POSTS_CACHE_KEY);

  if (!posts) {
    posts = getAllPostsFromFS();
    postsCache.set(ALL_POSTS_CACHE_KEY, posts);
  }

  return posts;
}

/**
 * 获取分页的博客文章
 */
export function getPaginatedPosts(
  page: number = 1,
  limit: number = 10,
  filters?: {
    tag?: string;
    category?: string;
  },
): {
  posts: BlogPost[];
  total: number;
  totalPages: number;
} {
  let posts = getAllPosts();

  // 应用过滤
  if (filters) {
    if (filters.tag) {
      posts = posts.filter((post) =>
        post.tags?.includes(filters.tag as string),
      );
    }
    if (filters.category) {
      posts = posts.filter((post) => post.category === filters.category);
    }
  }

  const total = posts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    posts: posts.slice(start, end),
    total,
    totalPages,
  };
}

/**
 * 清除文章缓存
 */
export function clearPostsCache() {
  postsCache.delete(ALL_POSTS_CACHE_KEY);
}

// 在开发环境中监听文件变化
if (process.env.NODE_ENV === "development") {
  const watcher = chokidar.watch("src/content/blog/**/*.{md,mdx}");
  watcher.on("change", () => {
    clearPostsCache();
  });
}

/**
 * 获取所有标签（带统计）
 */
export function getAllTagsWithStats(): Array<{ name: string; count: number }> {
  const posts = getAllPosts();
  const tagStats = new Map<string, number>();

  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      tagStats.set(tag, (tagStats.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagStats.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * 获取热门标签
 */
export function getPopularTags(
  limit: number = 10,
): Array<{ name: string; count: number }> {
  return getAllTagsWithStats().slice(0, limit);
}

/**
 * 获取相关标签
 * 根据指定标签查找经常一起使用的其他标签
 */
export function getRelatedTags(
  tag: string,
  limit: number = 5,
): Array<{ name: string; count: number }> {
  const posts = getAllPosts().filter((post) => post.tags?.includes(tag));
  const relatedTagStats = new Map<string, number>();

  posts.forEach((post) => {
    post.tags?.forEach((t) => {
      if (t !== tag) {
        relatedTagStats.set(t, (relatedTagStats.get(t) || 0) + 1);
      }
    });
  });

  return Array.from(relatedTagStats.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/**
 * 按年份分组获取博客文章
 */
export interface TimelineOptions {
  startYear?: number;
  endYear?: number;
  limit?: number;
  tag?: string;
  excludeYearsWithNoPosts?: boolean;
}

export interface TimelineResult {
  years: Record<string, BlogPost[]>;
  totalPosts: number;
  yearRange: {
    start: number;
    end: number;
  };
}

export function getPostsByTimeline(
  options: TimelineOptions = {},
): TimelineResult {
  const {
    startYear,
    endYear,
    limit,
    tag,
    excludeYearsWithNoPosts = true,
  } = options;

  // 获取所有文章
  let posts = getAllPosts();

  // 应用标签过滤
  if (tag) {
    posts = posts.filter((post) => post.tags?.includes(tag));
  }

  // 按年份分组
  const postsByYear: Record<string, BlogPost[]> = {};
  let minYear = Infinity;
  let maxYear = -Infinity;

  posts.forEach((post) => {
    if (post.date) {
      const year = new Date(post.date).getFullYear();

      // 检查年份范围
      if ((!startYear || year >= startYear) && (!endYear || year <= endYear)) {
        minYear = Math.min(minYear, year);
        maxYear = Math.max(maxYear, year);

        if (!postsByYear[year]) {
          postsByYear[year] = [];
        }
        postsByYear[year].push(post);
      }
    }
  });

  // 确保所有年份都有条目（如果需要）
  if (
    !excludeYearsWithNoPosts &&
    minYear !== Infinity &&
    maxYear !== -Infinity
  ) {
    for (let year = minYear; year <= maxYear; year++) {
      if (!postsByYear[year]) {
        postsByYear[year] = [];
      }
    }
  }

  // 对每个年份内的文章按日期排序
  Object.keys(postsByYear).forEach((year) => {
    postsByYear[year].sort(
      (a, b) =>
        new Date(b.date || "").getTime() - new Date(a.date || "").getTime(),
    );

    // 应用每年的文章数限制
    if (limit) {
      postsByYear[year] = postsByYear[year].slice(0, limit);
    }
  });

  return {
    years: postsByYear,
    totalPosts: Object.values(postsByYear).reduce(
      (sum, posts) => sum + posts.length,
      0,
    ),
    yearRange: {
      start: minYear === Infinity ? 0 : minYear,
      end: maxYear === -Infinity ? 0 : maxYear,
    },
  };
}
