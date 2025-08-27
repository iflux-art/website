import { create } from "zustand";
import type { BlogPost } from "@/features/blog/types";

// 博客页面状态类型
export interface BlogPageState {
  // 数据状态
  posts: BlogPost[];
  loading: boolean;

  // 过滤状态
  category: string | undefined;
  tag: string | undefined;
}

// 博客页面状态管理动作
export interface BlogPageActions {
  setPosts: (posts: BlogPost[]) => void;
  setLoading: (loading: boolean) => void;
  setCategory: (category: string | undefined) => void;
  setTag: (tag: string | undefined) => void;
  resetBlogPageState: () => void;
}

// 博客页面派生状态
export interface BlogPageDerivedState {
  // 派生状态：过滤后的文章
  filteredPosts: BlogPost[];
  // 派生状态：分类统计
  categoriesCount: Record<string, number>;
  // 派生状态：标签统计
  tagsCount: Record<string, number>;
  // 派生状态：相关文章
  relatedPosts: Array<{
    title: string;
    href: string;
    category: string | undefined;
    slug: string[];
  }>;
  // 派生状态：最新文章
  latestPosts: Array<{
    title: string;
    href: string;
    date: string | undefined;
    category: string | undefined;
  }>;
}

export interface BlogPageStore extends BlogPageState, BlogPageActions, BlogPageDerivedState {}

export const useBlogPageStore = create<BlogPageStore>((set, get) => ({
  // 初始状态
  posts: [],
  loading: true,
  category: undefined,
  tag: undefined,

  // Actions
  setPosts: posts => set({ posts }),
  setLoading: loading => set({ loading }),
  setCategory: category => set({ category }),
  setTag: tag => set({ tag }),
  resetBlogPageState: () => ({
    posts: [],
    loading: true,
    category: undefined,
    tag: undefined,
  }),

  // 派生状态（使用 getter 函数实现）
  get filteredPosts() {
    const state = get();
    return state.posts.filter(post => {
      if (state.category && post.category !== state.category) return false;
      if (state.tag && !post.tags?.includes(state.tag)) return false;
      return true;
    });
  },
  get categoriesCount() {
    const state = get();
    const categoriesCount: Record<string, number> = {};
    state.posts.forEach(post => {
      if (post.category) {
        categoriesCount[post.category] = (categoriesCount[post.category] || 0) + 1;
      }
    });
    return categoriesCount;
  },
  get tagsCount() {
    const state = get();
    const tagsCount: Record<string, number> = {};
    state.posts.forEach(post => {
      post.tags?.forEach(tag => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1;
      });
    });
    return tagsCount;
  },
  get relatedPosts() {
    const state = get();
    return state.posts.slice(0, 10).map(post => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      category: post.category,
      slug: post.slug.split("/"),
    }));
  },
  get latestPosts() {
    const state = get();
    return state.posts
      .filter(post => post.date)
      .slice(0, 5)
      .map(post => ({
        title: post.title,
        href: `/blog/${post.slug}`,
        date: post.date?.toString(),
        category: post.category,
      }));
  },
}));
